import { CollectionAPI } from "../types";
import useEvidenceAPI from "./useEvidenceAPI";

/**
 * A high-level hook to modify product collection items
 * @param {number} productId The ID of the current product.
 * @param {string} collectionName The name of the collection for API calls.
 * @returns {CollectionAPI} A collection of API functions.
 * @example
 * const { addItem, updateItem, deleteItem } = useCollectionAPI({productId, collectionName});
 */
const useCollectionAPI = (productId, collectionName) => {
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

  const deleteItem = (id) =>
    fetch(`/products/${productId}/${collectionName}/${id}`, {
      method: "DELETE",
      // TODO: credentials
    });

  const { updateEvidence } = useEvidenceAPI(productId, collectionName);

  return {
    addItem,
    updateItem,
    deleteItem,
    updateEvidence,
  };
};

export default useCollectionAPI;
