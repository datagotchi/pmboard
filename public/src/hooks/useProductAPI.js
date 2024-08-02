const useProductAPI = () => {
  /**
   * @returns {Promise<Product[]>} all products from the server
   */
  const getProducts = () =>
    fetch("/products").then((response) => response.json());

  const deleteProduct = (productId) =>
    fetch(`/products/${productId}`, { method: "DELETE" });

  /**
   */
  const createProduct = () => {};

  return {
    getProducts,
    createProduct,
    deleteProduct,
  };
};

export default useProductAPI;
