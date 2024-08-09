import React from "react";

import Widget from "./Widget";
import useCompanies from "../hooks/useCompanies";

/**
 * A widget to document and visualize companies in related markets
 * @param {object} props The component properties.
 * @param {number | undefined} props.productId the ID of the current product.
 * @returns {React.JSX.Element} The rendered widget.
 * @example
 *  <MarketResearchWidget productId={*} />
 */
const MarketResearchWidget = ({ productId }) => {
  const companies = useCompanies(productId);

  const COMPANY_MODAL_ID = "companyModal";

  return (
    <Widget
      data={companies}
      type="Persona"
      title="Who are the stakeholders?"
      addItemFunc={addPersona}
      updateItemFunc={updatePersona}
      deleteItemFunc={deletePersona}
      itemModalId={COMPANY_MODAL_ID}
      updateCollectionFunc={(collection) =>
        updateProductCollection(productId, "personas", collection)
      }
      updateTrendFunc={updateTrend}
      summaryTitle="Empathy Map"
      addItemEvidenceFunc={addEvidenceFile}
    />
  );
};

export default MarketResearchWidget;
