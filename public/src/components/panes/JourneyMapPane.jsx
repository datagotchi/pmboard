import React, { useCallback, useContext, useEffect, useState } from "react";
import { Draggable, Droppable } from "@shopify/draggable";

import { AllTagsContext } from "../../contexts/AllTagsContext";

/**
 * A modal pane to show and enable editing of a user journey from research trends/tags.
 * @param {object} props The React component properties.
 * @param {object} props.data The summary data to show on load.
 * @param {() => void} props.summaryChanged The function to call when the summary is changed (and saved).
 * @returns {React.JSX.Element} The rendered pane.
 * @example <JourneyMapPane data={*} summaryChanged={() => {}} />
 */
const JourneyMapPane = ({ data, summaryChanged }) => {
  const allTagsForThisStory = useContext(AllTagsContext);

  // FIXME: get existing journey if there is one
  // then get the steps from it's ID
  const [summary, setSummary] = useState(data);

  // useEffect(() => {}, []);

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
      let currentDropzone;
      d.on("droppable:dropped", (event) => {
        currentDropzone = event.dropzone;
      });
      d.on("drag:stop", () => {
        if (currentDropzone) {
          currentDropzone.style.minWidth = "";
        }
      });
      setDroppable(d);
    }
  }, [droppable]);

  const [dropzones, setDropzones] = useState([]);
  const [dropzoneNumber, setDropzoneNumber] = useState(1);

  useEffect(() => {
    if (summary && summary.steps && summary.steps.length > dropzones.length) {
      setDropzones(
        summary.steps.map((step) => ({
          dropzone: dropzoneNumber,
          x: step.x,
          y: step.y,
          tag_id: step.tag_id,
          tag_class_name: step.tag_class_name,
          tag_text: step.tag_text,
        }))
      );
      setDropzoneNumber(dropzoneNumber + 1);
    }
  }, [summary, dropzoneNumber]);

  const addFlowChartItem = useCallback(() => {
    setDropzones([
      ...dropzones,
      {
        dropzone: dropzoneNumber,
        className: "dropzone",
        minWidth: "100px",
      },
    ]);
    setDropzoneNumber(dropzoneNumber + 1);
  }, [dropzones]);

  /**
   * @type {[Draggable | undefined, React.Dispatch<Draggable>]}
   */
  const [draggable, setDraggable] = useState();

  /**
   * Update an HTMLElement's left/top absolute position.
   * @param {number} dropzoneNumber The data-dropzone value to add to the HTMLElement.
   * @param {number} dx The x coordinate to modify from its current position.
   * @param {number} dy The y coordinate to modify from its current position.
   * @example updateTagXY(1, 5, 5)
   */
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
          {allTagsForThisStory
            .filter(
              (tag) =>
                !summary ||
                !summary.steps.map((step) => step.tag_id).includes(tag.id)
            )
            .map((tag) => (
              <div
                className={`tag trendItem ${tag.className}`}
                key={`tag named ${tag.id}`}
                data-tag={JSON.stringify(tag)}
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
          <button
            onClick={() => {
              const dropzones = Array.from(
                document.querySelectorAll("[data-dropzone]")
              ).sort(
                (a, b) =>
                  Number(b.dataset.dropzone) - Number(a.dataset.dropzone)
              );
              const steps = dropzones.map((dropzoneDiv) => {
                const tag = JSON.parse(
                  dropzoneDiv.childNodes.item(0).dataset.tag
                );
                return {
                  tagId: tag.id,
                  tagClassName: tag.className,
                  tagText: tag.text,
                  x: dropzoneDiv.style.left,
                  y: dropzoneDiv.style.top,
                };
              });
              const summary = {
                steps,
                // connections
              };
              setSummary(summary);
              summaryChanged(summary);
            }}
            style={{ float: "right" }}
          >
            Save
          </button>
          {dropzones.map((zone, i) => (
            <div
              key={`dropzone #${i}`}
              className={`dropzone ${
                zone.x && zone.y ? "draggable-dropzone--occupied" : ""
              }`}
              data-dropzone={zone.dropzone}
              style={{
                minheight: "30px",
                maxWidth: "200px",
                minWidth: zone.minWidth,
                position: "absolute",
                left: zone.x,
                top: zone.y,
              }}
            >
              {zone.x && zone.y && (
                <div
                  className={`tag trendItem ${zone.tag_class_name}`}
                  data-tag={JSON.stringify({
                    id: zone.tag_id,
                    text: zone.tag_text,
                  })}
                >
                  {zone.tag_text}
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  }
  return <></>;
};

export default JourneyMapPane;
