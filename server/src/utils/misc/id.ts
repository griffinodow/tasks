/**
 * Represents the alphabet.
 */
const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

/**
 * Generates a random ID for a new user.
 * @returns A new ID.
 */
export const generateId = () => {
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += Math.floor(Math.random() * (2 - 0))
      ? ALPHABET[Math.floor(Math.random() * (26 - 0))]
      : Math.floor(Math.random() * (10 - 0));
  }
  return id;
};

/**
 * Checks if an id is valid.
 * @param id - The ID to validate.
 * @returns true or false if the id is valid.
 */
export const checkValidId = (id: string): boolean => {
  if (typeof id !== "string") return false;
  if (id.length !== 6) return false;
  if (!id.match(/^[0-9a-zA-Z]+$/)) return false;
  return true;
};
