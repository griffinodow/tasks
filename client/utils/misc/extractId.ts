/**
 * Extracts an ID from the cookie header.
 * @param cookies - The cookie from the header.
 * @returns The ID.
 */
export const extractId = (cookies: string | undefined): string | void => {
  if (cookies) {
    const id: string | undefined = cookies
      .split("; ")
      .reduce((prev: any, current: string) => {
        const [name, ...value] = current.split("=");
        prev[name] = value.join("=");
        return prev;
      }, {})["id"];
    return id;
  }
};
