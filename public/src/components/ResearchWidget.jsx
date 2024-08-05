import React from "react";
import Widget from "./Widget";
import usePersonas from "../hooks/usePersonas";
import usePersonasAPI from "../hooks/usePersonasAPI";
import useProductAPI from "../hooks/useProductAPI";

/**
 * A widget to document and visualize user/customer problems
 *
 * @param {object} props
 * @param {number | undefined} props.productId the ID of the current product.
 * @returns {JSX.Element} The rendered widget.
 * @example
 *  <ResearchWidget productId={*} />
 */
const ResearchWidget = ({ productId }) => {
  const personas = usePersonas(productId);
  const { addPersona, updatePersona, deletePersona, updateTrend } =
    usePersonasAPI(productId);
  const { updateProductCollection } = useProductAPI();

  const PERSONA_MODAL_ID = "personaModal";

  return (
    <Widget
      data={personas}
      type="Persona"
      title="Who are your users/customers?"
      addItemFunc={addPersona}
      updateItemFunc={updatePersona}
      deleteItemFunc={deletePersona}
      itemModalId={PERSONA_MODAL_ID}
      updateCollectionFunc={(collection) =>
        updateProductCollection(productId, "personas", collection)
      }
      updateTrendFunc={updateTrend}
    />
  );
};

export default ResearchWidget;
