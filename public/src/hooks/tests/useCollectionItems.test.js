/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from "@testing-library/react";

import useCollectionItems from "../useCollectionItems";

describe("useCollectionItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.fetch = jest.fn().mockResolvedValue({});
  });

  it("should fetch and return collection items", async () => {
    const mockData = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
    ];
    window.fetch.mockResolvedValueOnce({
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useCollectionItems(123, "testCollection")
    );

    expect(result.current).toBeUndefined();

    expect(window.fetch).toHaveBeenCalledWith("/products/123/testCollection");
    await waitFor(() => expect(result.current).toEqual(mockData));
  });

  // FIXME: the "Fetch error" bleeds into future tests
  xit("should handle fetch errors gracefully", async () => {
    window.fetch.mockRejectedValueOnce(new Error("Fetch error"));
    renderHook(() => useCollectionItems(123, "testCollection"));

    expect(window.fetch).rejects.toThrow("Fetch error");
  });

  it("should refetch when productId changes", async () => {
    const mockData1 = [{ id: 1, name: "Item 1" }];
    const mockData2 = [{ id: 2, name: "Item 2" }];

    window.fetch.mockResolvedValueOnce({
      json: async () => mockData1,
    });

    const { result, rerender } = renderHook(
      ({ productId, collectionName }) =>
        useCollectionItems(productId, collectionName),
      {
        initialProps: { productId: 123, collectionName: "testCollection" },
      }
    );

    expect(window.fetch).toHaveBeenCalledWith("/products/123/testCollection");
    await waitFor(() => expect(result.current).toEqual(mockData1));

    window.fetch.mockResolvedValueOnce({
      json: async () => mockData2,
    });

    rerender({ productId: 456, collectionName: "testCollection" });

    expect(window.fetch).toHaveBeenCalledWith("/products/456/testCollection");
    await waitFor(() => expect(result.current).toEqual(mockData2));
  });
});
