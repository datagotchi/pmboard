import React, { useEffect, useState } from "react";

import { Company } from "../types";

/**
 * A hook to download product companies
 * @param {number} productId The ID of the current product.
 * @returns {Company[] | undefined} An array of companies.
 * @example
 * const companies = useCompanies(productId);
 */
const useCompanies = (productId) => {
  /**
   * @type {[Company[] | undefined, React.Dispatch<Company[]>]}
   */
  const [companies, setCompanies] = useState();

  useEffect(() => {
    fetch(`/products/${productId}/companies`)
      .then((response) => response.json())
      .then((value) => setCompanies(value));
  }, [productId]);

  return companies;
};

export default useCompanies;
