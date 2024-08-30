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
 * @example <EmpathyMapPane handleTagClick={() => {}} allowDragDrop={true | false} handleDrag={() => {}} removeComponent={() => {}} handleDelete={() => {}} />
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
                return !tag.className || tag.className === trendType;
              } else {
                return tag.className && tag.className.includes(trendType);
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
                      // TODO: show a context menu to choose class, rather than clicking repeatedly
                      const tagWrapper = event.target;
                      if (tagWrapper.className.includes("selected")) {
                        tagWrapper.classList.remove("selected");
                      } else {
                        tagWrapper.classList.add("selected");
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
