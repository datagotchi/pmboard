import { EvidenceAPI } from "../types";

/**
 * @type {EvidenceAPI}
 */
const useEvidenceAPI = (productId, collectionName) => {
  const updateEvidence = (itemId, evidence) => {
    evidence.updated_date = new Date();
    return fetch(
      `/products/${productId}/${collectionName}/${itemId}/evidence`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evidence),
      }
    );
  };

  // const updateTrends = (itemIndex, evidenceIndex, trends) =>
  //   fetch(
  //     `/products/${productId}/${collectionName}/${itemIndex}/evidence/${evidenceIndex}/trends`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(trends),
  //     }
  //   );

  return {
    updateEvidence,
    // updateTrends,
  };
};

export default useEvidenceAPI;
