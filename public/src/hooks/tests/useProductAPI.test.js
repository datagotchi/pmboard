import useProductAPI from "../useProductAPI";

describe("useProductAPI", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch all products using getProducts", async () => {
    const mockProducts = [
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" },
    ];
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProducts),
    });

    const { getProducts } = useProductAPI();
    const products = await getProducts();

    expect(global.fetch).toHaveBeenCalledWith("/products");
    expect(products).toEqual(mockProducts);
  });

  it("should delete a product using deleteProduct", async () => {
    const productId = 1;
    global.fetch.mockResolvedValueOnce({ ok: true });

    const { deleteProduct } = useProductAPI();
    const response = await deleteProduct(productId);

    expect(global.fetch).toHaveBeenCalledWith(`/products/${productId}`, {
      method: "DELETE",
    });
    expect(response.ok).toBe(true);
  });

  it("should create a new product using createProduct", async () => {
    const newProduct = { name: "New Product" };
    const createdProduct = { id: 1, ...newProduct };
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(createdProduct),
    });

    const { createProduct } = useProductAPI();
    const response = await createProduct(newProduct);

    expect(global.fetch).toHaveBeenCalledWith("/products", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    expect(response).toEqual(createdProduct);
  });

  it("should update a product collection using updateProductCollection", async () => {
    const productId = 1;
    const collectionName = "personas";
    const collection = [{ id: 1, name: "Persona 1" }];
    global.fetch.mockResolvedValueOnce({ ok: true });

    const { updateProductCollection } = useProductAPI();
    const response = await updateProductCollection(
      productId,
      collectionName,
      collection
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `/products/${productId}/${collectionName}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collection),
      }
    );
    expect(response.ok).toBe(true);
  });
});
