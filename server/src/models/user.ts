import { transaction } from "../utils/frameworks/postgresql";
import { User } from "../../../interfaces/entities/user";
import {
  StatusSuccess,
  StatusFail,
  StatusDelete,
} from "../../../interfaces/responses/statuses";
import { generateId, checkValidId } from "../utils/misc/id";

/**
 * Creates a new user in the database.
 * @returns A promise that contains a `Result` or `ValidationFailure`.
 */
export const createUser = async (): Promise<
  StatusSuccess<User> | StatusFail
> => {
  // Validate
  const fails: Array<string> = [];
  let id = generateId();

  // Query database
  const SELECT_USER = 'SELECT id FROM "user" WHERE id=$1 LIMIT 1';
  const INSERT_USER = 'INSERT INTO "user" (id) VALUES ($1) RETURNING id';
  let resSelectUser = await transaction(SELECT_USER, [id]);
  while (resSelectUser.length !== 0) {
    id = generateId();
    resSelectUser = await transaction(SELECT_USER, [id]);
  }

  const resInsertUser = await transaction(INSERT_USER, [id]);
  const user: User | undefined = resInsertUser.map((row) => ({
    id: row.id,
  }))[0];

  // Return result
  if (user && fails.length === 0) {
    return {
      status: "success",
      data: {
        user,
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
 * Finds a user in the database by their ID if they exist.
 * @param id - The ID of the user.
 * @returns A promise that contains a `Result` or `ValidationFailure`
 */
export const findUser = async (
  id: string
): Promise<StatusSuccess<User> | StatusFail> => {
  // Validate
  const fails: Array<string> = [];
  let user: User | undefined;
  if (!checkValidId(id)) fails.push("ID is not a valid format");

  // Query database
  if (fails.length === 0) {
    const SELECT_USER = 'SELECT id FROM "user" WHERE id=$1 LIMIT 1';
    const result = await transaction(SELECT_USER, [id]);
    if (result.length === 0) fails.push("Account does not exist with ID");
    else user = result.map((row) => ({ id: row.id }))[0];
  }

  // Return result
  if (user && fails.length === 0) {
    return {
      status: "success",
      data: {
        user,
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
 * Deletes a user in the database if a valid id is provided.
 * @param id - The user id.
 * @returns A promise that contains a `Result` or `ValidationFailure`
 */
export const deleteUser = async (
  id: string
): Promise<StatusDelete | StatusFail> => {
  // Validate
  const fails: Array<string> = [];
  if (!checkValidId(id)) fails.push("ID is not a valid format");

  // Query database
  if (fails.length === 0) {
    const DELETE_USER = 'DELETE FROM "user" WHERE id=$1';
    await transaction(DELETE_USER, [id]);
  }

  // Return result
  if (fails.length === 0) {
    return {
      status: "success",
      data: null,
    };
  } else {
    return {
      status: "fail",
      messages: fails,
    };
  }
};
