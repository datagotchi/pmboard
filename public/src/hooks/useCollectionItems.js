import React, { useEffect, useState } from "react";

import { WidgetDataItem } from "../types";

/**
 * A hook to download collection items.
 * @param {number} productId The ID of the current product.
 * @param {string} collectionName The name of the product collection.
 * @returns {WidgetDataItem[] | undefined} An array of items.
 * @example
 * const companies = useCollectionItems(productId);
 */
const useCollectionItems = (productId, collectionName) => {
  /**
   * @type {[WidgetDataItem[] | undefined, React.Dispatch<WidgetDataItem[]>]}
   */
  const [items, setItems] = useState();

  useEffect(() => {
    fetch(`/products/${productId}/${collectionName}`)
      .then((response) => response.json())
      .then((value) => setItems(value));
  }, [productId]);

  return items;
};

export default useCollectionItems;
