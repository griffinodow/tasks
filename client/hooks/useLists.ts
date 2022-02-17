import { useContext } from "react";
import { ListsContext } from "../components/providers/ListsProvider";

/**
 * The useLists React hook.
 * @returns The useLIsts React hook.
 */
export const useLists = () => useContext(ListsContext);
