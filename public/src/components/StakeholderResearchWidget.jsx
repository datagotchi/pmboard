import React from "react";

import Widget from "./Widget";
import { EvidencePaneContext } from "../contexts/EvidencePaneContext";
import FileEvidencePane from "./panes/FileEvidencePane";

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
    <EvidencePaneContext.Provider value={FileEvidencePane}>
      <Widget
        productId={productId}
        collectionName="personas"
        type="Persona"
        evidenceColumnLabel="Research"
        title="Who are the stakeholders?"
        mainModalId={PERSONA_MODAL_ID}
        summaryTitle="Empathy Map"
      />
    </EvidencePaneContext.Provider>
  );
};

export default StakeholderResearchWidget;
