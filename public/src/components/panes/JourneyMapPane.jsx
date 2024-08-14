import React, { useContext } from "react";

import EmpathyMapPane from "./EmpathyMapPane";
import { AllTagsContext } from "../../contexts/AllTagsContext";

const JourneMapPane = () => {
  // FIXME: verify these are the correct `allTags`
  const allTagsForThisStory = useContext(AllTagsContext);

  if (allTagsForThisStory) {
    return (
      // {personasAsEvidence.map((pae) => (
      //   <AllTagsContext.Provider value={*}>
      //   {/* Tags to cite in the journeys */}
      //   <EmpathyMapPane
      //     handleTagClick={(tagIndex, reactTags) => {
      //       // TODO: tags can be dragged from up here down to the journey area below
      //     }}
      //   />
      //   {/* TODO: the actual journeys */}
      //   <div></div>
      //   </AllTagsContext.Provider>
      // ))}
      <div></div>
    );
  }
};

export default JourneMapPane;
