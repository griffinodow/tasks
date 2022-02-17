import Head from "next/head";
import styles from "./error.module.css";

/**
 * The error 404 page.
 * @returns The error 404 page.
 */
export const Error = () => {
  return (
    <main className={styles.error}>
      <Head>
        <title>Error 404</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>Error 404</h1>
      <span>This page could not be found.</span>
    </main>
  );
};

export default Error;
