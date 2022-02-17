/**
 * Handles error or failure responses from API requests via the login form.
 * @param json - The JSON response.
 * @param setError - Error setter from React Hook Form.
 */
export const handleLoginFormErrors = (json: any, setError: Function) => {
  if (json.message)
    setError("server", {
      type: "server",
      message: json.message,
    });
  if (json.messages) {
    json.messages.forEach((message: string) =>
      setError("client", {
        type: "client",
        message: message,
      })
    );
  } else {
    setError("client", {
      type: "client",
      message: "Unknown error",
    });
  }
};
