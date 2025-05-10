/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";

import useCollectionItems from "../useCollectionItems";

global.fetch = jest.fn();

describe("useCollectionItems", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and return collection items", async () => {
    const mockData = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
    ];
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useCollectionItems(123, "testCollection")
    );

    expect(result.current).toBeUndefined();

    await waitForNextUpdate();

    expect(fetch).toHaveBeenCalledWith("/products/123/testCollection");
    expect(result.current).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Fetch error"));

    const { result, waitForNextUpdate } = renderHook(() =>
      useCollectionItems(123, "testCollection")
    );

    expect(result.current).toBeUndefined();

    expect(fetch).toHaveBeenCalledWith("/products/123/testCollection");
    expect(result.current).toBeUndefined();
  });

  it("should refetch when productId changes", async () => {
    const mockData1 = [{ id: 1, name: "Item 1" }];
    const mockData2 = [{ id: 2, name: "Item 2" }];

    fetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockData1),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockData2),
      });

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ productId, collectionName }) =>
        useCollectionItems(productId, collectionName),
      {
        initialProps: { productId: 123, collectionName: "testCollection" },
      }
    );

    expect(result.current).toEqual(mockData1);

    rerender({ productId: 456, collectionName: "testCollection" });

    expect(fetch).toHaveBeenCalledWith("/products/456/testCollection");
    expect(result.current).toEqual(mockData2);
  });
});
