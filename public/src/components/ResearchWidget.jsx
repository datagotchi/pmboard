import React, { useState } from "react";
import Widget from "./Widget";
import usePersonas from "../hooks/usePersonas";
import useModifyPersonas from "../hooks/useModifyPersonas";

/**
 * A widget to document and visualize user/customer problems
 *
 * @component
 * @param productId {number | undefined} the ID of the current product.
 * @returns {JSX.Element} The rendered widget.
 * @example
 *  <ResearchWidget productId={*} />
 */
const ResearchWidget = ({ productId }) => {
  const personas = usePersonas(productId);
  const { addPersona, updatePersona, deletePersona } =
    useModifyPersonas(productId);
  const [selectedPersona, setSelectedPersona] = useState();

  const PERSONA_MODAL_ID = "personaModal";

  return (
    <Widget
      data={personas}
      type="Persona"
      title="Who are your users/customers?"
      addFunc={addPersona}
      deleteFunc={deletePersona}
      itemModalId={PERSONA_MODAL_ID}
    />
  );
};

export default ResearchWidget;
