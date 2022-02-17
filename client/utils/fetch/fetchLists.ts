import { List } from "../../../interfaces/entities/list";
import {
  StatusSuccess,
  StatusFail,
  StatusError,
  StatusDelete,
} from "../../../interfaces/responses/statuses";

/**
 * Fetches lists of a user.
 * @param id - The user ID.
 * @returns Response statuses with relevant information.
 */
export const fetchGetLists = async (
  id: string
): Promise<StatusSuccess<List[]> | StatusFail | StatusError> => {
  const res = await fetch("https://api-tasks.griffindow.com/lists", {
    method: "GET",
    headers: {
      authorization: `Bearer ${id}`,
    },
  });
  const json = await res.json();
  return json;
};

/**
 * Creates a new list with a fetch request.
 * @param id - The user ID.
 * @param list - The list to create.
 * @returns Response statuses with relevant information.
 */
export const fetchPostLists = async (
  id: string,
  list: List
): Promise<StatusSuccess<List[]> | StatusFail | StatusError> => {
  const res = await fetch("https://api-tasks.griffindow.com/lists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${id}`,
    },
    body: JSON.stringify(list),
  });

  const json = await res.json();
  return json;
};

/**
 * Updates a list with a fetch request.
 * @param id - The user ID.
 * @param uuid - The list UUID.
 * @param name - The list name.
 * @returns Response statuses with relevant information.
 */
export const fetchPutList = async (
  id: string,
  uuid: string,
  name: string
): Promise<StatusSuccess<List> | StatusFail | StatusError> => {
  const res = await fetch(`https://api-tasks.griffindow.com/lists/${uuid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${id}`,
    },
    body: JSON.stringify({
      name: name,
    }),
  });
  const json = await res.json();
  return json;
};

/**
 * Deletes a list with a fetch request.
 * @param id - The user ID.
 * @param uuid - The list UUID.
 * @returns Response statuses with relevant information.
 */
export const fetchDeleteList = async (
  id: string,
  uuid: string
): Promise<StatusDelete | StatusFail | StatusError> => {
  const res = await fetch(`https://api-tasks.griffindow.com/lists/${uuid}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${id}`,
    },
  });
  const json = await res.json();
  return json;
};
