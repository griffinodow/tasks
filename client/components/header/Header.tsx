import { useUser } from "../../hooks/useUser";
import { useLists } from "../../hooks/useLists";
import { DropDownMenu } from "./DropDownMenu";
import styles from "./Header.module.css";

/**
 * The Header React component is the upper header or menu of the todo list dashboard.
 * @param params - The input parameters.
 * @returns The Header React component.
 */
export const Header = ({
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
  const { deleteUser } = useUser();
  const { deleteLists } = useLists();
  const handleLogout = () => {
    deleteUser();
    deleteLists();
  };

  return (
    <header className={`${styles.header} shadow`}>
      <section>
        <span className="headline-4">{`${id.substring(0, 3)} ${id.substring(
          3,
          6
        )}`}</span>
        <button onClick={handleLogout} className={styles.logout}>
          Logout
        </button>
      </section>
      <section>
        <DropDownMenu id={id} handleFail={handleFail} />
      </section>
    </header>
  );
};
