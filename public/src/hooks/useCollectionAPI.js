import { CollectionAPI, WidgetDataItem } from "../types";
import useEvidenceAPI from "./useEvidenceAPI";

/**
 * A high-level hook to modify product collection items.
 * @param {number} productId The ID of the current product.
 * @param {string} collectionName The name of the collection for API calls.
 * @returns {CollectionAPI} A collection of API functions.
 * @example
 * const { addItem, updateItem, deleteItem } = useCollectionAPI({productId, collectionName});
 */
const useCollectionAPI = (productId, collectionName) => {
  /**
   * Add an item to the {collectionName} of {productId}.
   * @param {WidgetDataItem} item The item to add to a widget.
   * @returns {Promise<Response> | void} The fetch promise if the item is specified.
   * @example <Component onClick={() => addItem(...)} />
   */
  const addItem = (item) => {
    if (item) {
      return fetch(`/products/${productId}/${collectionName}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // TODO: credentials
        body: JSON.stringify(item),
      });
    } else {
      throw new Error("Item is undefined");
    }
  };

  /**
   * Update the attributes of an item in a collection specified by {collectionName} for {productId}.
   * @param {WidgetDataItem} item The item to update with new properties.
   * @returns {Promise<Response>} The fetch promise.
   * @example <Component onClick={() => updateItem(...)} />
   */
  const updateItem = (item) =>
    fetch(`/products/${productId}/${collectionName}/${item.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // TODO: credentials
      body: JSON.stringify(item),
    });

  /**
   * Delete an item in {collectionName} for {productId}.
   * @param {number} id The ID of the item to delete.
   * @returns {Promise<Response>} The fetch promise.
   * @example <Component onClick={() => deleteItem(...)} />
   */
  const deleteItem = (id) =>
    fetch(`/products/${productId}/${collectionName}/${id}`, {
      method: "DELETE",
      // TODO: credentials
    });

  const {
    updateEvidence,
    addEvidenceRecord,
    removeEvidenceRecord,
    deleteTrend,
    addTrend,
    updateTrend,
  } = useEvidenceAPI(productId, collectionName);

  return {
    addItem,
    updateItem,
    deleteItem,
    updateEvidence,
    addEvidenceRecord,
    removeEvidenceRecord,
    deleteTrend,
    addTrend,
    updateTrend,
  };
};

export default useCollectionAPI;
