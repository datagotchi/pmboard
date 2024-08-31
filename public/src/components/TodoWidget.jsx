import React from "react";

import Widget from "./Widget";

/**
 * A widget to document and visualize to-do items.
 * @param {object} props The component properties.
 * @param {number | undefined} props.productId the ID of the current product.
 * @returns {React.JSX.Element} The rendered widget.
 * @example
 *  <TodoWidget productId={*} />
 */
const TodoWidget = ({ productId }) => {
  const TODO_MODAL_ID = "todoModal";

  // TODO: add pane context providers once I get to using the modal for tasks
  return (
    <Widget
      productId={productId}
      collectionName="tasks"
      type="Task"
      evidenceColumnLabel="User Stories"
      title="What are your TODO items?"
      mainModalId={TODO_MODAL_ID}
      summaryTitle="Activity"
    />
  );
};

export default TodoWidget;
