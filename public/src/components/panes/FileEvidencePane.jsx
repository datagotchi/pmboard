import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

import {
  EvidenceFile,
  EvidencePaneProps,
  GoogleFile,
  TagsPerEvidenceRecord,
} from "../../types";
import { getJsonSortedString, getOccurenceNumber } from "../../../../util";

import useOAuthAPI from "../../hooks/useOAuthAPI";
import { AllTagsContext } from "../../contexts/AllTagsContext";

/**
 * A pane to show in a modal dialog to add files from Google Drive as evidence to a widget item.
 * @param {EvidencePaneProps} props The object containing the props.
 * @returns {React.JSX.Element} The rendered pane.
 * @example <FileEvidencePane evidence={[...]} containerModalId="" updateEvidenceOnServer={() => {}} allTagsUpdated={() => {}}
 */
const FileEvidencePane = ({
  evidence,
  containerModalId,
  updateEvidenceOnServer,
  removeFileFunc,
  allTagsUpdated,
  deleteTrendFunc,
  addTrendFunc,
  updateTrendNameFunc,
}) => {
  const ADD_FILES_DIALOG_ID = `addFilesModal: ${containerModalId}`;

  /**
   * A convenience function to sort strings in an array.
   * @param {string} a The first item to compare to the second.
   * @param {string} b The second item to compare to the first.
   * @returns {number} Positive if a should come first, negative if b, and 0 if they are the same.
   * @example sortString("asdf", "basdf") === 1
   */
  const sortString = (a, b) => {
    if (a < b) {
      return 1;
    }
    if (b < a) {
      return -1;
    }
    return 0;
  };

  /**
   * @type {[TagsPerEvidenceRecord | undefined, React.Dispatch<TagsPerEvidenceRecord | undefined>]}
   */
  const [tagsPerFile, setTagsPerFile] = useState();

  /**
   * @type {[EvidenceFile[] | undefined, React.Dispatch<EvidenceFile[]>]}
   */
  const [files, setFiles] = useState(evidence);

  /**
   * @type {[GoogleFile[] | undefined, React.Dispatch<GoogleFile[] | undefined>]}
   */
  const [googleFiles, setGoogleFiles] = useState();

  /**
   * @type {[HTMLDialogElement | undefined, React.Disptch<HTMLDialogElement | undefined>]}
   */
  const [addFilesModal, setAddFilesModal] = useState();

  // set addFilesModal once it exists
  useEffect(() => {
    if (document.getElementById(ADD_FILES_DIALOG_ID) && !addFilesModal) {
      setAddFilesModal(document.getElementById(ADD_FILES_DIALOG_ID));
    }
  });

  /**
   * @type {[GoogleFile[] | undefined, React.Dispatch<GoogleFile[] | undefined>]}
   */
  const [filteredGoogleFiles, setFilteredGoogleFiles] = useState();

  const { getGoogleDriveFiles } = useOAuthAPI();

  const accessToken = useMemo(() => sessionStorage.getItem("access_token"), []);

  const allTags = useContext(AllTagsContext);

  // update tagsPerFile based on className changes on the summary pane (in allTags)
  useEffect(() => {
    if (allTags && tagsPerFile) {
      let thereAreChanges = false;
      evidence.forEach((file) => {
        tagsPerFile[file.url].forEach((tag) => {
          const allTagsTag = allTags.find((t) => t.id === tag.id);
          if (allTagsTag && tag.className !== allTagsTag.className) {
            tag.className = allTagsTag.className;
            const trend = file.trends.find((t) => t.name === tag.id);
            if (trend) {
              trend.type = tag.className;
            } else {
              console.error("*** trend not found in evidence: ", tag.id);
            }
            thereAreChanges = true;
          }
        });
      });
      if (thereAreChanges) {
        // updateEvidenceOnServer(evidence); // FIXME: remove this in favor of specific calls
        // TODO: try to avoid one more re-render/re-evaluation of this effect after making this change
        setTagsPerFile({ ...tagsPerFile });
      }
    }
  }, [allTags, tagsPerFile]);

  useEffect(() => {
    if (accessToken && !googleFiles) {
      const encodedToken = encodeURI(accessToken);
      getGoogleDriveFiles(encodedToken).then((files) => {
        const filteredFiles = files.filter(
          (file) =>
            evidence
              .map(function (f) {
                return f.url;
              })
              .indexOf(file.alternateLink) === -1
        );
        setGoogleFiles([...filteredFiles]);
        setFilteredGoogleFiles([...filteredFiles]);
      });
    }
  }, [accessToken, googleFiles]);

  useEffect(() => {
    const initialTags = evidence.reduce((trendsMap, file) => {
      if (!trendsMap[file.url]) {
        if (file.trends) {
          trendsMap[file.url] = file.trends.map((trend) => ({
            id: trend.name,
            text: trend.name,
            className: trend.type,
          }));
        } else {
          trendsMap[file.url] = [];
        }
      }
      return trendsMap;
    }, {});
    setTagsPerFile(initialTags);
  }, []);

  // update allTags and evidence on the server if there are changes: edited tags, deleted tags
  useEffect(() => {
    if (tagsPerFile) {
      let thereAreChangesToTrends = false;

      Object.keys(tagsPerFile).forEach((fileUrl) => {
        const evidenceFile = evidence.find((file) => file.url === fileUrl);
        const tags = tagsPerFile[fileUrl];
        if (tags && tags.length > 0) {
          const trends = tags.map((tag) => ({
            name: tag.id,
            type: tag.className,
          }));
          if (
            getJsonSortedString(evidenceFile.trends) !==
            getJsonSortedString(trends)
          ) {
            evidenceFile.trends = trends;
            thereAreChangesToTrends = true;
          }
        }
      });
      if (thereAreChangesToTrends) {
        const flatTags = getFlatTagsWithCountsFromTagsPerFile(tagsPerFile);
        allTagsUpdated(flatTags);
      }
    }
  }, [tagsPerFile]);

  /**
   * A function to open a modal dialog on top of the base modal to select files from Google Drive.
   * @example <Component onClick={() => openFilesModal()} />
   */
  const openFilesModal = () => {
    if (addFilesModal) {
      addFilesModal.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
          addFilesModal.close();
        }
      });
      // FIXME: does not list files
      addFilesModal.showModal();
    }
  };

  const addFile = useCallback(
    /**
     * A function to add a specified file to a widget item's evidence.
     * @param {GoogleFile} file The gdrive file to add as evidence.
     * @param {React.ChangeEvent<HTMLInputElement>} event The event called on <input> change
     * @example <Component onClick={() => addFile(...)} />
     */
    async (file, event) => {
      const checkbox = event.target;
      if (checkbox.checked) {
        var newFile = {
          name: file.title,
          url: file.alternateLink,
          icon: file.iconLink,
          createdDate: file.createdDate,
          modifiedDate: file.modifiedDate,
        };
        evidence.push(newFile);
        await updateEvidenceOnServer(evidence);
        tagsPerFile[newFile.url] = [];
        setTagsPerFile({ ...tagsPerFile });

        const newFiles = googleFiles.filter(
          (f) => f.alternateLink !== file.alternateLink
        );
        setGoogleFiles(newFiles);

        document.getElementById("fileFilter").value = "";
        setFilteredGoogleFiles(newFiles);
        addFilesModal.close();
      }
    },
    [googleFiles]
  );

  /**
   * A function to remove a file from a widget item's evidence.
   * @param {EvidenceFile} file The file to remove.
   * @example <DeleteButton onClick={() => removeFile(...)} />
   */
  const removeFile = async (file) => {
    const fileIndex = evidence.indexOf((f) => f.url === file.url);
    evidence.splice(fileIndex, 1);
    await removeFileFunc(file.id);
    setFiles(files.filter((f) => f.url !== file.url));
    const newGoogleFiles = [...googleFiles, file];
    setGoogleFiles(newGoogleFiles);
    document.getElementById("fileFilter").value = "";
  };

  const getFlatTagsWithCountsFromTagsPerFile = useCallback(() => {
    /**
     * @type {ReactTags.Tag[]}
     */
    const newAllTags = [];
    /**
     * @type {{[key: string]: {count: number, className: string}}}
     */
    const tagDataMap = {};
    Object.keys(tagsPerFile).forEach((fileUrl) => {
      const fileTags = JSON.parse(JSON.stringify(tagsPerFile[fileUrl]));
      fileTags.forEach((tag) => {
        if (!tagDataMap[tag.id]) {
          tagDataMap[tag.id] = {
            count: 0,
            className: tag.className,
          };
        }
        tagDataMap[tag.id].count += 1;
      });
    });
    Object.keys(tagDataMap).forEach((tagId) => {
      const tagData = tagDataMap[tagId];
      newAllTags.push({
        id: tagId,
        text: `${tagId} (${tagData.count})`,
        className: tagData.className,
      });
    });
    return newAllTags
      .sort(sortString)
      .sort((a, b) => getOccurenceNumber(b.text) - getOccurenceNumber(a.text));
  }, [tagsPerFile]);

  return (
    <>
      <h2>
        <a style={{ cursor: "pointer" }} onClick={() => openFilesModal()}>
          Add File
        </a>
      </h2>
      <table className="table">
        <tbody>
          {files &&
            files.map((file) => (
              <tr key={`Item evidence: ${file.url} `}>
                <td>
                  <span
                    className="remove-evidence bi bi-trash"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (confirm("Are you sure?")) {
                        removeFile(file);
                      }
                    }}
                  ></span>
                </td>
                <td>
                  {file.modifiedDate &&
                    new Date(file.modifiedDate).toLocaleDateString()}
                </td>
                <td>
                  <a href={file.url} target="_blank" rel="noreferrer">
                    <img src={file.icon} />
                    {file.name}
                  </a>
                </td>
                <td>
                  {tagsPerFile && tagsPerFile[file.url] && (
                    <ReactTags
                      tags={tagsPerFile[file.url]}
                      separators={[SEPARATORS.ENTER]}
                      allowAdditionFromPaste={false}
                      handleAddition={(tag) => {
                        const fileTags = [...tagsPerFile[file.url]];
                        fileTags.push(tag);
                        setTagsPerFile({
                          ...tagsPerFile,
                          [file.url]: fileTags,
                        });
                        addTrendFunc(file.id, {
                          name: tag.id,
                        });
                      }}
                      // suggestions={allTags
                      //   .filter(
                      //     (tag) =>
                      //       trendTagsPerFile[file.url] &&
                      //       !trendTagsPerFile[file.url]
                      //         .map((t) => t.id)
                      //         .includes(tag.id)
                      //   )
                      //   .map((allTag) => ({
                      //     id: allTag.id,
                      //     text: allTag.id,
                      //     className: allTag.className,
                      //   }))}
                      // renderSuggestion={(item, query) => {}}
                      editable={true}
                      onTagUpdate={(index, tag) => {
                        const fileTags = [...tagsPerFile[file.url]];
                        fileTags[index] = {
                          id: tag.id.charAt(0).toUpperCase() + tag.id.slice(1),
                          text:
                            tag.text.charAt(0).toUpperCase() +
                            tag.text.slice(1),
                          className: fileTags[index].className,
                        };
                        const trend = file.trends[index];
                        updateTrendNameFunc(file.id, {
                          id: trend.id,
                          name: tag.id,
                        });
                        setTagsPerFile({
                          ...tagsPerFile,
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
                      removeComponent={({ className, onRemove }) => {
                        return (
                          <button onClick={onRemove} className={className}>
                            X
                          </button>
                        );
                      }}
                      handleDelete={(index) => {
                        const trend = file.trends[index];
                        deleteTrendFunc(file.id, trend.id);
                        const thisFileTrends = tagsPerFile[file.url];
                        thisFileTrends.splice(index, 1);
                        setTagsPerFile({
                          ...tagsPerFile,
                          [file.url]: tagsPerFile[file.url],
                        });
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <dialog
        id={ADD_FILES_DIALOG_ID}
        style={{ width: "600px", height: "600px" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5>Add File to Evidence</h5>
          </div>
          <div className="modal-body">
            {/* <div ng-show="loading" style={{ textAlign: "center" }}>
              <img src="ajax-loader.gif" width="32" height="32" />
            </div> */}
            {googleFiles && (
              <input
                type="text"
                id="fileFilter"
                placeholder="Search files..."
                style={{ width: "100%" }}
                onChange={(event) => {
                  setFilteredGoogleFiles(
                    googleFiles.filter((file) =>
                      file.title
                        .toLocaleLowerCase()
                        .includes(event.target.value.toLocaleLowerCase())
                    )
                  );
                }}
              />
            )}
            <div id="files">
              <table className="table">
                <tbody>
                  {filteredGoogleFiles &&
                    filteredGoogleFiles.map((file) => (
                      <tr key={`file #${file.alternateLink}`}>
                        <td style={{ width: "100px" }}>
                          <input
                            type="checkbox"
                            onChange={(event) => addFile(file, event)}
                          />
                        </td>
                        <td className="file">
                          <a
                            href={file.alternateLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src={file.iconLink} />
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

export default FileEvidencePane;
