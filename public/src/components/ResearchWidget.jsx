import React, { useCallback, useEffect, useState } from "react";
import usePersonas from "../hooks/usePersonas";
import useModifyPersonas from "../hooks/useModifyPersonas";

/**
 * A widget to document and visualize user/customer problems
 *
 * @component
 * @param productId {number | undefined} the ID of the current product.
 * @returns {JSX.Element} The rendered widget.
 * @example
 * <ResearchWidget productId={5} />
 */
const ResearchWidget = (productId) => {
  const personas = usePersonas();
  const { addPersona, updatePersona, deletePersona } = useModifyPersonas();
  const [selectedPersona, setSelectedPersona] = useState();

  return (
    <Widget data={personas} title="Who are your users/customers?">
      <Modal />
    </Widget>
  );
};

export default ResearchWidget;
