import { Persona } from "../types";

/**
 * A hook to modify product personas
 *
 * @param productId {number} the ID of the current product.
 * @example
 * const { addPersona, updatePersona, deletePersona } = useModifyPersonas();
 */
const useModifyPersonas = (productId) => {
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
