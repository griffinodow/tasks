import { useContext } from "react";
import { UserContext } from "../components/providers/UserProvider";

/**
 * The useUser React hook.
 * @returns The useUser React hook.
 */
export const useUser = () => useContext(UserContext);
