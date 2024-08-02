import { Persona } from "../types";

/**
 * A hook to modify product personas
 *
 * @param productId {number} the ID of the current product.
 * @example
 * const { addPersona, updatePersona, deletePersona } = usePersonasAPI();
 */
const usePersonasAPI = (productId) => {
  /**
   * Add a persona to the server
   *
   * @param {Persona} persona
   */
  const addPersona = (persona) => {
    fetch(`/products/${productId}/personas`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // TODO: credentials
      body: JSON.stringify(persona),
    });
  };

  const updatePersona = (persona, index) => {
    fetch(`/products/${productId}/personas/${index}`, {
      method: "PUT",
      // TODO: credentials/headers
      body: persona,
    });
  };

  /**
   * Delete a persona from the server via ID
   *
   * @param {number} personaIndex
   */
  const deletePersona = (personaIndex) => {
    fetch(`/products/${productId}/personas/${personaIndex}`, {
      method: "DELETE",
      // TODO: credentials/headers
    });
  };

  return {
    addPersona,
    updatePersona,
    deletePersona,
    // addEvidenceToPersona,
  };
};

export default usePersonasAPI;
