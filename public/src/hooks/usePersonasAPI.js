import { Persona } from "../types";
import useEvidenceAPI from "./useEvidenceAPI";

/**
 * A hook to modify product personas for stakeholder research.
 * @param {number} productId The ID of the current product.
 * @returns {object} A collection of API functions.
 * @example
 * const { addPersona, updatePersona, deletePersona } = usePersonasAPI(productId);
 */
const usePersonasAPI = (productId) => {
  /**
   * Add a persona to the server
   * @param {Persona} persona The persona object to add.
   * @returns {Promise<Response>} The POST fetch promise.
   */
  const addPersona = (persona) =>
    fetch(`/products/${productId}/personas`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // TODO: credentials
      body: JSON.stringify(persona),
    });

  /**
   * Update a persona object on the server.
   * @param {Persona} persona The persona object with fields to replace the existing one with.
   * @param {number} personaIndex The index of the persona.
   * @returns {Promise<Response>} The PUT fetch promise.
   */
  const updatePersona = (persona, personaIndex) =>
    fetch(`/products/${productId}/personas/${personaIndex}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(persona),
    });

  /**
   * Delete a persona from the server via ID
   * @param {number} personaIndex The index of the persona in its collection.
   * @returns {Promise<Response>} The DELETE fetch request promise.
   */
  const deletePersona = (personaIndex) =>
    fetch(`/products/${productId}/personas/${personaIndex}`, {
      method: "DELETE",
      // TODO: credentials/headers
    });

  const { addEvidenceFile, updateTrend } = useEvidenceAPI(
    productId,
    "personas"
  );

  return {
    addPersona,
    updatePersona,
    deletePersona,
    addEvidenceFile,
    updateTrend,
  };
};

export default usePersonasAPI;
