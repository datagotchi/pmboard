const useProductAPI = () => {
  /**
   * @returns {Promise<Product[]>} all products from the server
   */
  const getProducts = async () =>
    fetch("/products").then((response) => response.json());

  /**
   */
  const createProduct = () => {};

  return {
    getProducts,
    createProduct,
  };
};

export default useProductAPI;
