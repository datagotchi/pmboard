import React, { useEffect, useState } from "react";
import axios from "axios";

import { EvidenceFile, Persona, WidgetDataItem, GoogleFile } from "../types";

/**
 * @param {object} props
 * @param {WidgetDataItem} props.item The item to show in the modal.
 * @param {string} props.dialogId The ID to give the dialog.
 * @param {(personaIndex: number) => void} props.deleteFunc The function to call when a new item is deleted.
 * @param {(persona: Persona) => void} props.updateFunc The function to call when a new item is updated.
 * @returns {JSX.Element} The rendered modal.
 * @example
 *  <Modal item={*} dialogId="*" />
 */
const Modal = ({ item, dialogId, deleteFunc, updateFunc }) => {
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
    // FIXME: make sure I don't want to use the state variable being undefined as state
    setAddFilesModal(document.getElementById("addFilesModal"));

    // FIXME: maybe the access token is from the oauth result?
    const accessToken = "AIzaSyCdYyuvA4mB7NIccDTVG6W2osJkIXN90UM";
    axios
      .get("https://www.googleapis.com/drive/v2/files", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        const files = response.data.items.filter(
          (file) =>
            evidence
              .map(function (f) {
                return f.url;
              })
              .indexOf(file.alternateLink) === -1
        );
        setFiles([...files]);
      })
      .catch((err) => {
        console.error(err);
        // if (res.status === 401) {
        // TODO: load login page
        // }
      })
      .finally(() => {
        // setListFilesLoading(false);
      });
  }, []);

  /**
   * @param {Persona} persona
   */
  const openFilesModal = (persona) => {
    if (addFilesModal) {
      addFilesModal.showModal();
    }
  };

  /**
   * @type {[GoogleFile[] | undefined, React.Dispatch<GoogleFile[] | undefined>]}
   */
  const [files, setFiles] = useState();

  return (
    <>
      <dialog id={dialogId}>
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
                        href="#personaSummary"
                        aria-controls="summary"
                        role="tab"
                        data-toggle="tab"
                      >
                        Summary
                      </a>
                    </li>
                    <li role="presentation" className="active">
                      <a
                        href="#personaEvidence"
                        aria-controls="evidence"
                        role="tab"
                        data-toggle="tab"
                      >
                        Evidence
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div
                      role="tabpanel"
                      className="tab-pane"
                      id="personaSummary"
                    >
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
                      id="personaEvidence"
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
                          {item.evidence.map((file, index) => (
                            <tr>
                              <td>
                                <span
                                  className="remove-evidence glyphicon glyphicon-remove"
                                  style={{ cursor: "pointer" }}
                                  onClick={removeFile(persona, index)}
                                ></span>
                              </td>
                              <td>
                                <a href={file.url} target="_blank">
                                  <img src={file.icon} />
                                  {file.name}
                                </a>
                              </td>
                              <td>
                                <tags-input
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
                                </tags-input>
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
      <dialog id="addFilesModal">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Add File to Evidence for {item.name}</h5>
          </div>
          <div className="modal-body">
            <div ng-show="loading" style={{ textAlign: "center" }}>
              <img src="ajax-loader.gif" width="32" height="32" />
            </div>
            <div id="files">
              <table className="table">
                <tbody>
                  {files &&
                    files.map((file) => (
                      <tr>
                        <td style={{ width: "100px" }}>
                          <input
                            type="checkbox"
                            // ng-model="file.selected"
                            onChange={addFile(file, $parent.getRowIndex(name))}
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
              data-dismiss="modal"
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
