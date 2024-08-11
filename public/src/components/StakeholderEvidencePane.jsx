import React, { useCallback, useContext, useEffect, useState } from "react";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

import { EvidencePaneProps, Persona, TagsPerEvidenceRecord } from "../types";

import { AllTagsContext } from "../contexts/AllTagsContext";
import useCollectionItems from "../hooks/useCollectionItems";

/**
 * @param {EvidencePaneProps} props The object containing the props.
 * @returns {React.JSX.Element} The rendered pane.
 */
const StakeholderEvidencePane = ({
  productId,
  evidence,
  containerModalId,
  updateEvidenceOnServer,
  allTagsUpdated,
}) => {
  const ADD_PERSONA_DIALOG_ID = `addPersona: ${containerModalId}`;

  /**
   * @type {[TagsPerEvidenceRecord | undefined, React.Dispatch<TagsPerEvidenceRecord | undefined>]}
   */
  const [tagsPerPersona, setTagsPerPersona] = useState();

  /**
   * @type {[HTMLDialogElement | undefined, React.Disptch<HTMLDialogElement | undefined>]}
   */
  const [addPersonaModal, setAddPersonaModal] = useState();

  useEffect(() => {
    if (document.getElementById(ADD_PERSONA_DIALOG_ID) && !addPersonaModal) {
      setAddPersonaModal(document.getElementById(ADD_PERSONA_DIALOG_ID));
    }
  });

  /**
   * @type {[string[] | undefined, React.Dispatch<string[] | undefined>]}
   */
  const [existingPersonaNamesFilter, setExistingPersonaNamesFilter] =
    useState();
  const [searchPersonasFilter, setSearchPersonasFilter] = useState();

  const personas = useCollectionItems(productId, "personas");

  const allTags = useContext(AllTagsContext);

  // update tagsPerPersona based on className changes on the summary pane
  useEffect(() => {
    if (allTags && tagsPerPersona) {
      let thereAreChanges = false;
      evidence.forEach((record) => {
        tagsPerPersona[record.name].forEach((tag) => {
          const allTagsTag = allTags.find((t) => t.id === tag.id);
          if (tag.className !== allTagsTag.className) {
            tag.className = allTagsTag.className;
            thereAreChanges = true;
          }
        });
      });
      if (thereAreChanges) {
        // TODO: try to avoid one more re-render/re-evaluation of this effect after making this change
        setTagsPerPersona({ ...tagsPerPersona });
      }
    }
  }, [allTags, tagsPerPersona]);

  // set a personas filter for choosing new ones based on ones that have been chosen
  useEffect(() => {
    if (personas) {
      const filteredPersonas = personas.filter(
        (persona) =>
          evidence
            .map((f) => {
              return f.name;
            })
            .indexOf(persona.name) === -1
      );
      setExistingPersonaNamesFilter(filteredPersonas.map((p) => p.name));
    }
  }, [personas]);

  // set tagsPerPersona initially from evidence
  useEffect(() => {
    const initialTags = evidence.reduce((trendsMap, persona) => {
      if (!trendsMap[persona.name]) {
        if (persona.trends) {
          trendsMap[persona.name] = persona.trends.map((trend) => ({
            id: trend.name,
            text: trend.name,
            className: trend.type,
          }));
        } else {
          trendsMap[persona.name] = [];
        }
      }
      return trendsMap;
    }, {});
    setTagsPerPersona(initialTags);
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

  const getJsonSortedString = (trends) => {
    if (trends) {
      return JSON.stringify(trends.map((trend) => trend.name).sort(sortString));
    }
    return "";
  };

  const openFilesModal = () => {
    if (addPersonaModal) {
      addPersonaModal.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
          addPersonaModal.close();
        }
      });
      addPersonaModal.showModal();
    }
  };

  const addPersona = useCallback(
    /**
     *
     * @param {Persona} persona The persona to add as evidence.
     * @param {React.ChangeEvent<HTMLInputElement>} event The event called on <input> change
     * @returns {void}
     */
    async (persona, event) => {
      const checkbox = event.target;
      if (checkbox.checked) {
        var newPersona = {
          name: persona.name,
          // url: persona.???,
          // icon: persona.iconLink,
          createdDate: persona.createdDate,
          modifiedDate: persona.modifiedDate,
        };
        evidence.push(newPersona);
        await updateEvidenceOnServer(evidence);
        tagsPerPersona[newPersona.name] = [];
        setTagsPerPersona({ ...tagsPerPersona });

        setExistingPersonaNamesFilter(
          personas.filter((p) => p.name !== persona.name).map((p) => p.name)
        );

        document.getElementById("personaFilter").value = "";
        addPersonaModal.close();
      }
    },
    [personas]
  );

  const removePersona = async (persona) => {
    const personaIndex = evidence.map((p) => p.name).indexOf(persona.name);
    evidence.splice(personaIndex, 1);
    await updateEvidenceOnServer(evidence);
    setExistingPersonaNamesFilter(evidence.map((p) => p.name));
    document.getElementById("personaFilter").value = "";
    // setFilteredFiles(newFiles);
  };

  const getOccurenceNumber = (tagText) =>
    parseInt(tagText.match(/\(([0-9]+)\)/)[1]);

  const getFlatTagsWithCountsFromTagsPerPersona = useCallback(() => {
    /**
     * @type {ReactTags.Tag[]}
     */
    const newAllTags = [];
    /**
     * @type {{[key: string]: {count: number, className: string}}}
     */
    const tagDataMap = {};
    Object.keys(tagsPerPersona).forEach((personaName) => {
      const fileTags = JSON.parse(JSON.stringify(tagsPerPersona[personaName]));
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
  }, [tagsPerPersona]);

  // update allTags and evidence on the server if there are changes: added tags, edited tags, deleted tags
  useEffect(() => {
    if (tagsPerPersona) {
      let thereAreChangesToTrends = false;

      Object.keys(tagsPerPersona).forEach((personaName) => {
        const evidenceFile = evidence.find((p) => p.name === personaName);
        const tags = tagsPerPersona[personaName];
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
        const flatTags =
          getFlatTagsWithCountsFromTagsPerPersona(tagsPerPersona);
        allTagsUpdated(flatTags);
        updateEvidenceOnServer(evidence);
      }
    }
  }, [tagsPerPersona]);

  return (
    <>
      <h2>
        <a style={{ cursor: "pointer" }} onClick={() => openFilesModal()}>
          Add Persona
        </a>
      </h2>
      <table className="table">
        <tbody>
          {evidence.map((persona) => (
            <tr key={`Item evidence: ${persona.name} `}>
              <td>
                <span
                  className="remove-evidence bi bi-trash"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (confirm("Are you sure?")) {
                      removePersona(persona);
                    }
                  }}
                ></span>
              </td>
              <td>
                {persona.createdDate &&
                  new Date(persona.createdDate).toLocaleDateString()}
              </td>
              <td>
                {/* <a href={persona.name} target="_blank" rel="noreferrer"> */}
                {/* <img src={persona.icon} /> */}
                {persona.name}
                {/* </a> */}
              </td>
              <td>
                {tagsPerPersona && tagsPerPersona[persona.name] && (
                  <ReactTags
                    tags={tagsPerPersona[persona.name]}
                    separators={[SEPARATORS.ENTER]}
                    allowAdditionFromPaste={false}
                    handleAddition={(tag) => {
                      const fileTags = [...tagsPerPersona[persona.name]];
                      fileTags.push(tag);
                      setTagsPerPersona({
                        ...tagsPerPersona,
                        [persona.name]: fileTags,
                      });
                    }}
                    // suggestions={allTags
                    //   .filter(
                    //     (tag) =>
                    //       trendtagsPerPersona[persona.name] &&
                    //       !trendtagsPerPersona[persona.name]
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
                      const fileTags = [...tagsPerPersona[persona.name]];
                      fileTags[index] = {
                        id: tag.id.charAt(0).toUpperCase() + tag.id.slice(1),
                        text:
                          tag.text.charAt(0).toUpperCase() + tag.text.slice(1),
                        className: fileTags[index].className,
                      };
                      setTagsPerPersona({
                        ...tagsPerPersona,
                        [persona.name]: fileTags,
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
                      const thisFileTrends = tagsPerPersona[persona.name];
                      thisFileTrends.splice(index, 1);
                      setTagsPerPersona({
                        ...tagsPerPersona,
                        [persona.name]: tagsPerPersona[persona.name],
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
        id={ADD_PERSONA_DIALOG_ID}
        style={{ width: "600px", height: "600px" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5>Add Persona to Evidence</h5>
          </div>
          <div className="modal-body">
            {/* <div ng-show="loading" style={{ textAlign: "center" }}>
              <img src="ajax-loader.gif" width="32" height="32" />
            </div> */}
            {personas && (
              <input
                type="text"
                id="personaFilter"
                placeholder="Search stakeholder personas..."
                style={{ width: "100%" }}
                onChange={(event) => {
                  setSearchPersonasFilter(
                    personas.filter((persona) =>
                      persona.name
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
                  {personas &&
                    personas
                      .filter(
                        (p) =>
                          !existingPersonaNamesFilter ||
                          existingPersonaNamesFilter.includes(p.name)
                      )
                      .filter(
                        (p) =>
                          !searchPersonasFilter ||
                          searchPersonasFilter.includes(p.name)
                      )
                      .map((persona) => (
                        <tr key={`persona #${persona.name}`}>
                          <td style={{ width: "100px" }}>
                            <input
                              type="checkbox"
                              onChange={(event) => addPersona(persona, event)}
                            />
                          </td>
                          <td className="file">
                            {/* <a
                              href={persona.name}
                              target="_blank"
                              rel="noreferrer"
                            > */}
                            {/* <img src={persona.iconLink} /> */}
                            {persona.name}
                            {/* </a> */}
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
              onClick={() => addPersonaModal.close()}
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

export default StakeholderEvidencePane;
