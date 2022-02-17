import { useRouter } from "next/router";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useLists } from "../../hooks/useLists";
import { fetchPostTask } from "../../utils/fetch/fetchTasks";
import { MdAdd } from "react-icons/md";
import styles from "./AddTaskForm.module.css";

/**
 * The React component that takes input to create a task.
 * @param params - The input parameters.
 * @returns The AddTaskForm React component.
 */
export const AddTaskForm = ({
  id,
  uuid,
  handleFail,
}: {
  /**
   * The user ID.
   */
  id: string;
  /**
   * The UUID of the list to add the task to.
   */
  uuid?: string;
  /**
   * The fail handler.
   */
  handleFail: Function;
}) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const { createTask, deleteTask } = useLists();

  /**
   * Handles creating a new task.
   * @param data - The form data from React Hook Form.
   */
  const handleCreateTask: SubmitHandler<FieldValues> = async (data) => {
    try {
      if (!uuid) return;
      const task = {
        uuid: uuidv4(),
        name: data.name,
        complete: false,
      };

      createTask(uuid, task);
      reset();

      const json = await fetchPostTask(id, uuid, task);
      if (json.status === "fail") {
        deleteTask(uuid, task.uuid);
        handleFail(json.messages);
      }
      if (json.status === "error") router.push("/500");
    } catch {
      router.push("/500");
    }
  };

  return uuid ? (
    <form
      onSubmit={handleSubmit(handleCreateTask)}
      className={`${styles.form} shadow`}
    >
      <input
        {...register("name", {
          required: true,
        })}
        placeholder="Create a task"
        autoComplete="off"
      ></input>
      <button aria-label="add" type="submit">
        <MdAdd size={24} />
      </button>
    </form>
  ) : (
    <></>
  );
};
