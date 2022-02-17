import { User } from "../../../interfaces/entities/user";
import {
  StatusSuccess,
  StatusFail,
  StatusError,
} from "../../../interfaces/responses/statuses";

/**
 * Fetches the user route to see if the user exists.
 * @param id - The user ID.
 * @returns The user.
 */
export const fetchGetUser = async (
  id: string
): Promise<StatusSuccess<User> | StatusFail | StatusError> => {
  const res = await fetch(`http://localhost:5000/users/${id}`, {
    method: "GET",
  });
  const json = await res.json();
  return json;
};

/**
 * Fetches the server to register a new user.
 * @returns The new user.
 */
export const fetchPostUser = async (): Promise<
  StatusSuccess<User> | StatusFail | StatusError
> => {
  const res = await fetch("http://localhost:5000/users", {
    method: "POST",
  });
  const json = await res.json();
  return json;
};
