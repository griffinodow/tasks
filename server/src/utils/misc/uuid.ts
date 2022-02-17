/**
 * Checks the input to see if it's a valid uuid.
 * @param uuid - The uuid to validate.
 * @returns True or false if the uuid is valid.
 */
export const checkValidUuidV4 = (uuid?: string) => {
  if (!uuid) return false;
  return uuid.match(
    /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/
  );
};
