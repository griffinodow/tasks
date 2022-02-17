import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { AddListForm } from "../forms/AddListForm";
import styles from "./DropDownMenu.module.css";
import { useLists } from "../../hooks/useLists";
import { Lists } from "../data/Lists";

/**
 * The DropDownMenu React component.
 * @param params - The input parameters.
 * @returns The DropDownMenu React component.
 */
export const DropDownMenu = ({
  id,
  handleFail,
}: {
  /**
   * The user ID.
   */
  id: string;
  /**
   * The fail handler.
   */
  handleFail: Function;
}) => {
  const refMenu: any = useRef();
  const refButton: any = useRef();
  const { selectedUuid, lists } = useLists();
  const [open, setOpen] = useState(false);

  /**
   * Closes the DropDownMenu if clicked outside of it.
   */
  useEffect(() => {
    const checkIfClickedOutside = (event: Event) => {
      if (
        open &&
        refMenu.current &&
        !refMenu.current.contains(event.target) &&
        !refButton.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [open]);

  /**
   * Handles toggling the menu open or closed.
   */
  const handleToggleMenu = () => {
    setOpen(!open);
  };

  return (
    <div className={styles.wrapper}>
      <button
        ref={refButton}
        onClick={handleToggleMenu}
        className={`${styles.button} shadow`}
      >
        <span>
          {selectedUuid
            ? lists.find((list) => list.uuid === selectedUuid)?.name
            : "Create a list"}
        </span>
        {open ? (
          <MdOutlineKeyboardArrowUp size={24} />
        ) : (
          <MdOutlineKeyboardArrowDown size={24} />
        )}
      </button>
      {open && (
        <div ref={refMenu} className={`${styles.menu} shadow`}>
          {lists.length > 0 && (
            <Lists id={id} lists={lists} handleFail={handleFail} />
          )}
          {<AddListForm id={id} handleFail={handleFail} />}
        </div>
      )}
    </div>
  );
};
