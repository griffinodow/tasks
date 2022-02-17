import { useState } from "react";
import { TaskList } from "../../components/providers/ListsProvider";
import { Task } from "./Task";
import styles from "./Tasks.module.css";

/**
 * The Tasks React component for showing a list of tasks.
 * @param params - The input parameters.
 * @returns The Tasks React component.
 */
export const Tasks = ({
  id,
  uuid,
  tasksList,
  handleFail,
}: {
  /**
   * The user ID.
   */
  id: string;
  /**
   * The UUID of the list.
   */
  uuid?: string;
  /**
   * The list of tasks.
   */
  tasksList: TaskList[];
  /**
   * The failure handler.
   */
  handleFail: Function;
}) => {
  const [globalEditing, setGlobalEditing] = useState(false);
  return uuid && tasksList.length > 0 ? (
    <div className={styles.tasks}>
      {tasksList
        .find((tasksList) => tasksList.uuid === uuid)
        ?.tasks.map((task) => (
          <Task
            id={id}
            key={task.uuid}
            listUuid={uuid}
            uuid={task.uuid}
            name={task.name}
            complete={task.complete}
            globalEditing={globalEditing}
            setGlobalEditing={setGlobalEditing}
            handleFail={handleFail}
          />
        ))}
    </div>
  ) : (
    <></>
  );
};
