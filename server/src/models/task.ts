import { transaction } from "../utils/frameworks/postgresql";
import { Task } from "../../../interfaces/entities/task";
import {
  StatusSuccess,
  StatusFail,
  StatusDelete,
} from "../../../interfaces/responses/statuses";
import { checkValidUuidV4 } from "../utils/misc/uuid";

/**
 * Creates a task.
 * @param listUuid - UUID of the list the task is a part of.
 * @param uuid - UUID of the task.
 * @param name - Name of the task.
 * @param complete - Completion state of the task.
 * @returns A promise that contains a `Result`, `ValidationFailure`, or `ServerError`.
 */
export const createTask = async (
  listUuid: string,
  uuid: string,
  name: string,
  complete: boolean
): Promise<StatusSuccess<Task> | StatusFail> => {
  // Validate
  const fails: Array<string> = [];
  if (!uuid) fails.push("Uuid must be provided");
  if (!name) fails.push("Name must be provided");
  if (complete === undefined) fails.push("Complete must be provided");
  if (!checkValidUuidV4(listUuid))
    fails.push("List uuid is not in valid v4 format");
  if (!checkValidUuidV4(uuid)) fails.push("Uuid is not in valid v4 format");

  // Query database
  let task: Task | undefined;
  if (fails.length === 0) {
    const INSERT_TASK =
      'INSERT INTO task (list, name, complete, "uuid") VALUES ($1, $2, $3, $4) RETURNING list, name, complete, "uuid"';
    const result = await transaction(INSERT_TASK, [
      listUuid,
      name,
      complete,
      uuid,
    ]);
    task = result.map((row) => ({
      uuid: row.uuid,
      name: row.name,
      complete: row.complete,
    }))[0];
  }

  // Return result
  if (task && fails.length === 0) {
    return {
      status: "success",
      data: {
        task,
      },
    };
  } else {
    return {
      status: "fail",
      messages: fails,
    };
  }
};

/**
 * Finds all the tasks in the list.
 * @param id - The ID of the user.
 * @param listUuid - The UUID of the list.
 * @returns A promise that contains a `Result`, `ValidationFailure`, or `ServerError`.
 */
export const findAllTasks = async (
  id: string,
  listUuid: string
): Promise<StatusSuccess<Array<Task>> | StatusFail> => {
  // Validate
  const fails: Array<string> = [];
  if (!checkValidUuidV4(listUuid))
    fails.push("List uuid is not in valid v4 format");

  // Query database
  let tasks: Array<Task> | undefined;
  if (fails.length === 0) {
    const SELECT_TASKS =
      'SELECT task.uuid, task.name, task.complete FROM task LEFT JOIN list ON list.uuid=task.list WHERE "user"=$1 AND list.uuid=$2 ORDER BY task.created_at ASC';
    const result = await transaction(SELECT_TASKS, [id, listUuid]);
    tasks = result.map((row) => ({
      uuid: row.uuid,
      name: row.name,
      complete: row.complete,
    }));
  }

  // Return result
  if (tasks && fails.length === 0) {
    return {
      status: "success",
      data: {
        tasks,
      },
    };
  } else {
    return {
      status: "fail",
      messages: fails,
    };
  }
};

/**
 * Updates a task of the list.
 * @param id - ID of the user.
 * @param uuid - UUID of the task.
 * @param name - Name of the task.
 * @param complete - Completion state of the task.
 * @returns A promise that contains a `Result`, `ValidationFailure`, or `ServerError`.
 */
export const updateTask = async (
  id: string,
  uuid: string,
  name: string,
  complete: boolean
): Promise<StatusSuccess<Task> | StatusFail> => {
  // Validate
  const fails: Array<string> = [];
  if (!name) fails.push("Name must be provided");
  if (complete === undefined) fails.push("Complete must be provided");
  if (!checkValidUuidV4(uuid)) fails.push("Uuid is not in valid v4 format");

  // Query database
  let task: Task | undefined;
  if (fails.length === 0) {
    const UPDATE_TASK =
      'UPDATE task SET "name"=$3, complete=$4 FROM list WHERE list.uuid=task.list AND list.user=$1 AND list.uuid=task.list AND task.uuid=$2 RETURNING task.uuid, task.name, task.complete';
    const result = await transaction(UPDATE_TASK, [id, uuid, name, complete]);
    task = result.map((row) => ({
      uuid: row.uuid,
      name: row.name,
      complete: row.complete,
    }))[0];
  }

  // Return result
  if (task && fails.length === 0) {
    return {
      status: "success",
      data: {
        task,
      },
    };
  } else {
    return {
      status: "fail",
      messages: fails,
    };
  }
};

/**
 * Deletes a task from a list.
 * @param id - ID of the user that owns the task.
 * @param uuid - UUID of the task.
 * @returns A promise that contains a `Result`, `ValidationFailure`, or `ServerError`.
 */
export const deleteTask = async (
  id: string,
  uuid: string
): Promise<StatusDelete> => {
  const DELETE_TASK =
    "DELETE FROM task USING list WHERE task.list=list.uuid AND list.user=$1 AND task.uuid=$2";
  await transaction(DELETE_TASK, [id, uuid]);
  return {
    status: "success",
    data: null,
  };
};
