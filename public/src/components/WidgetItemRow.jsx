import React from "react";

import { EvidenceRecord, WidgetDataItem } from "../types";

/**
 * @param {object} props The component properties.
 * @param {WidgetDataItem | undefined} props.item The item to show in this row
 * @param {(item: WidgetDataItem) => void} props.onDeleteCallback The function to call when deleting this item
 * @param {(item: WidgetDataItem) => void} props.onClickCallback The function to call when the name is clicked
 * @returns {React.JSX.Element} The resulting widget element.
 */
const WidgetItemRow = ({ item, onDeleteCallback, onClickCallback }) => {
  const getEvidenceLabelClass = (item) => {
    if (item && item.evidence) {
      switch (item.evidence.length) {
        case item.evidence.length > 0 && item.evidence.length < 10:
          return "bg-warning";
        case item.evidence.length >= 10:
          return "bg-success";
        default:
          return "bg-danger";
      }
    }
    return "";
  };

  const trendTypes = ["objective", "goal", "activity", "task", "resource"];

  /**
   * @param {EvidenceRecord} record The record to evaluate whether it has all trend types
   * @returns {boolean} whether or not the record has trends of all types
   */
  const hasAllTrendTypes = (record) => {
    const typeMap = record.trends.reduce((map, trend) => {
      if (trend.type && !map[trend.type]) {
        map[trend.type] = true;
      }
      return map;
    }, {});
    return trendTypes.filter((tt) => typeMap[tt]).length === trendTypes.length;
  };

  const numberOfEvidenceCompleted =
    item && item.evidence
      ? item.evidence.filter(
          (record) =>
            record.trends &&
            record.trends.length > 0 &&
            hasAllTrendTypes(record)
        ).length
      : 0;

  return (
    <tr>
      <td
        className="dragHandle"
        style={{
          cursor: "pointer",
          backgroundColor: "#ccc",
          fontSize: "10px",
        }}
      >
        ||
      </td>
      <td>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => {
            onClickCallback(item);
          }}
        >
          {item && item.name}
        </a>
      </td>
      <td>
        <span className={`evidence badge ${getEvidenceLabelClass(item)}`}>
          {numberOfEvidenceCompleted}/{item.evidence.length}
        </span>
      </td>
      <td>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (confirm("Are you sure?")) {
              onDeleteCallback(item);
            }
          }}
        >
          <span className="remove-evidence bi bi-trash" /> Delete
        </a>
      </td>
    </tr>
  );
};

export default WidgetItemRow;
