import { useState } from "react";
import Persona from "../types/Persona";

/**
 * A hook to download product personas
 *
 * @hook
 * @param productId {number} the ID of the current product.
 * @returns {Persona[] | undefined} An array of personas.
 * @example
 * const personas = usePersonas();
 */
const usePersonas = (productId) => {
  /**
   * @type {[Persona[] | undefined, React.Dispatch<Persona>]}
   */
  const [personas, setPersonas] = useState();

  useEffect(() => {
    fetch(`/products/${productId}/personas`)
      .then((response) => response.json())
      .then((value) => setPersonas(value));
  }, [productId]);

  return personas;
};

export default usePersonas;
