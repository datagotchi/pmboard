import React, { useEffect, useState } from "react";
import useCollectionItems from "../../hooks/useCollectionItems";

/**
 * A pane to show in a modal dialog to choose a persona (e.g., as evidence for a user story).
 * @param {object} props The React component properties object.
 * @param {string} props.productId The ID of the current product;
 * @param {string[]} props.existingPersonaNames The names of personas currently on the StakeholderEvidencePane.
 * @param {() => void} props.personaSelectedCallback The function to call when a persona is selected.
 * @returns {React.JSX.Element} The rendered pane.
 * @example <AddPersonaPane productId={2} existingPersonaNames={[...]} personaSelectedCallback={() => {}}
 */
const AddPersonaPane = ({
  productId,
  existingPersonaNames,
  personaSelectedCallback,
}) => {
  const allPersonas = useCollectionItems(productId, "personas");
  const [possiblePersonas, setPossiblePersonas] = useState();

  useEffect(() => {
    if (allPersonas && !possiblePersonas) {
      setPossiblePersonas(
        allPersonas.filter((ap) => !existingPersonaNames.includes(ap.name))
      );
    }
  }, [allPersonas, possiblePersonas]);

  const [searchPersonasFilter, setSearchPersonasFilter] = useState();

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5>Add Persona to Evidence</h5>
      </div>
      <div className="modal-body">
        {/* <div ng-show="loading" style={{ textAlign: "center" }}>
              <img src="ajax-loader.gif" width="32" height="32" />
            </div> */}
        {possiblePersonas && (
          <input
            type="text"
            id="personaFilter"
            placeholder="Search stakeholder personas..."
            style={{ width: "100%" }}
            onChange={(event) => {
              setSearchPersonasFilter(
                possiblePersonas.filter((persona) =>
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
              {possiblePersonas &&
                possiblePersonas
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
                          onChange={(event) => {
                            const checkbox = event.target;
                            if (checkbox.checked) {
                              personaSelectedCallback(persona);
                            }
                          }}
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
    </div>
  );
};

export default AddPersonaPane;
