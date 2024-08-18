export const indexToClassName = [
  "objective",
  "goal",
  "activity",
  "task",
  "resource",
];
export const classNameToIndex = {};
indexToClassName.forEach((className, index) => {
  classNameToIndex[className] = index;
});

/**
 * Make a trend type string plural.
 * @param {string} trendType The type of change, ~ in (objective, goal, activity, task, resource).
 * @returns {string} The plural version of the trendType input.
 * @example <strong>{formatTrendTypeText(trendType)}</strong>
 */
export const formatTrendTypeText = (trendType) => {
  switch (trendType.toLocaleLowerCase()) {
    case "activity":
      return "Activities";
    case "resource":
      return "Resources & Constraints";
    case "":
      return "";
    default:
      return `${trendType.charAt(0).toUpperCase() + trendType.slice(1)}s`;
  }
};
