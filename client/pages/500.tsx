import Head from "next/head";
import styles from "./error.module.css";

/**
 * The error 500 page.
 * @returns The Error 500 page.
 */
export const Error = () => {
  return (
    <main className={styles.error}>
      <Head>
        <title>Internal Server Error</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>Internal Server Error</h1>
      <span>There was a problem communicating with the server API</span>
    </main>
  );
};

export default Error;
