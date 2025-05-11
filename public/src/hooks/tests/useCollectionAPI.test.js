import useCollectionAPI from "../useCollectionAPI";

describe("useCollectionAPI", () => {
  const productId = 1;
  const collectionName = "widgets";
  const mockFetch = jest.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockClear();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it("should call fetch with correct parameters when addItem is called", async () => {
    const { addItem } = useCollectionAPI(productId, collectionName);
    const item = { name: "Test Widget" };

    mockFetch.mockResolvedValueOnce({ ok: true });

    await addItem(item);

    expect(mockFetch).toHaveBeenCalledWith(
      `/products/${productId}/${collectionName}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }
    );
  });

  it("should throw an error if addItem is called without an item", () => {
    const { addItem } = useCollectionAPI(productId, collectionName);

    expect(() => addItem()).toThrow("Item is undefined");
  });

  it("should call fetch with correct parameters when updateItem is called", async () => {
    const { updateItem } = useCollectionAPI(productId, collectionName);
    const item = { id: 123, name: "Updated Widget" };

    mockFetch.mockResolvedValueOnce({ ok: true });

    await updateItem(item);

    expect(mockFetch).toHaveBeenCalledWith(
      `/products/${productId}/${collectionName}/${item.id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }
    );
  });

  it("should call fetch with correct parameters when deleteItem is called", async () => {
    const { deleteItem } = useCollectionAPI(productId, collectionName);
    const itemId = 123;

    mockFetch.mockResolvedValueOnce({ ok: true });

    await deleteItem(itemId);

    expect(mockFetch).toHaveBeenCalledWith(
      `/products/${productId}/${collectionName}/${itemId}`,
      {
        method: "DELETE",
      }
    );
  });
});
