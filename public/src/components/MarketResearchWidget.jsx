import React from "react";

import Widget from "./Widget";
import FileEvidencePane from "./panes/FileEvidencePane";
import { EvidencePaneContext } from "../contexts/EvidencePaneContext";

/**
 * A widget to document and visualize companies in related markets.
 * @param {object} props The component properties.
 * @param {number | undefined} props.productId the ID of the current product.
 * @returns {React.JSX.Element} The rendered widget.
 * @example
 *  <MarketResearchWidget productId={*} />
 */
const MarketResearchWidget = ({ productId }) => {
  const COMPANY_MODAL_ID = "companyModal";

  return (
    <EvidencePaneContext.Provider value={FileEvidencePane}>
      <Widget
        productId={productId}
        collectionName="companies"
        type="Company"
        evidenceColumnLabel="Claims"
        title="What are the competing companies?"
        mainModalId={COMPANY_MODAL_ID}
        summaryTitle="Market Map"
      />
    </EvidencePaneContext.Provider>
  );
};

export default MarketResearchWidget;
