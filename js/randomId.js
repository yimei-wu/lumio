export const getRandomId = (prefix) => {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "");
};
