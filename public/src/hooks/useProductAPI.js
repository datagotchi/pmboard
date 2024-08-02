const useProductAPI = () => {
  /**
   * @returns {Promise<Product[]>} all products from the server
   */
  const getProducts = () =>
    fetch("/products").then((response) => response.json());

  const deleteProduct = (productId) =>
    fetch(`/products/${productId}`, { method: "DELETE" });

  const createProduct = (bodyJson) =>
    fetch("/products", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyJson),
    }).then((response) => response.json());

  return {
    getProducts,
    createProduct,
    deleteProduct,
  };
};

export default useProductAPI;
