import React, { useEffect, useState } from "react";

import { Story } from "../types";

/**
 * A hook to download product user stories
 * @param {number} productId The ID of the current product.
 * @returns {Company[] | undefined} An array of stories.
 * @example
 * const companies = useStories(productId);
 */
const useStories = (productId) => {
  /**
   * @type {[Story[] | undefined, React.Dispatch<Story[]>]}
   */
  const [stories, setStories] = useState();

  useEffect(() => {
    fetch(`/products/${productId}/stories`)
      .then((response) => response.json())
      .then((value) => setStories(value));
  }, [productId]);

  return stories;
};

export default useStories;
