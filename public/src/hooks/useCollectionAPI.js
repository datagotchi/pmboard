import { WidgetDataItem } from "../types";
import useEvidenceAPI from "./useEvidenceAPI";

/**
 * A high-level hook to modify product collection items
 * @param {number} productId The ID of the current product.
 * @param {string} collectionName The name of the collection for API calls.
 * @returns {object} A collection of API functions.
 * @example
 * const { addItem, updateItem, deleteItem } = useCollectionAPI({productId, collectionName});
 */
const useCollectionAPI = (productId, collectionName) => {
  /**
   * Add an item to the server.
   * @param {WidgetDataItem} item The item object to add.
   * @returns {Promise<Response>} The POST fetch promise.
   */
  const addItem = (item) =>
    fetch(`/products/${productId}/${collectionName}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // TODO: credentials
      body: JSON.stringify(item),
    });

  /**
   * Update an item on the server.
   * @param {WidgetDataItem} item The item object with fields to replace the existing one with.
   * @param {number} index The index of the item.
   * @returns {Promise<Response>} The PUT fetch promise.
   */
  const updateItem = (item, index) =>
    fetch(`/products/${productId}/${collectionName}/${index}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // TODO: credentials
      body: JSON.stringify(item),
    });

  /**
   * Delete an item from the server via index.
   * @param {number} index The index of the item in its collection.
   * @returns {Promise<Response>} The DELETE fetch request promise.
   */
  const deleteItem = (index) =>
    fetch(`/products/${productId}/${collectionName}/${index}`, {
      method: "DELETE",
      // TODO: credentials
    });

  const { addEvidenceFile, updateTrend } = useEvidenceAPI(
    productId,
    collectionName
  );

  return {
    addItem,
    updateItem,
    deleteItem,
    addEvidenceFile,
    updateTrend,
  };
};

export default useCollectionAPI;
