import { createContext, useContext, useState, ReactNode } from "react";
import { List } from "../../../interfaces/entities/list";
import { Task } from "../../../interfaces/entities/task";

/**
 * The state of the ListsContext.
 */
interface ListsContextProps {
  selectedUuid: string | undefined;
  setSelectedUuid: Function;
  lists: Array<List>;
  tasksList: Array<TaskList>;
  createList: Function;
  createLists: Function;
  createTasks: Function;
  createTask: Function;
  updateList: Function;
  updateTask: Function;
  deleteList: Function;
  deleteLists: Function;
  deleteTask: Function;
}

/**
 * A list of Tasks.
 */
export interface TaskList {
  uuid: string;
  tasks: Array<Task>;
}

/**
 * The ListsContext.
 */
export const ListsContext = createContext<ListsContextProps>(null!);

/**
 * The ListsProvider React component that makes the ListsContext available in the app.
 * @param params - The input parameters.
 * @returns The ListsProvider React component.
 */
export const ListsProvider = ({ children }: { children?: ReactNode }) => {
  const [selectedUuid, setSelectedUuid] = useState<string>();
  const [lists, setLists] = useState<List[]>([]);
  const [tasksList, setTasks] = useState<TaskList[]>([]);

  /**
   * Creates a new List in the state.
   * @param list The List to create.
   */
  const createList = (list: List) => {
    setLists([...lists, list]);
    setTasks([...tasksList, { uuid: list.uuid, tasks: [] }]);
    setSelectedUuid(list.uuid);
  };

  /**
   * Creates a new array of List in the state.
   * @param lists The Array of List to create in the state.
   */
  const createLists = (lists: Array<List>) => {
    setLists(lists);
    if (lists.length > 0) setSelectedUuid(lists[0].uuid);
  };

  /**
   * Creates a new array of TaskList in the state.
   * @param list The Array of TaskList to create in the state.
   */
  const createTasks = (list: TaskList[]) => {
    setTasks(list);
  };

  /**
   * Creates a new Task in the state.
   * @param listUuid - The UUID of the list the task is a part of.
   * @param task - The Task.
   */
  const createTask = (listUuid: string, task: Task) => {
    setTasks(
      tasksList.map((value) => {
        if (value.uuid === listUuid) {
          return {
            uuid: value.uuid,
            tasks: [...value.tasks, task],
          };
        } else {
          return value;
        }
      })
    );
  };

  /**
   * Updates a List in the state.
   * @param list - The updated List.
   */
  const updateList = (list: List) => {
    setLists(
      lists.map((value) => {
        if (value.uuid === list.uuid) {
          return {
            uuid: list.uuid,
            name: list.name,
          };
        } else {
          return value;
        }
      })
    );
  };

  /**
   * Updates a Task in the state.
   * @param listUuid - The UUID of the List the Task is a part of.
   * @param task - The new Task.
   */
  const updateTask = (listUuid: string, task: Task) => {
    setTasks(
      tasksList.map((list) => {
        if (list.uuid === listUuid) {
          return {
            uuid: list.uuid,
            tasks: list.tasks.map((value) => {
              if (value.uuid === task.uuid) {
                return {
                  uuid: value.uuid,
                  name: task.name,
                  complete: task.complete,
                };
              } else {
                return value;
              }
            }),
          };
        } else {
          return list;
        }
      })
    );
  };

  /**
   * Deletes a List in the state.
   * @param uuid - The UUID of the List to delete.
   */
  const deleteList = (uuid: string) => {
    if (lists.length > 1 && lists[lists.length - 1].uuid === uuid) {
      setSelectedUuid(lists[lists.length - 2].uuid);
    } else if (lists.length === 1) {
      setSelectedUuid(undefined);
    } else if (lists[0].uuid === uuid) {
      setSelectedUuid(lists[1].uuid);
    }
    setLists(lists.filter((list) => list.uuid !== uuid));
    setTasks(tasksList.filter((value) => value.uuid === uuid));
  };

  /**
   * Deletes a Task in the state.
   * @param listUuid - The UUID of the list the Task is a part of.
   * @param taskUuid - The UUID of the Task to delete.
   */
  const deleteTask = (listUuid: string, taskUuid: string) => {
    setTasks(
      tasksList.map((list) => {
        if (list.uuid === listUuid) {
          return {
            uuid: list.uuid,
            tasks: list.tasks.filter((task) => task.uuid !== taskUuid),
          };
        } else {
          return list;
        }
      })
    );
  };

  /**
   * Deletes all Lists and Tasks.
   */
  const deleteLists = () => {
    setSelectedUuid(undefined);
    setLists([]);
    setTasks([]);
  };

  return (
    <ListsContext.Provider
      value={{
        selectedUuid,
        setSelectedUuid,
        lists,
        tasksList,
        createList,
        createLists,
        createTasks,
        createTask,
        updateList,
        updateTask,
        deleteList,
        deleteLists,
        deleteTask,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
};
