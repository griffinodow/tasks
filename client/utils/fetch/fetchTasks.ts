import { Task } from "../../../interfaces/entities/task";
import {
  StatusSuccess,
  StatusFail,
  StatusError,
  StatusDelete,
} from "../../../interfaces/responses/statuses";

/**
 * Fetches tasks for a user.
 * @param id - The user ID.
 * @param uuid - The UUID of the list the tasks are a part of.
 * @returns Response statuses with relevant information.
 */
export const fetchGetTasks = async (
  id: string,
  uuid: string
): Promise<StatusSuccess<Task[]> | StatusFail | StatusError> => {
  const res = await fetch(`http://localhost:5000/lists/${uuid}/tasks`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${id}`,
    },
  });
  const json = await res.json();
  return json;
};

/**
 * Creates a new task in a list with a fetch request.
 * @param id - The user ID.
 * @param listUuid - The list UUID.
 * @param task - The task to create.
 * @returns Response statuses with relevant information.
 */
export const fetchPostTask = async (
  id: string,
  listUuid: string,
  task: Task
): Promise<StatusSuccess<Task> | StatusFail | StatusError> => {
  const res = await fetch(`http://localhost:5000/lists/${listUuid}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${id}`,
    },
    body: JSON.stringify(task),
  });

  const json = await res.json();
  return json;
};

/**
 * Updates a task in a list with a fetch request.
 * @param id - The user ID.
 * @param listUuid - The list UUID.
 * @param task - The updated task.
 * @returns Response statuses with relevant information.
 */
export const fetchPutTask = async (
  id: string,
  listUuid: string,
  task: Task
): Promise<StatusSuccess<Task> | StatusFail | StatusError> => {
  const res = await fetch(
    `http://localhost:5000/lists/${listUuid}/tasks/${task.uuid}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${id}`,
      },
      body: JSON.stringify({
        name: task.name,
        complete: task.complete,
      }),
    }
  );

  const json = await res.json();
  return json;
};

/**
 * Deletes a list with a fetch request.
 * @param id - The user ID.
 * @param listUuid - The list UUID.
 * @param uuid - The task UUID.
 * @returns Response statuses with relevant information.
 */
export const fetchDeleteTask = async (
  id: string,
  listUuid: string,
  uuid: string
): Promise<StatusDelete | StatusFail | StatusError> => {
  const res = await fetch(
    `http://localhost:5000/lists/${listUuid}/tasks/${uuid}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${id}`,
      },
    }
  );

  const json = await res.json();
  return json;
};
