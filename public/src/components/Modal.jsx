import React, { useContext, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";

import { EvidenceRecord, EvidenceTrend, WidgetDataItem } from "../types";
import { AllTagsContext } from "../contexts/AllTagsContext";
import { EvidencePaneContext } from "../contexts/EvidencePaneContext";
import EmpathyMapPane from "./panes/EmpathyMapPane";
import {
  classNameToIndex,
  indexToClassName,
} from "./panes/EmpathyMapPaneFunctions";

/**
 * @param {object} props The component properties.
 * @param {string} props.productId The ID of the current product.
 * @param {WidgetDataItem} props.item The item to show in the modal.
 * @param {string} props.dialogId The ID to give the dialog.
 * @param {(evidence: EvidenceRecord[]) => void} props.updateEvidenceOnServer The function to call when evidence is updated in this modal.
 * @param {string} props.summaryTitle The title of the summary tab.
 * @returns {React.JSX.Element} The rendered modal.
 * @example
 *  <Modal item={*} dialogId="*" updateItemFunc={*} updateTrendFunc={*} summaryTitle="*" addItemEvidenceFunc={*} />
 */
const Modal = ({
  item,
  dialogId,
  productId,
  updateEvidenceOnServer,
  summaryTitle,
}) => {
  const sortString = (a, b) => {
    if (a < b) {
      return 1;
    }
    if (b < a) {
      return -1;
    }
    return 0;
  };
  const getOccurenceNumber = (tagText) =>
    parseInt(tagText.match(/\(([0-9]+)\)/)[1]);

  const getFlatTagsWithCountsFromEvidence = (evidence) => {
    /**
     * @type {ReactTags.Tag[]}
     */
    const newAllTags = [];
    /**
     * @type {{[key: string]: {count: number, className: string}}}
     */
    const trendCountMap = {};
    evidence.forEach((record) => {
      /**
       * @type {EvidenceTrend[]}
       */
      const recordTrends = JSON.parse(JSON.stringify(record.trends ?? [])); // to avoid referencing the same trend objects
      recordTrends.forEach((trend) => {
        if (!trendCountMap[trend.name]) {
          trendCountMap[trend.name] = {
            count: 0,
            className: trend.type,
          };
        }
        trendCountMap[trend.name].count += 1;
      });
    });
    Object.keys(trendCountMap).forEach((trendName) => {
      const trendInfoObject = trendCountMap[trendName];
      newAllTags.push({
        id: trendName,
        text: `${trendName} (${trendInfoObject.count})`,
        className: trendInfoObject.className,
      });
    });
    return newAllTags
      .sort(sortString)
      .sort((a, b) => getOccurenceNumber(b.text) - getOccurenceNumber(a.text));
  };

  /**
   * @type {[ReactTags.Tag[] | undefined, React.Dispatch<ReactTags.Tag[] | undefined>]}
   */
  const [allTags, setAllTags] = useState(
    getFlatTagsWithCountsFromEvidence(item.evidence)
  );

  const css = `
    .trendItem {
      margin: 2px;
      padding: 0 0 0 5px;
      display: inline-block;
      font: 12px "Helvetica Neue", Helvetica, Arial, sans-serif;
      height: 26px;
      line-height: 25px;
      border-radius: 3px;
      background-color: #337ab7;
      color: #fff;
      font-weight: 700;
      cursor: pointer !important;
    }
    .objective {
      background-color: red;
    }
    .goal {
      background-color: purple;
    }
    .activity { 
      background-color: blue;
    }
    .task {
      background-color: green;
    }
    .resource {
      background-color: gray;
    }
    .readOnly {
      padding: 0 5px;
    }
    .removeButton {
      background-color: transparent;
      height: 22px;
      border-radius: 5px;
      float: right;
      margin: 2px 0 0 5px;
      font-size: 12px;
      line-height: 12px;
    }
    .removeButton:hover {
      background-color: rgba(204, 204, 204, 0.5);
    }
  `;

  const EvidencePaneComponent = useContext(EvidencePaneContext);

  return (
    <>
      <style>{css}</style>
      <dialog id={dialogId} style={{ width: "90%", height: "90%" }}>
        <div>
          <div>
            <div>
              <div className="modal-header">
                <h4 className="modal-title">{item.name}</h4>
              </div>
              <div className="modal-body">
                <div role="tabpanel">
                  <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation" className="nav-item">
                      <a
                        className="nav-link active"
                        data-bs-toggle="tab"
                        data-bs-target="#modalEvidence"
                        aria-controls="evidence"
                        role="tab"
                        type="button"
                      >
                        Evidence
                      </a>
                    </li>
                    <li role="presentation" className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#modalSummary"
                        aria-controls="summary"
                        role="tab"
                        type="button"
                      >
                        {summaryTitle}
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <AllTagsContext.Provider value={allTags}>
                      {/* TODO: use d3.js instead of ReactTags */}
                      <div
                        role="tabpanel"
                        className="tab-pane"
                        id="modalSummary"
                      >
                        {!allTags ||
                          (allTags.length === 0 && (
                            <span>
                              There is no evidence. Start by adding a file!
                            </span>
                          ))}
                        {allTags && allTags.length > 0 && (
                          <EmpathyMapPane
                            handleTagClick={(tagIndex, reactTags) => {
                              const tag = reactTags[tagIndex];
                              const currentClassIndex = tag.className
                                ? classNameToIndex[tag.className]
                                : -1;
                              const newClassName =
                                indexToClassName[
                                  (currentClassIndex + 1) %
                                    indexToClassName.length
                                ];
                              tag.className = newClassName;
                              setAllTags([...allTags]); // to refresh their className displays
                            }}
                          />
                        )}
                      </div>
                      <div
                        role="tabpanel"
                        className="tab-pane active"
                        id="modalEvidence"
                      >
                        <EvidencePaneComponent
                          productId={productId}
                          evidence={
                            item.evidence
                              ? item.evidence.sort((a, b) => {
                                  if (b.modifiedDate > a.modifiedDate) {
                                    return 1;
                                  }
                                  if (a.modifiedDate > b.modifiedDate) {
                                    return -1;
                                  }
                                  return 0;
                                })
                              : []
                          }
                          containerModalId={dialogId}
                          updateEvidenceOnServer={updateEvidenceOnServer}
                          allTagsUpdated={(tags) => setAllTags(tags)}
                        />
                      </div>
                    </AllTagsContext.Provider>
                  </div>
                </div>
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
