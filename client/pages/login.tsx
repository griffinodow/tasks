import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useUser } from "../hooks/useUser";
import { GetServerSideProps } from "next";
import { extractId } from "../utils/misc/extractId";
import { LoginForm } from "../components/forms/LoginForm";
import styles from "./login.module.css";

/**
 * The login page React component.
 * @returns The login page React component.
 */
const Login = () => {
  const router = useRouter();
  const { id } = useUser();

  /**
   * Redirects the user to the dashboard if they are logged in.
   */
  useEffect(() => {
    if (id) router.push("/");
  }, [id, router]);

  return (
    <main className={styles.login}>
      <Head>
        <title>Tasks | Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <section>
        <h1 className="headline-1">Tasks</h1>
        <span className="tertiary">The classic to-do list app</span>
      </section>
      <section>
        <LoginForm />
      </section>
    </main>
  );
};

export default Login;

/**
 * Handles server side rendering. Redirects user to dashboard if logged in.
 * @param context - The response context.
 * @returns The server side render props.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = extractId(context.req.headers.cookie);
  if (!id) {
    return {
      props: {},
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};
