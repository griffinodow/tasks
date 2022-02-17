import { MdClose } from "react-icons/md";
import styles from "./Modal.module.css";

/**
 * The Modal React component. Used for displaying messages to the user.
 * @param params - The input parameters.
 * @returns - The Modal React component.
 */
export const Modal = ({
  header,
  messages,
  setModalOpen,
  setMessages,
}: {
  /**
   * The header text at the top of the modal.
   */
  header: string;
  messages: Array<string>;
  setModalOpen: Function;
  setMessages: Function;
}) => {
  /**
   * Handles closing the modal when the close button is pressed.
   */
  const handleCloseButton = () => {
    setMessages([]);
    setModalOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.modal} shadow`}>
        <section>
          <span>{header}</span>
          <button onClick={handleCloseButton}>
            <MdClose size={24} />
          </button>
        </section>
        <section>
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </section>
      </div>
    </div>
  );
};
