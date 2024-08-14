import React, { useCallback, useEffect, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";

import { EvidencePaneProps, Persona, TagsPerEvidenceRecord } from "../../types";

// import { EvidencePaneContext } from "../../contexts/EvidencePaneContext";

import EmpathyMapPane from "./EmpathyMapPane";
import { AllTagsContext } from "../../contexts/AllTagsContext";
import AddPersonaPane from "./AddPersonaPane";
import useCollectionItems from "../../hooks/useCollectionItems";

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
  const EMPATHY_MAP_DIALOG_ID = `empathyMap: ${containerModalId}`;

  const allPersonas = useCollectionItems(productId, "personas");

  const [personasAsEvidence, setPersonasAsEvidence] = useState(evidence);

  /**
   * @type {[TagsPerEvidenceRecord | undefined, React.Dispatch<TagsPerEvidenceRecord | undefined>]}
   */
  const [tagsPerPersona, setTagsPerPersona] = useState();

  /**
   * @type {[HTMLDialogElement | undefined, React.Disptch<HTMLDialogElement | undefined>]}
   */
  const [addPersonaDialog, setAddPersonaDialog] = useState();

  useEffect(() => {
    if (!addPersonaDialog && document.getElementById(ADD_PERSONA_DIALOG_ID)) {
      setAddPersonaDialog(document.getElementById(ADD_PERSONA_DIALOG_ID));
    }
  });

  /**
   * @type {[HTMLDialogElement | undefined, React.Disptch<HTMLDialogElement | undefined>]}
   */
  const [empathyMapDialog, setEmpathyMapDialog] = useState();

  useEffect(() => {
    if (!empathyMapDialog && document.getElementById(EMPATHY_MAP_DIALOG_ID)) {
      setEmpathyMapDialog(document.getElementById(EMPATHY_MAP_DIALOG_ID));
    }
  });

  /**
   * @type {[ReactTags.Tag[] | undefined, React.Dispatch<ReactTags.Tag[] | undefined>]}
   */
  const [allTagsForEmpathyMapDialog, setAllTagsForEmpathyMapDialog] =
    useState();
  /**
   * @type {[ReactTags.Tag[], React.Dispatch<ReactTags.Tag[]>]}
   */
  const [selectedTags, setSelectedTags] = useState([]);

  const [currentPersonaAsEvidence, setCurrentPersonaAsEvidence] = useState();

  const showPersonaTrendModal = useCallback(
    (personaAsEvidence) => {
      if (empathyMapDialog && allPersonas) {
        // FIXME: personasAsEvidence don't have .evidence
        const fullPersona = allPersonas.find(
          (p) => p.name === personaAsEvidence.name
        );
        const selectedPersonaAllTags = fullPersona.evidence.reduce(
          (reactTags, file) => {
            if (file.trends) {
              file.trends.forEach((trend) => {
                if (!reactTags.find((rt) => rt.id === trend.name)) {
                  reactTags.push({
                    id: trend.name,
                    text: trend.name, // TODO: put (n) here?
                    className: trend.type,
                  });
                }
              });
            }
            return reactTags;
          },
          []
        );
        const existingTrendNames = personaAsEvidence.trends.map(
          (trend) => trend.name
        );
        setAllTagsForEmpathyMapDialog(
          selectedPersonaAllTags.filter(
            (tag) => !existingTrendNames.includes(tag.id)
          )
        );
        setCurrentPersonaAsEvidence(personaAsEvidence);
        empathyMapDialog.addEventListener("click", (event) => {
          if (event.target === event.currentTarget) {
            empathyMapDialog.close();
          }
        });
        empathyMapDialog.addEventListener("close", async () => {
          setSelectedTags([]);
          setAllTagsForEmpathyMapDialog(undefined);
        });
        empathyMapDialog.showModal();
      }
    },
    [empathyMapDialog, allPersonas, selectedTags]
  );

  useEffect(() => {
    if (currentPersonaAsEvidence) {
      setTagsPerPersona({
        ...tagsPerPersona,
        [currentPersonaAsEvidence.name]: [
          ...tagsPerPersona[currentPersonaAsEvidence.name],
          ...selectedTags,
        ],
      });
    }
  }, [currentPersonaAsEvidence, selectedTags]);

  // set tagsPerPersona initially from evidence
  useEffect(() => {
    const initialTags = personasAsEvidence.reduce(
      (trendsMap, personaAsEvidence) => {
        if (!trendsMap[personaAsEvidence.name]) {
          if (personaAsEvidence.trends) {
            trendsMap[personaAsEvidence.name] = personaAsEvidence.trends.map(
              (trend) => ({
                id: trend.name,
                text: trend.name,
                className: trend.type,
              })
            );
          } else {
            trendsMap[personaAsEvidence.name] = [];
          }
        }
        return trendsMap;
      },
      {}
    );
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
    if (addPersonaDialog) {
      addPersonaDialog.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
          addPersonaDialog.close();
        }
      });
      addPersonaDialog.showModal();
    }
  };

  const addPersonaAsEvidence = useCallback(
    /**
     * Add a Persona object to personasAsEvidence
     * @param {Persona} persona The persona to add as evidence.
     * @returns {void}
     */
    async (persona) => {
      const newPersonasAsEvidence = [
        ...personasAsEvidence,
        {
          name: persona.name,
          trends: [],
        },
      ];
      setPersonasAsEvidence(newPersonasAsEvidence);
      await updateEvidenceOnServer(newPersonasAsEvidence);

      document.getElementById("personaFilter").value = "";
      // addPersonaDialog.close();
    },
    [personasAsEvidence]
  );

  const removePersona = async (persona) => {
    const newPersonasAsEvidence = personasAsEvidence.filter(
      (p) => p.name !== persona.name
    );
    setPersonasAsEvidence(newPersonasAsEvidence);
    await updateEvidenceOnServer(newPersonasAsEvidence);
    document.getElementById("personaFilter").value = "";
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
    if (tagsPerPersona && personasAsEvidence) {
      let thereAreChangesToTrends = false;

      Object.keys(tagsPerPersona).forEach((personaName) => {
        const evidencePersona = personasAsEvidence.find(
          (p) => p.name === personaName
        );
        const tags = tagsPerPersona[personaName];
        if (tags && tags.length > 0) {
          const trends = tags.map((tag) => ({
            name: tag.id,
            type: tag.className,
          }));
          if (
            getJsonSortedString(evidencePersona.trends) !==
            getJsonSortedString(trends)
          ) {
            evidencePersona.trends = trends;
            thereAreChangesToTrends = true;
          }
        }
      });
      if (thereAreChangesToTrends) {
        const flatTags =
          getFlatTagsWithCountsFromTagsPerPersona(tagsPerPersona);
        allTagsUpdated(flatTags);
        updateEvidenceOnServer(personasAsEvidence);
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
          {personasAsEvidence.map((personaAsEvidence) => (
            <tr key={`Item evidence: ${personaAsEvidence.name} `}>
              <td>
                <span
                  className="remove-evidence bi bi-trash"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (confirm("Are you sure?")) {
                      removePersona(personaAsEvidence);
                    }
                  }}
                ></span>
              </td>
              <td>
                {personaAsEvidence.createdDate &&
                  new Date(personaAsEvidence.createdDate).toLocaleDateString()}
              </td>
              <td>
                <a
                  className="pointer"
                  onClick={() => showPersonaTrendModal(personaAsEvidence)}
                >
                  {/* <img src={persona.icon} /> */}
                  {personaAsEvidence.name}
                </a>
              </td>
              <td>
                {tagsPerPersona && tagsPerPersona[personaAsEvidence.name] && (
                  <ReactTags
                    tags={tagsPerPersona[personaAsEvidence.name]}
                    // separators={[SEPARATORS.ENTER]}
                    // allowAdditionFromPaste={false}
                    editable={false}
                    readOnly={true}
                    classNames={{
                      tag: "trendItem readOnly",
                      remove: "removeButton",
                    }}
                    // allowUnique={true}
                    inputFieldPosition="top"
                    removeComponent={({ className, onRemove }) => {
                      return (
                        <button onClick={onRemove} className={className}>
                          X
                        </button>
                      );
                    }}
                    handleDelete={(index) => {
                      const thisFileTrends =
                        tagsPerPersona[personaAsEvidence.name];
                      thisFileTrends.splice(index, 1); // FIXME: splice might not work
                      setTagsPerPersona({
                        ...tagsPerPersona,
                        [personaAsEvidence.name]:
                          tagsPerPersona[personaAsEvidence.name],
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
        <AddPersonaPane
          productId={productId}
          existingPersonaNames={personasAsEvidence.map((pae) => pae.name)}
          personaSelectedCallback={(persona) => addPersonaAsEvidence(persona)}
        />
      </dialog>
      <dialog
        id={EMPATHY_MAP_DIALOG_ID}
        style={{ width: "800px", height: "600px" }}
      >
        <AllTagsContext.Provider value={allTagsForEmpathyMapDialog}>
          <EmpathyMapPane
            handleTagClick={(tagIndex, reactTags) => {
              const tag = reactTags[tagIndex];
              setSelectedTags([...selectedTags, tag]);
            }}
          />
        </AllTagsContext.Provider>
      </dialog>
    </>
  );
};

export default StakeholderEvidencePane;
