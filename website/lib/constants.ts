export const AVATAR_NAMES = [
  "chicken",
  "bear",
  "panda",
  "dog",
  "koala",
  "rhino",
  "cat",
  "badger",
  "penguin",
  "llama",
  "sloth",
  "rabbit",
];

export const API_ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "http://localhost:3000/api";
