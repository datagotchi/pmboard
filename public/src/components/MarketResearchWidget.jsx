import React from "react";

import Widget from "./Widget";

/**
 * A widget to document and visualize companies in related markets
 * @param {object} props The component properties.
 * @param {number | undefined} props.productId the ID of the current product.
 * @returns {React.JSX.Element} The rendered widget.
 * @example
 *  <MarketResearchWidget productId={*} />
 */
const MarketResearchWidget = ({ productId }) => {
  const COMPANY_MODAL_ID = "companyModal";

  return (
    <Widget
      productId={productId}
      collectionName="companies"
      type="Company"
      evidenceType="Evidence?"
      title="What are the competing companies?"
      itemModalId={COMPANY_MODAL_ID}
      summaryTitle="Market Map"
    />
  );
};

export default MarketResearchWidget;
