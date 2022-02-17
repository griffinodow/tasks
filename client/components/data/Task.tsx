import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import {
  MdOutlineCheckBoxOutlineBlank,
  MdEdit,
  MdDone,
  MdDelete,
} from "react-icons/md";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useLists } from "../../hooks/useLists";
import { fetchPutTask, fetchDeleteTask } from "../../utils/fetch/fetchTasks";
import styles from "./Task.module.css";

/**
 * The Task React component for showing a task.
 * @param params - The input parameters.
 * @returns The Task React component.
 */
export const Task = ({
  id,
  listUuid,
  uuid,
  name,
  complete,
  globalEditing,
  setGlobalEditing,
  handleFail,
}: {
  /**
   * The user ID.
   */
  id: string;
  /**
   * The UUID of the list the task is a part of.
   */
  listUuid: string;
  /**
   * The UUID of the task.
   */
  uuid: string;
  /**
   * The name of the task.
   */
  name: string;
  /**
   * If the task is complete.
   */
  complete: boolean;
  /**
   * The global editing state of tasks.
   */
  globalEditing: boolean;
  /**
   * Function to set the global editing state.
   */
  setGlobalEditing: Function;
  /**
   * The fail handler.
   */
  handleFail: Function;
}) => {
  const router = useRouter();
  const ref: any = useRef();
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name,
    },
  });
  const { updateTask, deleteTask } = useLists();

  /**
   * Disables the editing state if clicking outside of the task.
   */
  useEffect(() => {
    const checkIfClickedOutside = (event: Event) => {
      if (
        globalEditing &&
        editing &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setEditing(false);
        setGlobalEditing(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [globalEditing, editing, setGlobalEditing]);

  /**
   * Toggles the editing state of the task.
   */
  const handleToggleEditing = () => {
    setEditing(!editing);
    setGlobalEditing(!globalEditing);
  };

  /**
   * Handles toggling if the task is complete.
   */
  const handleToggleComplete = async () => {
    try {
      const originalTask = {
        uuid,
        name,
        complete,
      };
      const task = {
        uuid,
        name,
        complete: !complete,
      };
      updateTask(listUuid, task);
      const json = await fetchPutTask(id, listUuid, task);
      if (json.status === "fail") {
        updateTask(listUuid, originalTask);
        handleFail(json.messages);
      }
      if (json.status === "error") router.push("/500");
    } catch {
      router.push("/500");
    }
  };

  /**
   * Handles changing the name of the task.
   * @param data
   */
  const handleNameChange: SubmitHandler<FieldValues> = async (data) => {
    try {
      const originalTask = {
        uuid,
        name,
        complete,
      };
      const task = {
        uuid,
        name: data.name,
        complete,
      };
      if (name !== data.name) {
        updateTask(listUuid, task);
        const json = await fetchPutTask(id, listUuid, task);
        if (json.status === "fail") {
          updateTask(listUuid, originalTask);
          handleFail(json.messages);
        }
        if (json.status === "error") router.push("/500");
      }
      setEditing(false);
      setGlobalEditing(false);
      reset();
    } catch {
      router.push("/500");
    }
  };

  /**
   * Handles deleting the task.
   */
  const handleDeleteTask = async () => {
    try {
      deleteTask(listUuid, uuid);
      setEditing(false);
      setGlobalEditing(false);
      const json = await fetchDeleteTask(id, listUuid, uuid);
      if (json.status === "fail") {
        handleFail(json.messages);
      }
      if (json.status === "error") router.push("/500");
    } catch {
      router.push("/500");
    }
  };

  return (
    <div ref={ref} className={styles.task}>
      <section>
        <button onClick={handleToggleComplete}>
          {complete ? (
            <MdDone size={24} />
          ) : (
            <MdOutlineCheckBoxOutlineBlank size={24} />
          )}
        </button>
        {editing ? (
          <form
            onSubmit={handleSubmit(handleNameChange)}
            className={styles.form}
          >
            <input {...register("name", { required: true })}></input>
            <button type="submit">update</button>
          </form>
        ) : complete ? (
          <span>
            <del>{name}</del>
          </span>
        ) : (
          <span>{name}</span>
        )}
      </section>
      <section>
        {editing ? (
          <button onClick={handleDeleteTask}>
            <MdDelete size={24} />
          </button>
        ) : (
          !globalEditing && (
            <button onClick={handleToggleEditing}>
              <MdEdit size={24} />
            </button>
          )
        )}
      </section>
    </div>
  );
};
