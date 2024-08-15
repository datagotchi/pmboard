import React, { useContext } from "react";
import { WithContext as ReactTags } from "react-tag-input";

import { SummaryPaneProps } from "../../types";

import { AllTagsContext } from "../../contexts/AllTagsContext";

import {
  formatTrendTypeText,
  indexToClassName,
} from "./EmpathyMapPaneFunctions";

/**
 * A modal pane to show a persona's empathy map.
 * @param {SummaryPaneProps} props The properties for all summary panes.
 * @returns {React.JSX.Element} The renedered pane.
 */
const EmpathyMapPane = ({
  handleTagClick,
  allowDragDrop,
  handleDrag,
  removeComponent,
  handleDelete,
}) => {
  const allTagsForThisPersona = useContext(AllTagsContext);

  if (allTagsForThisPersona) {
    return (
      <table className="table" id="empathyMapTable" style={{ width: "90%" }}>
        <tbody>
          {[...indexToClassName, ""].map((trendType) => {
            const typedTags = allTagsForThisPersona.filter((tag) => {
              if (trendType === "") {
                return (
                  tag.className === trendType || tag.className === "selected"
                );
              } else {
                return tag.className.includes(trendType);
              }
            });
            return (
              <tr key={`ReactTags for '${trendType}'`}>
                <td>
                  <strong>{formatTrendTypeText(trendType)}</strong>
                </td>
                <td>
                  <ReactTags
                    tags={typedTags}
                    classNames={{
                      tag: "trendItem readOnly",
                      remove: "removeButton",
                    }}
                    removeComponent={
                      removeComponent ||
                      (() => {
                        // because readOnly={true} makes `handleTagClick` do nothing
                        return "";
                      })
                    }
                    handleDelete={handleDelete}
                    allowDragDrop={allowDragDrop}
                    handleDrag={handleDrag}
                    handleTagClick={(tagIndex, event) => {
                      const tagWrapper = event.target;
                      if (tagWrapper.className.includes("selected")) {
                        tagWrapper.className = tagWrapper.className
                          .split(" ")
                          .filter((cn) => cn !== "selected");
                      } else {
                        tagWrapper.className += " selected";
                      }
                      handleTagClick(tagIndex, typedTags);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  return <></>;
};

export default EmpathyMapPane;
