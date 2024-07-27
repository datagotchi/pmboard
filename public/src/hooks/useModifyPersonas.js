import Persona from "./types/Persona";

/**
 * A hook to modify product personas
 *
 * @hook
 * @param productId {number} the ID of the current product.
 * @returns {Object} An object of functions.
 * @example
 * const { addPersona, deletePersona } = useModifyPersonas();
 */
const useModifyPersonas = (productId) => {
  /**
   * Add a persona to the server
   *
   * @param {Persona} persona
   */
  const addPersona = (persona) => {
    fetch({
      method: "POST",
      // TODO: credentials/headers
      url: `/products/${productId}/personas`,
      body: persona,
    });
  };

  const updatePersona = (persona) => {
    fetch({
      method: "PUT",
      // TODO: credentials/headers
      url: `/products/${productId}/personas/${persona.id}`,
      body: persona,
    });
  };

  /**
   * Delete a persona from the server via ID
   *
   * @param {number} personaId
   */
  const deletePersona = (personaId) => {
    fetch({
      method: "DELETE",
      // TODO: credentials/headers
      url: `/products/${productId}/personas/${personaId}`,
    });
  };

  return {
    addPersona,
    updatePersona,
    deletePersona,
  };
};

export default useModifyPersonas;
