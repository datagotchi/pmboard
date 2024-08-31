import { Product, ProductAPIFunctions, WidgetDataItem } from "../types";

/**
 * A React hook to expose API functions related to products.
 * @returns {ProductAPIFunctions} The product API functions.
 * @example const {getProducts,
    createProduct,
    deleteProduct,
    updateProductCollection} = useProductAPI();
 */
const useProductAPI = () => {
  /**
   * Get all products from the server.
   * @returns {Promise<Product[]>} all products from the server
   * @example const products = getProducts()
   */
  const getProducts = () =>
    fetch("/products").then((response) => response.json());

  /**
   * Delete a product from the server.
   * @param {number} productId The numeric ID of the product to delete.
   * @returns {Promise<Response>} The fetch promise.
   * @example <Component onClick={() => deleteProduct(...)} />
   */
  const deleteProduct = (productId) =>
    fetch(`/products/${productId}`, { method: "DELETE" });

  /**
   * Create a new product on the server.
   * @param {object} bodyObject The properties of the new product, especially name.
   * @returns {Promise<Response>} The fetch promise.
   * @example const newProduct = await createProduct({ name });
   */
  const createProduct = (bodyObject) =>
    fetch("/products", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObject),
    }).then((response) => response.json());

  /**
   * Update an entire collection (personas, stories, companies, tasks, etc).
   * @param {number} productId The numeric ID of the product to update the collection on.
   * @param {string} collectionName The name of the product collection: personas, stories, etc.
   * @param {WidgetDataItem[]} collection The collection to update.
   * @returns {Promise<Response>} The fetch promise.
   * @example updateProductCollection(
            productId,
            collectionName,
            newData)
   */
  const updateProductCollection = (productId, collectionName, collection) =>
    fetch(`/products/${productId}/${collectionName}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collection),
    });

  return {
    getProducts,
    createProduct,
    deleteProduct,
    updateProductCollection,
  };
};

export default useProductAPI;
