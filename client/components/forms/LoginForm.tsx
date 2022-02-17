import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import { handleLoginFormErrors } from "../../utils/responseHandlers/handleLoginFormErrors";
import { MdSync } from "react-icons/md";
import { fetchGetUser, fetchPostUser } from "../../utils/fetch/fetchUser";
import styles from "./LoginForm.module.css";

/**
 * The LoginForm React component.
 * @returns The LoginForm React component.
 */
export const LoginForm = () => {
  const router = useRouter();
  const { createUser } = useUser();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  /**
   * Hanldes logging in a user.
   * @param data - The form data from React Hook Form.
   */
  const handleLoginUser: SubmitHandler<FieldValues> = async (data) => {
    try {
      setLoading(true);
      const res = await fetchGetUser(data.id);

      if (res.status === "success") {
        createUser(res.data.user.id);
      } else {
        handleLoginFormErrors(res, setError);
        setLoading(false);
      }
    } catch {
      router.push("/500");
    }
  };

  /**
   * Handles registering a new user.
   */
  const handleRegisterUser = async () => {
    try {
      setLoading(true);
      const res = await fetchPostUser();

      if (res.status === "success") {
        createUser(res.data.user.id);
      } else {
        handleLoginFormErrors(res, setError);
        setLoading(false);
      }
    } catch {
      router.push("/500");
    }
  };

  if (!loading) {
    return (
      <form className={styles.form} onSubmit={handleSubmit(handleLoginUser)}>
        {errors.server && (
          <span className="error">{errors.server.message}</span>
        )}
        {errors.client && (
          <span className="error">{errors.client.message}</span>
        )}
        <input
          className="input"
          {...register("id", {
            required: "ID must be provided",
            minLength: {
              value: 6,
              message: "ID must be 6 characters",
            },
            maxLength: {
              value: 6,
              message: "ID must be 6 characters",
            },
            pattern: {
              value: /^[0-9a-zA-Z]+$/,
              message: "ID must be alphanumeric",
            },
            onChange: (event) => {
              event.target.value = event.target.value.toUpperCase();
              event.target.value = event.target.value.replace(/\s/g, "");
            },
          })}
          placeholder="Previous ID"
          autoComplete="off"
        ></input>
        {errors.id && <span className="error">{errors.id.message}</span>}
        <button className="button" type="submit">
          Login
        </button>
        <span>
          Don't have an account?{" "}
          <button
            type="button"
            className="secondary"
            onClick={handleRegisterUser}
          >
            New ID
          </button>
        </span>
      </form>
    );
  } else {
    return <MdSync className="spin" size={36} />;
  }
};
