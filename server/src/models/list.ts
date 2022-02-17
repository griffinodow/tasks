import { transaction } from "../utils/frameworks/postgresql";
import { List } from "../../../interfaces/entities/list";
import {
  StatusSuccess,
  StatusFail,
  StatusDelete,
} from "../../../interfaces/responses/statuses";
import { checkValidUuidV4 } from "../utils/misc/uuid";

/**
 * Creates a list.
 * @param id - ID of the user the list belongs to.
 * @param uuid - UUID of the list.
 * @param name - Name of the list.
 * @returns A promise that contains a `Result` or `ValidationFailure`.
 */
export const createList = async (
  id: string,
  uuid: string,
  name: string
): Promise<StatusSuccess<List> | StatusFail> => {
  // Validate
  const fails: Array<string> = [];
  let list: List | undefined;
  if (!uuid) fails.push("Uuid must be provided");
  if (!name) fails.push("Name must be provided");
  if (!checkValidUuidV4(uuid)) fails.push("Uuid is not in valid v4 format");

  // Query database
  if (fails.length === 0) {
    const INSERT_LIST =
      'INSERT INTO list ("user", name, "uuid") VALUES ($1, $2, $3) RETURNING "user", name, uuid';
    const result = await transaction(INSERT_LIST, [id, name, uuid]);
    list = result.map((row) => ({ uuid: row.uuid, name: row.name }))[0];
  }

  // Return result
  if (list && fails.length === 0) {
    return {
      status: "success",
      data: {
        list,
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
 * Finds all lists by this user.
 * @param id - The ID of the user.
 * @returns A promise that contains a `Result` or `ValidationFailure`
 */
export const findAllLists = async (
  id: string
): Promise<StatusSuccess<Array<List>>> => {
  // Query database
  const SELECT_LISTS =
    'SELECT "uuid", name FROM list WHERE "user"=$1 ORDER BY list.created_at ASC';
  const result = await transaction(SELECT_LISTS, [id]);
  let lists: Array<List> = result.map((row) => ({
    uuid: row.uuid,
    name: row.name,
  }));

  // Return result
  return {
    status: "success",
    data: {
      lists,
    },
  };
};

/**
 * Update a list.
 * @param id - ID of the user that owns the list.
 * @param uuid - UUID of the list.
 * @param name - Name of the list.
 * @returns A promise that contains a `Result` or `ValidationFailure`.
 */
export const updateList = async (
  id: string,
  uuid: string,
  name: string
): Promise<StatusSuccess<List> | StatusFail> => {
  // Validate
  const fails: Array<string> = [];
  let list: List | undefined;
  if (!name) fails.push("Name must be provided");
  if (!checkValidUuidV4(uuid)) fails.push("Uuid is not in valid v4 format");

  // Query database
  if (fails.length === 0) {
    const UPDATE_LIST =
      'UPDATE list SET name=$3 WHERE "user"=$1 AND "uuid"=$2 RETURNING "uuid", name';
    const result = await transaction(UPDATE_LIST, [id, uuid, name]);
    list = result.map((row) => ({ uuid: row.uuid, name: row.name }))[0];
    if (!list) fails.push("List does not exist");
  }

  // Return result
  if (list && fails.length === 0) {
    return {
      status: "success",
      data: {
        list,
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
 * Delete a list.
 * @param id - ID of the user that owns the list.
 * @param uuid - UUID of the list to delete.
 * @returns A promise that contains a `Result`.
 */
export const deleteList = async (
  id: string,
  uuid: string
): Promise<StatusDelete> => {
  // Query database
  const DELETE_LIST = 'DELETE FROM list WHERE "user"=$1 AND "uuid"=$2';
  await transaction(DELETE_LIST, [id, uuid]);

  // Return Result
  return {
    status: "success",
    data: null,
  };
};
