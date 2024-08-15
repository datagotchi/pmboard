import React, { useCallback, useContext, useEffect, useState } from "react";
import { Draggable, Droppable } from "@shopify/draggable";

import { AllTagsContext } from "../../contexts/AllTagsContext";

const JourneyMapPane = () => {
  const allTagsForThisStory = useContext(AllTagsContext);

  /**
   * @type {[Droppable | undefined, React.Dispatch<Droppable>]}
   */
  const [droppable, setDroppable] = useState();

  useEffect(() => {
    if (!droppable) {
      const tagsToUse = document.getElementById("tagsToUse");
      const d = new Droppable(tagsToUse, {
        draggable: ".tag",
        dropzone: ".dropzone",
        distance: 0,
      });
      setDroppable(d);
    }
  }, [droppable]);

  const [dropzones, setDropzones] = useState([]);

  const [dropzoneNumber, setDropzoneNumber] = useState(1);

  const addFlowChartItem = useCallback(() => {
    setDropzones([
      ...dropzones,
      {
        dropzone: dropzoneNumber,
        className: "dropzone",
      },
    ]);
    setDropzoneNumber(dropzoneNumber + 1);
  }, [dropzones]);

  /**
   * @type {[Draggable | undefined, React.Dispatch<Draggable>]}
   */
  const [draggable, setDraggable] = useState();

  const updateTagXY = (dropzoneNumber, dx, dy) => {
    setTimeout(() => {
      const div = document.querySelector(`[data-dropzone='${dropzoneNumber}'`);
      // const bounds = div.getBoundingClientRect();
      if (div) {
        const left = parseInt(div.style.left || 0);
        const top = parseInt(
          div.style.top || document.getElementById("addButton").offsetHeight
        );
        div.style.left = `${left + dx}px`;
        div.style.top = `${top + dy}px`;
      }
    }, 50);
  };

  useEffect(() => {
    if (!draggable) {
      const flowchartArea = document.getElementById("flowchartArea");
      const d = new Draggable(flowchartArea, {
        draggable: ".draggable-dropzone--occupied",
        distance: 0,
      });
      /**
       * @type {HTMLElement}
       */
      let currentDragItem;
      let absoluteClientX, absoluteClientY;
      let originalOffsetX, originalOffsetY;

      d.on("drag:start", (event) => {
        currentDragItem = event.source;
        originalOffsetX = event.sensorEvent.clientX;
        originalOffsetY = event.sensorEvent.clientY;
      });
      d.on("drag:move", (event) => {
        absoluteClientX = event.sensorEvent.clientX;
        absoluteClientY = event.sensorEvent.clientY;
      });
      d.on("drag:stop", () => {
        updateTagXY(
          currentDragItem.dataset.dropzone,
          absoluteClientX - originalOffsetX,
          absoluteClientY - originalOffsetY
        );
      });
      setDraggable(d);
    }
  }, [draggable]);

  if (allTagsForThisStory) {
    return (
      <>
        <div id="tagsToUse" className="dropzone">
          {allTagsForThisStory.map((tag) => (
            <div
              className={`tag trendItem ${tag.className}`}
              key={`tag named ${tag.id}`}
            >
              {tag.text}
            </div>
          ))}
        </div>
        <div
          id="flowchartArea"
          style={{
            border: "1px black solid",
            width: "90%",
            height: "300px",
            position: "relative",
          }}
        >
          <button
            id="addButton"
            onClick={() => {
              addFlowChartItem(document.createElement("div"));
            }}
          >
            Add Step
          </button>
          {dropzones.map((zone, i) => (
            <div
              key={`dropzone #${i}`}
              className={zone.className}
              data-dropzone={zone.dropzone}
              style={{
                height: "30px",
                minWidth: "200px",
                position: "absolute",
              }}
            >
              {zone.name}
            </div>
          ))}
        </div>
      </>
    );
  }
};

export default JourneyMapPane;
