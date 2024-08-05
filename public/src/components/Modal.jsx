import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

import useOAuthAPI from "../hooks/useOAuthAPI";
import {
  EvidenceFile,
  EvidenceTrend,
  WidgetDataItem,
  GoogleFile,
} from "../types";

/**
 * @param {object} props
 * @param {WidgetDataItem} props.item The item to show in the modal.
 * @param {string} props.dialogId The ID to give the dialog.
 * @param {(itemIndex: number) => void} props.deleteItemFunc The function to call when a new item is deleted.
 * @param {(item: WidgetDataItem) => void} props.updateItemFunc The function to call when a new item is updated.
 * @param {(trendIndex: number, trend: EvidenceTrend) => Promise<void>} props.updateTrendFunc The functino to call when a trend is updated.
 * @returns {JSX.Element} The rendered modal.
 * @example
 *  <Modal item={*} dialogId="*" deleteItemFunc={*} updateItemFunc={*} />
 */
const Modal = ({
  item,
  dialogId,
  deleteItemFunc,
  updateItemFunc,
  updateTrendFunc,
}) => {
  const ADD_FILES_DIALOG_ID = `addFilesModal: ${dialogId}`;

  /**
   * @type {[{[key: string]: ReactTags.Tag[]}, ReactDispatch<{[key: string]: ReactTags.Tag[]}>]}
   */
  const [trendTagsPerFile, setTrendTagsPerFile] = useState();

  useEffect(() => {
    const initialTrendTags = item.evidence.reduce((trendsMap, file) => {
      if (!trendsMap[file.url]) {
        trendsMap[file.url] = file.trends.map((trend) => ({
          id: trend.name,
          text: trend.name,
          className: trend.type,
        }));
      }
      return trendsMap;
    }, {});
    setTrendTagsPerFile(initialTrendTags);
  }, []);

  useEffect(() => {
    if (trendTagsPerFile) {
      updateAllTagsFromTrendTags();
    }
  }, [trendTagsPerFile]);

  const sortString = (a, b) => {
    if (a < b) {
      return 1;
    }
    if (b < a) {
      return -1;
    }
    return 0;
  };

  const getJsonSortedString = (trends) =>
    JSON.stringify(trends.map((trend) => trend.name).sort(sortString));

  const updateAllTagsFromTrendTags = useCallback(() => {
    const newAllTags = [];
    const tagDataMap = {};
    Object.keys(trendTagsPerFile).forEach((fileUrl) => {
      const fileTags = JSON.parse(JSON.stringify(trendTagsPerFile[fileUrl]));
      fileTags.forEach((tag) => {
        if (!tagDataMap[tag.text]) {
          tagDataMap[tag.text] = {
            count: 0,
            className: tag.className,
          };
        }
        tagDataMap[tag.text].count += 1;
      });
    });
    Object.keys(tagDataMap).forEach((tagText) => {
      const tagData = tagDataMap[tagText];
      newAllTags.push({
        id: tagText,
        text: `${tagText} (${tagData.count})`,
        className: tagData.className,
      });
    });
    setAllTags(newAllTags);
  }, [trendTagsPerFile]);

  /**
   *
   * @param {ReactTags.Tag[]} allTags
   */
  const updateTagTrendsFromAllTagsClassNames = (allTags) => {
    Object.keys(trendTagsPerFile).forEach((fileUrl) => {
      trendTagsPerFile[fileUrl].forEach((tag) => {
        const allTagsTag = allTags.find((t) => t.id === tag.id);
        tag.className = allTagsTag.className;
      });
    });
  };

  useEffect(() => {
    if (trendTagsPerFile) {
      let thereAreChanges = false;
      item.evidence.forEach((file) => {
        const tags = trendTagsPerFile[file.url];
        if (tags) {
          const trends = tags.map((tag) => ({
            name: tag.text,
            type: tag.className,
          }));
          if (
            getJsonSortedString(file.trends) !== getJsonSortedString(trends)
          ) {
            file.trends = trends;
            thereAreChanges = true;
          }
        }
      });
      if (thereAreChanges) {
        updateAllTagsFromTrendTags(trendTagsPerFile);
        updateItemFunc(item);
      }
    }
  }, [trendTagsPerFile]);

  /**
   * @type {[ReactTags.Tag[] | undefined, React.Dispatch<ReactTags.Tag[] | undefined>]}
   */
  const [allTags, setAllTags] = useState();

  /**
   * @type {[HTMLDialogElement | undefined, React.Disptch<HTMLDialogElement | undefined>]}
   */
  const [mainDialog, setMainDialog] = useState();
  /**
   * @type {[HTMLDialogElement | undefined, React.Disptch<HTMLDialogElement | undefined>]}
   */
  const [addFilesModal, setAddFilesModal] = useState();

  useEffect(() => {
    setMainDialog(document.getElementById(dialogId));
    setAddFilesModal(document.getElementById(ADD_FILES_DIALOG_ID));
  }, []);

  const { getGoogleDriveFiles } = useOAuthAPI();

  const accessToken = useMemo(() => sessionStorage.getItem("access_token"));

  useEffect(() => {
    if (accessToken) {
      const encodedToken = encodeURI(accessToken);
      getGoogleDriveFiles(encodedToken)
        .then((response) => {
          const files = response.items.filter(
            (file) =>
              item.evidence
                .map(function (f) {
                  return f.url;
                })
                .indexOf(file.alternateLink) === -1
          );
          setFiles([...files]);
          setFilteredFiles([...files]);
        })
        .catch((err) => {
          sessionStorage.removeItem("access_token");
          window.location.reload();
        });
    }
  }, [accessToken]);

  const openFilesModal = () => {
    if (addFilesModal) {
      addFilesModal.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
          addFilesModal.close();
        }
      });
      addFilesModal.showModal();
    }
  };

  /**
   * @type {[GoogleFile[] | undefined, React.Dispatch<GoogleFile[] | undefined>]}
   */
  const [files, setFiles] = useState();
  const [filteredFiles, setFilteredFiles] = useState();

  const addFile = useCallback(
    /**
     *
     * @param {GoogleFile} file
     * @param {React.ChangeEvent<HTMLInputElement>} event
     * @returns
     */
    async (file, event) => {
      const checkbox = event.target;
      if (checkbox.checked) {
        var newFile = {
          name: file.title,
          url: file.alternateLink,
          icon: file.iconLink,
        };
        item.evidence.push(newFile);
        updateItemFunc(item);

        const newFiles = files.filter(
          (f) => f.alternateLink !== file.alternateLink
        );
        setFiles(newFiles);
        document.getElementById("fileFilter").value = "";
        setFilteredFiles(newFiles);
        addFilesModal.close();
      }
    },
    [files]
  );

  const removeFile = (file) => {
    item.evidence = item.evidence.filter(
      (file2) => file2.alternateLink !== file.alternateLink
    );
    updateItemFunc(item);
    const newFiles = [...files, file];
    setFiles(newFiles);
    setFilteredFiles(newFiles);
    document.getElementById("fileFilter").value = "";
  };

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
    #modalSummary .ReactTags__tagInput {
      display: none;
    }
  `;

  const indexToClassName = [
    "objective",
    "goal",
    "activity",
    "task",
    "resource",
  ];
  const classNameToIndex = {};
  indexToClassName.forEach((className, index) => {
    classNameToIndex[className] = index;
  });

  return (
    <>
      <style>{css}</style>
      <dialog id={dialogId} style={{ width: "600px", height: "900px" }}>
        <div>
          <div>
            <div>
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span>&times;</span>
                </button>
                <h4 className="modal-title">{item.name}</h4>
              </div>
              <div className="modal-body">
                {/* <div role="tabpanel">
                <ul className="nav nav-tabs" role="tablist"></ul>
                <div className="tab-content"></div>
              </div> */}
                <div role="tabpanel">
                  <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation">
                      <a
                        href="#modalSummary"
                        aria-controls="summary"
                        role="tab"
                        data-toggle="tab"
                      >
                        Summary
                      </a>
                    </li>
                    <li role="presentation" className="active">
                      <a
                        href="#modalEvidence"
                        aria-controls="evidence"
                        role="tab"
                        data-toggle="tab"
                      >
                        Evidence
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div role="tabpanel" className="tab-pane" id="modalSummary">
                      {!allTags ||
                        (allTags.length === 0 && (
                          <span>
                            There is no evidence. Start by adding a file!
                          </span>
                        ))}
                      {allTags && allTags.length > 0 && (
                        // TODO: put tags in a table to hierarchicall organize them
                        <table className="table">
                          <tbody>
                            {[...indexToClassName, ""].map((trendType) => {
                              const typedTags = allTags.filter(
                                (tag) => tag.className === trendType
                              );
                              return (
                                <tr key={`ReactTags for '${trendType}'`}>
                                  <td>
                                    <strong>
                                      {trendType.charAt(0).toUpperCase() +
                                        trendType.slice(1)}
                                    </strong>
                                  </td>
                                  <td>
                                    <ReactTags
                                      tags={typedTags}
                                      classNames={{
                                        tag: "trendItem readOnly",
                                      }}
                                      removeComponent={() => {
                                        // because readOnly={true} makes `handleTagClick` do nothing
                                        return "";
                                      }}
                                      handleTagClick={(tagIndex) => {
                                        const tag = typedTags[tagIndex];
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
                                        updateTagTrendsFromAllTagsClassNames(
                                          allTags
                                        );
                                        updateTrendFunc(tagIndex, {
                                          name: tag.id,
                                          type: tag.className,
                                        });
                                      }}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                    <div
                      role="tabpanel"
                      className="tab-pane active"
                      id="modalEvidence"
                    >
                      <h2>
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => openFilesModal(item)}
                        >
                          Add File
                        </a>
                      </h2>
                      <table className="table">
                        <tbody>
                          {item.evidence.map((file) => (
                            <tr key={`Item evidence: ${file.url} `}>
                              <td>
                                <span
                                  className="remove-evidence glyphicon glyphicon-remove"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => removeFile(file)}
                                ></span>
                              </td>
                              <td>
                                <a href={file.url} target="_blank">
                                  <img src={file.icon} />
                                  {file.name}
                                </a>
                              </td>
                              <td>
                                {allTags && (
                                  <ReactTags
                                    tags={trendTagsPerFile[file.url]}
                                    separators={[SEPARATORS.ENTER]}
                                    handleAddition={(tag) => {
                                      const fileTags = [
                                        ...trendTagsPerFile[file.url],
                                      ];
                                      fileTags.push(tag);
                                      setTrendTagsPerFile({
                                        ...trendTagsPerFile,
                                        [file.url]: fileTags,
                                      });
                                    }}
                                    suggestions={allTags.filter(
                                      (tag) =>
                                        !trendTagsPerFile[file.url]
                                          .map((t) => t.text)
                                          .includes(tag.text)
                                    )}
                                    // renderSuggestion={(item, query) => {}}
                                    editable={true}
                                    onTagUpdate={(index, tag) => {
                                      const fileTags = [
                                        ...trendTagsPerFile[file.url],
                                      ];
                                      fileTags[index] = tag;
                                      setTrendTagsPerFile({
                                        ...trendTagsPerFile,
                                        [file.url]: fileTags,
                                      });
                                    }}
                                    placeholder="Add a trend"
                                    classNames={{
                                      tag: "trendItem",
                                      remove: "removeButton",
                                    }}
                                    allowUnique={true}
                                    inputFieldPosition="top"
                                    removeComponent={({
                                      className,
                                      onRemove,
                                    }) => {
                                      return (
                                        <button
                                          onClick={onRemove}
                                          className={className}
                                        >
                                          X
                                        </button>
                                      );
                                    }}
                                    handleDelete={(index, event) => {
                                      const thisFileTrends =
                                        trendTagsPerFile[file.url];
                                      thisFileTrends.splice(index, 1);
                                      setTrendTagsPerFile({
                                        ...trendTagsPerFile,
                                        [file.url]: trendTagsPerFile[file.url],
                                      });
                                    }}
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-danger remove-item glyphicon glyphicon-remove"
                  aria-label="Delete"
                  onClick={() => {
                    if (confirm("Are you sure?")) {
                      deleteItemFunc(item);
                      mainDialog.close();
                    }
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  aria-label="Close"
                  onClick={() => {
                    mainDialog.close();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
      <dialog
        id={ADD_FILES_DIALOG_ID}
        style={{ width: "400px", height: "600px" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5>Add File to Evidence for {item.name}</h5>
          </div>
          <div className="modal-body">
            {/* <div ng-show="loading" style={{ textAlign: "center" }}>
              <img src="ajax-loader.gif" width="32" height="32" />
            </div> */}
            <input
              type="text"
              id="fileFilter"
              placeholder="Search files..."
              style={{ width: "100%" }}
              onChange={(event) => {
                setFilteredFiles(
                  files.filter((file) =>
                    file.title
                      .toLocaleLowerCase()
                      .includes(event.target.value.toLocaleLowerCase())
                  )
                );
              }}
            />
            <div id="files">
              <table className="table">
                <tbody>
                  {filteredFiles &&
                    filteredFiles.map((file) => (
                      <tr key={`file #${file.alternateLink}`}>
                        <td style={{ width: "100px" }}>
                          <input
                            type="checkbox"
                            // ng-model="file.selected"
                            onChange={(event) => addFile(file, event)}
                          />
                        </td>
                        <td className="file">
                          <a href="{{ file.alternateLink }}" target="_blank">
                            <img ng-src="{{ file.iconLink }}" />
                            {file.title}
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-primary"
              onClick={() => addFilesModal.close()}
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
