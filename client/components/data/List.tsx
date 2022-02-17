import { useRouter } from "next/router";
import { MdEdit } from "react-icons/md";
import { useLists } from "../../hooks/useLists";
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { fetchDeleteList, fetchPutList } from "../../utils/fetch/fetchLists";
import styles from "./List.module.css";

/**
 * List React component that displays a list.
 * @param params - The input parameters.
 * @returns The List React component.
 */
export const List = ({
  id,
  uuid,
  name,
  globalEditing,
  setGlobalEditing,
  handleFail,
}: {
  /**
   * The user ID.
   */
  id: string;
  /**
   * The List UUID.
   */
  uuid: string;
  /**
   * The name of the list.
   */
  name: string;
  /**
   * If there is a list being edited globally.
   */
  globalEditing: boolean;
  /**
   * Set if there is a list being edited globally.
   */
  setGlobalEditing: Function;
  /**
   * Handle failure statuses.
   */
  handleFail: Function;
}) => {
  const router = useRouter();
  const ref: any = useRef();
  const { selectedUuid, setSelectedUuid, updateList, deleteList } = useLists();
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name,
    },
  });

  /**
   * Stops editing state if clicking outside of the list.
   */
  useEffect(() => {
    const checkIfClickedOutside = (event: Event) => {
      if (
        globalEditing &&
        editing &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setEditing(false);
        setGlobalEditing(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [globalEditing, editing, setGlobalEditing]);

  /**
   * Toggles the editing state.
   */
  const handleToggleEdit = () => {
    if (!editing) {
      setEditing(true);
      setGlobalEditing(true);
      reset();
    }
  };

  /**
   * Change the displayed list to this one.
   */
  const handleChangeDisplayedList = () => {
    if (selectedUuid === uuid) return;
    setSelectedUuid(uuid);
  };

  /**
   * Updates the list.
   * @param data - Form data from React Hook Form.
   */
  const handleUpdateList: SubmitHandler<FieldValues> = async (data) => {
    try {
      updateList({
        uuid,
        name: data.name,
      });
      setEditing(false);
      setGlobalEditing(false);
      const json = await fetchPutList(id, uuid, data.name);
      if (json.status === "success") {
        updateList(json.data.list);
      } else {
        if (json.status === "fail") handleFail(json.messages);
        if (json.status === "error") router.push("/500");
      }
    } catch {
      router.push("/500");
    }
  };

  /**
   * Deletes the list.
   */
  const handleDeleteList = async () => {
    try {
      deleteList(uuid);
      setEditing(false);
      setGlobalEditing(false);
      const json = await fetchDeleteList(id, uuid);
      if (json.status === "success") {
      } else {
        if (json.status === "fail") handleFail(json.messages);
        if (json.status === "error") router.push("/500");
      }
    } catch {
      router.push("/500");
    }
  };

  return (
    <div ref={ref} className={styles.list}>
      {editing ? (
        <form onSubmit={handleSubmit(handleUpdateList)}>
          <input {...register("name", { required: true })}></input>
          <button type="submit">update</button>
        </form>
      ) : (
        <button
          className={styles.switchbtn}
          onClick={handleChangeDisplayedList}
        >
          {name}
        </button>
      )}
      <div>
        {editing ? (
          <div className={styles.updatebtns}>
            <button onClick={handleDeleteList}>
              <MdDelete size={24} />
            </button>
          </div>
        ) : !globalEditing ? (
          <button aria-label="Edit">
            <MdEdit onClick={handleToggleEdit} size={24} />
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
