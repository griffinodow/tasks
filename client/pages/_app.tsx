import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../components/providers/UserProvider";
import { ListsProvider } from "../components/providers/ListsProvider";

/**
 * The app.
 * @param params - The input parameters.
 * @returns The app.
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ListsProvider>
        <Component {...pageProps} />
      </ListsProvider>
    </UserProvider>
  );
}

export default MyApp;
