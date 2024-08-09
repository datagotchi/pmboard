import React from "react";

import Widget from "./Widget";
import useCompanies from "../hooks/useCompanies";
import useCompaniesAPI from "../hooks/useCompaniesAPI";
import useProductAPI from "../hooks/useProductAPI";

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
  const {
    addCompany,
    updateCompany,
    deleteCompany,
    addEvidenceFile,
    updateTrend,
  } = useCompaniesAPI(productId);
  const { updateProductCollection } = useProductAPI();

  const COMPANY_MODAL_ID = "companyModal";

  return (
    <Widget
      data={companies}
      type="Company"
      title="What are the related companies?"
      addItemFunc={addCompany}
      updateItemFunc={updateCompany}
      deleteItemFunc={deleteCompany}
      itemModalId={COMPANY_MODAL_ID}
      updateCollectionFunc={(collection) =>
        updateProductCollection(productId, "companies", collection)
      }
      updateTrendFunc={updateTrend}
      summaryTitle="Market Map"
      addItemEvidenceFunc={addEvidenceFile}
    />
  );
};

export default MarketResearchWidget;
