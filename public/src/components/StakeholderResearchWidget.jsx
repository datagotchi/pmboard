import React from "react";

import Widget from "./Widget";
import FileEvidencePane from "./FileEvidencePane";

/**
 * A widget to document and visualize stakeholder problems
 * @param {object} props The component properties.
 * @param {number | undefined} props.productId the ID of the current product.
 * @returns {React.JSX.Element} The rendered widget.
 * @example
 *  <StakeholderResearchWidget productId={*} />
 */
const StakeholderResearchWidget = ({ productId }) => {
  const PERSONA_MODAL_ID = "personaModal";

  return (
    <Widget
      productId={productId}
      collectionName="personas"
      type="Persona"
      evidenceColumnLabel="Research"
      title="Who are the stakeholders?"
      mainModalId={PERSONA_MODAL_ID}
      summaryTitle="Empathy Map"
      evidencePane={FileEvidencePane}
    />
  );
};

export default StakeholderResearchWidget;
