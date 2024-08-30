import types from "./public/src/types.js";
const { EvidenceTrend } = types;

/**
 * A convenience function to sort a string array with.
 * @param {string} a The first thing to compare to the second thing.
 * @param {string} b The second thign to compare to the first thing.
 * @returns {number} Positive if `a` goes before `b`, -1 for the opposite, and 0 if they are the same.
 * @example sortString("asdf", "basdf") = ["asdf", "basdf"]
 */
export const sortString = (a, b) => {
  if (a < b) {
    return 1;
  }
  if (b < a) {
    return -1;
  }
  return 0;
};

/**
 * Sort a specified array of trends by their name attribute sorted as a string.
 * @param {EvidenceTrend[]} trends The array of trends to sort.
 * @returns {EvidenceTrend[]} A sorted array of the trends.
 * @example getJsonSortedString([{b}, {a}, {c}, ...]) = [{a}, {b}, {c}]
 */
export const getJsonSortedString = (trends) => {
  if (trends) {
    return JSON.stringify(trends.map((trend) => trend.name).sort(sortString));
  }
  return "";
};

/**
 * Parse the number from a "(N)" substring in a tag.
 * @param {string} tagText The full text of a tag to parse.
 * @returns {number} The number in the parentheses.
 * @example getOccurenceNumber("test string (5)") === 5
 */
export const getOccurenceNumber = (tagText) =>
  parseInt(tagText.match(/\(([0-9]+)\)/)[1]);

/**
 * Format string with subquotes, replacing subquotes with double subquotes for PostgreSQL, and keep numbers as-is.
 * @param {string | number} value The value to be formatted.
 * @returns {string | number} The formatted string or number.
 * @example  const setClause = Object.keys(task)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ${formatSQLValue(task[key])}`)
        .join(", ");
 */
export const formatSQLValue = (value) => {
  switch (typeof value) {
    case "number":
      return value;
    case "string":
    default:
      return `'${value.replace("'", "''").replace("$", "$")}'`;
  }
};
