import { useState } from "react";
import { List as IList } from "../../../interfaces/entities/list";
import { List } from "./List";
import styles from "./Lists.module.css";

/**
 * The Lists React component.
 * @param params - The input parameters.
 * @returns The Lists React component.
 */
export const Lists = ({
  id,
  lists,
  handleFail,
  setMenuOpen,
}: {
  /**
   * The user ID.
   */
  id: string;
  /**
   * The Array of Lists.
   */
  lists: Array<IList>;
  /**
   * The failure handler.
   */
  handleFail: Function;
  /**
   * Handles closing the dropdown menu.
   */
  setMenuOpen: Function;
}) => {
  const [globalEditing, setGlobalEditing] = useState(false);

  return (
    <section className={styles.lists}>
      {lists.map((list) => (
        <List
          id={id}
          key={list.uuid}
          uuid={list.uuid}
          name={list.name}
          globalEditing={globalEditing}
          setGlobalEditing={setGlobalEditing}
          handleFail={handleFail}
          setMenuOpen={setMenuOpen}
        />
      ))}
    </section>
  );
};
