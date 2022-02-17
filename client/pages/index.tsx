import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useUser } from "../hooks/useUser";
import { extractId } from "../utils/misc/extractId";
import { Header } from "../components/header/Header";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLists } from "../hooks/useLists";
import { Task } from "../../interfaces/entities/task";
import { List } from "../../interfaces/entities/list";
import { AddTaskForm } from "../components/forms/AddTaskForm";
import { Tasks } from "../components/data/Tasks";
import { fetchGetLists } from "../utils/fetch/fetchLists";
import { fetchGetTasks } from "../utils/fetch/fetchTasks";
import { Modal } from "../components/data/Modal";
import { TaskList } from "../components/providers/ListsProvider";
import {
  StatusError,
  StatusFail,
  StatusSuccess,
} from "../../interfaces/responses/statuses";

/**
 * The home page or app dashboard where lists can be seen when a user is logged in.
 * @param params - The input parameters.
 * @returns The Home React component.
 */
const Home = ({
  init,
}: {
  /**
   * Initialization values from SSR if available.
   */
  init: {
    /**
     * The user ID.
     */
    id: string;
    /**
     * The lists for the user.
     */
    lists: Array<List>;
    /**
     * The lists of tasks.
     */
    tasksList: Array<{
      /**
       * List UUID.
       */
      uuid: string;
      /**
       * The tasks in the list.
       */
      tasks: Array<Task>;
    }>;
  };
}) => {
  const router = useRouter();
  const { id } = useUser();
  const { selectedUuid, createLists, createTasks, tasksList } = useLists();
  const [modalOpen, setModalOpen] = useState(false);
  const [failMessages, setFailMessages] = useState<Array<string>>([]);

  /**
   * If the user ends up on the dashboard without an ID they will be redirected to login.
   */
  useEffect(() => {
    if (!id) router.push("/login");
  }, [id]);

  /**
   * If the user is missing any information it can be refetched.
   */
  useEffect(() => {
    const getLists = async () => {
      const res = await fetchGetLists(id || init.id);
      if (res.status === "success") {
        const lists = res.data.lists;
        const tasksList = [];
        const tasksResult = await Promise.all(
          lists.map((list: any) => fetchGetTasks(id || init.id, list.uuid))
        );

        for (let i = 0; i < lists.length; i++) {
          const currentTask = tasksResult[0] as
            | StatusSuccess<Task[]>
            | StatusFail
            | StatusError;
          if (currentTask.status === "success") {
            tasksList.push({
              uuid: lists[0].uuid,
              tasks: currentTask.data.tasks,
            });
          }
        }
        createLists(lists);
        createTasks(tasksList);
      }
    };

    if (init.lists) {
      createLists(init.lists);
      createTasks(init.tasksList);
    } else {
      getLists();
    }
  }, [init.lists, init.tasksList]);

  /**
   * Handles fail conditions with requests on the dashboard.
   * @param messages - The Array of fail messages.
   */
  const handleFail = (messages: Array<string>) => {
    setFailMessages(messages);
    setModalOpen(true);
  };

  return (
    <main className={styles.index}>
      <Head>
        <title>Tasks | Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header id={id || init.id} handleFail={handleFail} />
      <Tasks
        id={id || init.id}
        uuid={selectedUuid}
        tasksList={tasksList}
        handleFail={handleFail}
      />
      <AddTaskForm
        id={id || init.id}
        uuid={selectedUuid}
        handleFail={handleFail}
      />
      {modalOpen && (
        <Modal
          setModalOpen={setModalOpen}
          setMessages={setFailMessages}
          header="Failure"
          messages={failMessages}
        />
      )}
    </main>
  );
};

export default Home;

/**
 * Fetches all the users data and makes sure an ID is available before rendering the dashboard.
 * If the user ID is not available the user will be redirected to the login page.
 * @param context - The request context.
 * @returns The server side render props.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = extractId(context.req.headers.cookie);

    if (id) {
      const resLists = await fetchGetLists(id);
      if (resLists.status !== "success") throw Error("API Error");
      const lists = resLists.data.lists;
      const tasksList: Array<TaskList> = [];

      const tasksResult = (await Promise.all(
        lists.map((list: List) => fetchGetTasks(id, list.uuid))
      )) as any;

      for (let i = 0; i < lists.length; i++) {
        const currentTasks = tasksResult[i] as
          | StatusSuccess<Task[]>
          | StatusFail
          | StatusError;
        if (currentTasks.status !== "success") throw Error("API Error");
        if (currentTasks.status === "success") {
          tasksList.push({
            uuid: lists[i].uuid,
            tasks: currentTasks.data.tasks,
          });
        }
      }

      return {
        props: {
          init: { id, lists, tasksList },
        },
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/500",
        props: {
          source: "server",
        },
      },
    };
  }
};
