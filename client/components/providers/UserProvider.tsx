import React, { createContext, ReactNode, useContext, useState } from "react";
import { cookies } from "../../utils/frameworks/cookie";

/**
 * The state of the UserContext.
 */
interface UserContextProps {
  id: string | null;
  createUser: Function;
  deleteUser: Function;
}

/**
 * The UserContext.
 */
export const UserContext = createContext<UserContextProps>(null!);

/**
 * The UserProvider React component that makes the UserContext available in the app.
 * @param params - The input parameters.
 * @returns - The UserProvider React component..
 */
export const UserProvider = ({ children }: { children?: ReactNode }) => {
  const [id, setUser] = useState((cookies.get("id") as string) || null);

  /**
   * Creates a new user in the state.
   * @param id - The user ID.
   */
  const createUser = (id: string) => {
    cookies.set("id", id, {
      path: "/",
      maxAge: 10 * 365 * 24 * 60 * 60,
      sameSite: "strict",
    });
    setUser(id);
  };

  /**
   * Deletes the user from the state.
   */
  const deleteUser = () => {
    setUser(null);
    cookies.remove("id", {
      path: "/",
      maxAge: 10 * 365 * 24 * 60 * 60,
      sameSite: "strict",
    });
  };

  return (
    <UserContext.Provider value={{ id, createUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};
