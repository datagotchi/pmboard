import React from "react";

import Widget from "./Widget";

/**
 * A widget to document and visualize user stories.
 * @param {object} props The component properties.
 * @param {number | undefined} props.productId the ID of the current product.
 * @returns {React.JSX.Element} The rendered widget.
 * @example
 *  <StoriesWidget productId={*} />
 */
const StoriesWidget = ({ productId }) => {
  const STORY_MODAL_ID = "storyModal";

  return (
    <Widget
      productId={productId}
      collectionName="stories"
      type="Story"
      evidenceColumnLabel="Steps"
      title="What are the planned user stories?"
      itemModalId={STORY_MODAL_ID}
      summaryTitle="Story Roadmap"
    />
  );
};

export default StoriesWidget;
