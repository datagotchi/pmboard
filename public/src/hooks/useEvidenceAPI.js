import { EvidenceFile } from "../types";

const useEvidenceAPI = ({ productId, collectionName }) => {
  /**
   * Add an evidence file to a persona.
   * @param {number} itemIndex The index of the widget item.
   * @param {EvidenceFile} file The file to add.
   * @returns {Promise<Response>} The POST request promise.
   */
  const addEvidenceFile = (itemIndex, file) =>
    fetch(`/products/${productId}/${collectionName}/${itemIndex}/evidence`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(file),
    });

  const updateTrend = (itemIndex, evidenceIndex, trendIndex, trend) =>
    fetch(
      `/products/${productId}/${collectionName}/${itemIndex}/evidence/${evidenceIndex}/trends/${trendIndex}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trend),
      }
    );

  return {
    addEvidenceFile,
    updateTrend,
  };
};

export default useEvidenceAPI;
