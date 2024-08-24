import { EvidenceAPIProps, WidgetDataItem } from "../types";

/**
 * A React hook to access API calls related to widget item evidence.
 * @type {EvidenceAPIProps}
 * @example const { updateEvidence } = useEvidenceAPI(productId, collectionName);
 */
const useEvidenceAPI = (productId, collectionName) => {
  /**
   * A function to update all evidence of a widget item.
   * @param {number} itemId The ID of the item to update.
   * @param {WidgetDataItem[]} evidence The entire evidence array to send to the server.
   * @returns {Promise<Response>} The fetch promise.
   * @example <Component onClick={() => updateEvidence(...)} />
   */
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

  /**
   * Delete a trend by its ID.
   * @param {number} itemId The ID of the item containing evidence containing the trend.
   * @param {number} evidenceId The ID of the evidence containing the trend.
   * @param {number} trendId The ID of the trend being deleted.
   * @returns {Promise<Response>} The fetch promise.
   * @example <Component onClick={() => deleteTrend(..)} />
   */
  const deleteTrend = (itemId, evidenceId, trendId) =>
    fetch(
      `/products/${productId}/${collectionName}/${itemId}/evidence/${evidenceId}/trends/${trendId}`,
      {
        method: "DELETE",
      }
    );

  return {
    updateEvidence,
    // updateTrends,
    deleteTrend,
  };
};

export default useEvidenceAPI;
