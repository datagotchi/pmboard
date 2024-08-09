import { Company } from "../types";
import useEvidenceAPI from "./useEvidenceAPI";

/**
 * A hook to modify product companies for market research.
 * @param {number} productId The ID of the current product.
 * @returns {object} A collection of API functions.
 * @example
 * const { addCompany, updateCompany, deleteCompany } = useCompaniesAPI(productId);
 */
const useCompaniesAPI = (productId) => {
  /**
   * Add a company to the server
   * @param {Company} company The company object to add.
   * @returns {Promise<Response>} The POST fetch promise.
   */
  const addCompany = (company) =>
    fetch(`/products/${productId}/companies`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // TODO: credentials
      body: JSON.stringify(company),
    });

  /**
   * Update a company object on the server.
   * @param {Company} company The persona object with fields to replace the existing one with.
   * @param {number} companyIndex The index of the persona.
   * @returns {Promise<Response>} The PUT fetch promise.
   */
  const updateCompany = (company, companyIndex) =>
    fetch(`/products/${productId}/companies/${companyIndex}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // TODO: credentials
      body: JSON.stringify(company),
    });

  const deleteCompany = (companyIndex) =>
    fetch(`/products/${productId}/companies/${companyIndex}`, {
      method: "DELETE",
      // TODO: credentials
    });

  const { addEvidenceFile, updateTrend } = useEvidenceAPI(
    productId,
    "companies"
  );

  return {
    addCompany,
    updateCompany,
    deleteCompany,
    addEvidenceFile,
    updateTrend,
  };
};

export default useCompaniesAPI;
