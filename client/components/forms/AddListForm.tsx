import { useRouter } from "next/router";
import { MdAdd } from "react-icons/md";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useLists } from "../../hooks/useLists";
import { fetchPostLists } from "../../utils/fetch/fetchLists";
import styles from "./AddListForm.module.css";

/**
 * The React component that takes input to create a list.
 * @param params - The input parameters.
 * @returns The AddListForm React component.
 */
export const AddListForm = ({
  id,
  handleFail,
  setMenuOpen,
}: {
  /**
   * The user ID.
   */
  id: string;
  /**
   * The fail handler.
   */
  handleFail: Function;
  /**
   * Sets if the drop down menu is open.
   */
  setMenuOpen: Function;
}) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const { createList, deleteList } = useLists();

  /**
   * Handles creating a new list.
   * @param data - The form data from React Hook Form.
   */
  const handleCreateList: SubmitHandler<FieldValues> = async (data) => {
    try {
      const list = {
        uuid: uuidv4(),
        name: data.name,
      };

      createList(list);
      reset();
      setMenuOpen(false);
      const json = await fetchPostLists(id, list);
      if (json.status === "fail") {
        deleteList(list.uuid);
        handleFail(json.messages);
      }
      if (json.status === "error") router.push("/500");
    } catch {
      router.push("/500");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreateList)} className={styles.form}>
      <input
        {...register("name", {
          required: "List name is required",
        })}
        required
        placeholder="Add a list"
        autoComplete="off"
      ></input>
      <button type="submit">
        <MdAdd size={24} />
      </button>
    </form>
  );
};
