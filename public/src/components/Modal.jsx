import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

import useOAuthAPI from "../hooks/useOAuthAPI";
import usePersonasAPI from "../hooks/usePersonasAPI";
import { EvidenceFile, WidgetDataItem, GoogleFile } from "../types";

/**
 * @param {object} props
 * @param {WidgetDataItem} props.item The item to show in the modal.
 * @param {string} props.dialogId The ID to give the dialog.
 * @param {(itemIndex: number) => void} props.deleteFunc The function to call when a new item is deleted.
 * @param {(item: WidgetDataItem) => void} props.updateFunc The function to call when a new item is updated.
 * @returns {JSX.Element} The rendered modal.
 * @example
 *  <Modal item={*} dialogId="*" deleteFunc={*} updateFunc={*} />
 */
const Modal = ({ item, dialogId, deleteFunc, updateFunc }) => {
  const ADD_FILES_DIALOG_ID = `addFilesModal: ${dialogId}`;

  /**
   * @type {[{[key: string]: ReactTags.Tag[]}, ReactDispatch<{[key: string]: ReactTags.Tag[]}>]}
   */
  const [trendTags, setTrendTags] = useState({});

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
    setTrendTags(initialTrendTags);
  }, []);

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
  useEffect(() => {
    let thereAreChanges = false;
    item.evidence.forEach((file) => {
      const tags = trendTags[file.url];
      if (tags) {
        const trends = tags.map((tag) => ({
          name: tag.text,
          type: tag.className,
        }));
        if (getJsonSortedString(file.trends) !== getJsonSortedString(trends)) {
          file.trends = trends;
          thereAreChanges = true;
        }
      }
    });
    if (thereAreChanges) {
      updateFunc(item);
    }
  }, [trendTags]);

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
        updateFunc(item);

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
    updateFunc(item);
    const newFiles = [...files, file];
    setFiles(newFiles);
    setFilteredFiles(newFiles);
    document.getElementById("fileFilter").value = "";
  };

  const css = `
    .trendItem {
      display: block;
    }
  `;

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
                      {item.evidence.length === 0 && (
                        <span>
                          There is no evidence. Start by adding a file!
                        </span>
                      )}
                      {item.evidence.length > 0 && (
                        <table className="table">
                          <tbody>
                            {/* ng-repeat="trend in trendList | filter: hasType track by $index" */}
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
                                <ReactTags
                                  tags={trendTags[file.url]}
                                  handleAddition={(tag) => {
                                    const thisFileTrends = trendTags[file.url];
                                    thisFileTrends.push(tag);
                                    setTrendTags({
                                      ...trendTags,
                                      [file.url]: trendTags[file.url],
                                    });
                                  }}
                                  // autocomplete={true}
                                  // allowDragDrop={true}
                                  placeholder="Add a trend"
                                  classNames={{
                                    tag: "trendItem",
                                  }}
                                  // allowUnique={true}
                                  inputFieldPosition="top"
                                  handleDelete={(index, event) => {
                                    const thisFileTrends = trendTags[file.url];
                                    thisFileTrends.splice(index, 1);
                                    setTrendTags({
                                      ...trendTags,
                                      [file.url]: trendTags[file.url],
                                    });
                                  }}
                                />
                                {/* <tags-input
                                  ng-model="file.trends"
                                  placeholder="Add a trend"
                                  display-property="name"
                                  template="tag-template"
                                  add-on-paste="true"
                                  on-tag-adding="$tag.className='label-info'"
                                  on-tag-added="addTrend(persona, $index, $tag)"
                                  on-tag-removing="removeTrend(persona, $index, $tag)"
                                  on-tag-clicked="handleTrendClick($index, $event, $tag)"
                                  replace-spaces-with-dashes={false}
                                  id={file.name}
                                >
                                  <auto-complete
                                    source="findTrend(persona, $query)"
                                    load-on-focus="true"
                                    allow-duplicates="true"
                                    debounce-delay="10"
                                    display-property="name"
                                    min-length="1"
                                  ></auto-complete>
                                </tags-input> */}
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
                    deleteFunc(item);
                    mainDialog.close();
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
