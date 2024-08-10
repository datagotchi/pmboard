import { Story } from "../types";
import useEvidenceAPI from "./useEvidenceAPI";

/**
 * A hook to modify product user stories
 * @param {number} productId The ID of the current product.
 * @returns {object} A collection of API functions.
 * @example
 * const { addStory, updateStory, deleteStory } = useStoriesAPI(productId);
 */
const useStoriesAPI = (productId) => {
  /**
   * Add a story to the server
   * @param {Story} story The story object to add.
   * @returns {Promise<Response>} The POST fetch promise.
   */
  const addStory = (story) =>
    fetch(`/products/${productId}/stories`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // TODO: credentials
      body: JSON.stringify(story),
    });

  /**
   * Update a story object on the server.
   * @param {Story} story The story object with fields to replace the existing one with.
   * @param {number} storyIndex The index of the story.
   * @returns {Promise<Response>} The PUT fetch promise.
   */
  const updateStory = (story, storyIndex) =>
    fetch(`/products/${productId}/stories/${storyIndex}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // TODO: credentials
      body: JSON.stringify(story),
    });

  /**
   * Delete a story from the server via index
   * @param {number} storyIndex The index of the story in its collection.
   * @returns {Promise<Response>} The DELETE fetch request promise.
   */
  const deleteStory = (storyIndex) =>
    fetch(`/products/${productId}/stories/${storyIndex}`, {
      method: "DELETE",
      // TODO: credentials
    });

  const { addEvidenceFile, updateTrend } = useEvidenceAPI(productId, "stories");

  return {
    addStory,
    updateStory,
    deleteStory,
    addEvidenceFile,
    updateTrend,
  };
};

export default useStoriesAPI;
