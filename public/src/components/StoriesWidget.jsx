import React from "react";

import Widget from "./Widget";
import useStories from "../hooks/useStories";
import useStoriesAPI from "../hooks/useStoriesAPI";
import useProductAPI from "../hooks/useProductAPI";

/**
 * A widget to document and visualize user stories.
 * @param {object} props The component properties.
 * @param {number | undefined} props.productId the ID of the current product.
 * @returns {React.JSX.Element} The rendered widget.
 * @example
 *  <StoriesWidget productId={*} />
 */
const StoriesWidget = ({ productId }) => {
  const stories = useStories(productId);
  const { addStory, updateStory, deleteStory, addEvidenceFile, updateTrend } =
    useStoriesAPI(productId);
  const { updateProductCollection } = useProductAPI();

  const STORY_MODAL_ID = "storyModal";

  return (
    <Widget
      data={stories}
      type="Story"
      evidenceType="Subtasks"
      title="What are the planned user stories?"
      addItemFunc={addStory}
      updateItemFunc={updateStory}
      deleteItemFunc={deleteStory}
      itemModalId={STORY_MODAL_ID}
      updateCollectionFunc={(collection) =>
        updateProductCollection(productId, "stories", collection)
      }
      updateTrendFunc={updateTrend}
      summaryTitle="Story Roadmap"
      addItemEvidenceFunc={addEvidenceFile}
    />
  );
};

export default StoriesWidget;
