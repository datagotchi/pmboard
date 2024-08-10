import React, { useCallback, useEffect, useState } from "react";
import { Sortable, Plugins } from "@shopify/draggable";

import { WidgetDataItem } from "../types";
import Modal from "./Modal";
import WidgetItemRow from "./WidgetItemRow";
import useCollectionAPI from "../hooks/useCollectionAPI";
import useCollectionItems from "../hooks/useCollectionItems";
import useProductAPI from "../hooks/useProductAPI";

/**
 * The HTML component for all PMBoard widgets to document and visualize information
 * @param {object} props The component props
 * @param {string} props.productId The ID of the current product.
 * @param {string} props.collectionName The name of the product collection.
 * @param {string} props.type The type of the data rows.
 * @param {string} props.evidenceType The type-name for the evidence.
 * @param {string} props.title The title to show at the top of the widget.
 * @param {string} props.itemModalId The ID of the item modal passed in `children`.
 * @param {string} props.summaryTitle The title of the summary tab on the modal.
 * @returns {React.JSX.Element} The rendered widget.
 * @example
 * <Widget productId="" collectionName="" type="" title="" itemModalId="" />
 */
const Widget = ({
  productId,
  collectionName,
  type,
  evidenceType,
  title,
  itemModalId,
  summaryTitle,
}) => {
  const data = useCollectionItems(productId, collectionName);

  const { updateProductCollection } = useProductAPI();

  /**
   * @type {[WidgetDataItem[] | undefined, React.Dispatch<any[]>]}
   */
  const [liveData, setLiveData] = useState();

  const CREATE_DIALOG_ID = `createDialog: ${itemModalId}`;
  const NEW_NAME_FIELD_ID = `newName: ${itemModalId}`;
  const LIST_ID = `itemsTbody_${type}`;

  const [sortable, setSortable] = useState();

  const { addItem, updateItem, deleteItem, addEvidenceFile, updateTrend } =
    useCollectionAPI(productId, collectionName);

  useEffect(() => {
    if (data) {
      setLiveData(data);
    }
  }, [data]);

  /**
   * @type {[WidgetDataItem | undefined, React.Dispatch<WidgetDataItem>]}
   */
  const [currentItem, setCurrentItem] = useState();

  const [currentItemIndex, setCurrentItemIndex] = useState();

  /**
   * @type {[HTMLDialogElement | undefined, React.Dispatch<HTMLDialogElement | undefined>]}
   */
  const [itemModal, setItemModal] = useState();

  /**
   * @type {[HTMLDialogElement | undefined, React.Dispatch<HTMLDialogElement | undefined>]}
   */
  const [createDialog, setCreateDialog] = useState();

  const showCreateDialog = () => {
    /**
     * @type {HTMLDialogElement}
     */
    const createDialog = document.getElementById(CREATE_DIALOG_ID);
    setCreateDialog(createDialog);
    // TODO: only add once
    createDialog.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        createDialog.close();
      }
    });
    createDialog.showModal();
  };

  useEffect(() => {
    if (currentItem) {
      if (itemModal) {
        // TODO: track if these have been added/removed so they don't get added multiple times
        itemModal.addEventListener("click", (event) => {
          if (event.target === event.currentTarget) {
            itemModal.close();
          }
        });
        itemModal.addEventListener("close", () => {
          setItemModal(undefined);
          setCurrentItem(undefined);
          setCurrentItemIndex(undefined);
        });
        itemModal.showModal();
      } else {
        /**
         * @type {HTMLDialogElement}
         */
        const modal = document.getElementById(itemModalId);
        setItemModal(modal);
      }
    }
  }, [currentItem, itemModal]);

  const [draggableContainer, setDraggableContainer] = useState();

  useEffect(() => {
    if (document.getElementById(LIST_ID) && !draggableContainer) {
      setDraggableContainer(document.getElementById(LIST_ID));
    }
  });

  useEffect(() => {
    if (draggableContainer && !sortable) {
      setSortable(
        new Sortable(draggableContainer, {
          draggable: "tr",
          handle: ".dragHandle",
          mirror: {
            appendTo: `#${LIST_ID}`,
            constrainDimensions: true,
          },
          collidables: "tr",
          distance: 0,
          plugins: [Plugins.SortAnimation],
          swapAnimation: {
            duration: 200,
            easingFunction: "ease-in-out",
          },
        })
      );
    }
  }, [draggableContainer, sortable]);

  let currentDragIndex = -1;
  useEffect(() => {
    if (sortable && liveData) {
      sortable.on("drag:start", (event) => {
        const trElements = Array.from(draggableContainer.childNodes);
        currentDragIndex = trElements.indexOf(event.source);
      });
      sortable.on("drag:stop", (event) => {
        const trElements = Array.from(draggableContainer.childNodes).filter(
          (tr) =>
            !tr.className.includes("draggable-mirror") &&
            !tr.className.includes("draggable--original")
        );
        const newIndex = trElements.indexOf(event.source);
        if (newIndex !== currentDragIndex) {
          const newData = [...liveData];
          [newData[newIndex], newData[currentDragIndex]] = [
            newData[currentDragIndex],
            newData[newIndex],
          ];
          updateProductCollection(productId, collectionName, newData).then(
            () => {
              // TODO: refreshing the page works, but I'd prefer not to
              // setLiveData((prevLiveData) => [...newData]); // resets the live data, but renders it the old way (!)
              window.location.reload();
            }
          );
        }
        // done: cleanup
        currentDragIndex = -1;
      });
    }
  }, [sortable, liveData]);

  // TODO: (above TODO) vs: this uses old `liveData` after drag reordering
  const deleteItemCallback = useCallback(
    (item) => {
      const itemIndex = liveData.indexOf(item);
      liveData.splice(itemIndex, 1);
      setLiveData([...liveData]);
      deleteItem(itemIndex);
    },
    [liveData]
  );

  const widgetOnClickCallback = useCallback(
    (item) => {
      setCurrentItem(item);
      const index = liveData.indexOf(item);
      setCurrentItemIndex(index);
    },
    [liveData]
  );

  return (
    <>
      <div
        className="panel panel-default widget"
        style={{ position: "relative", border: "1px black dashed" }}
      >
        <hr
          style={{
            display: "none",
            position: "relative",
            left: "35px",
            border: "2px solid black",
            zIndex: 1000,
            width: "1000px",
            margin: 0,
          }}
        />
        <div className="panel-heading">
          <h3 className="panel-title">{title}</h3>
        </div>
        <div className="panel-body">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "20px" }}></th>
                <th>{type}</th>
                <th>{evidenceType}</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody id={LIST_ID}>
              {liveData &&
                liveData.map((item, index) => (
                  <WidgetItemRow
                    item={item}
                    key={`WidgetItemRow #${index}`}
                    onDeleteCallback={deleteItemCallback}
                    onClickCallback={widgetOnClickCallback}
                  />
                ))}
            </tbody>
          </table>
        </div>
        <div className="panel-footer">
          <button onClick={showCreateDialog}>
            <span className="bi bi-person-plus" aria-hidden="true"></span> Add
          </button>
        </div>
        <dialog id={CREATE_DIALOG_ID}>
          <form name="createItemForm">
            <p>
              New name: <input type="text" id={NEW_NAME_FIELD_ID} />
            </p>
            <p>
              <button
                type="submit"
                onClick={async () => {
                  const newNameField =
                    document.getElementById(NEW_NAME_FIELD_ID);
                  const newName = newNameField.value;
                  const newItem = { name: newName, evidence: [] };
                  setLiveData([...liveData, newItem]);
                  await addItem(newItem);
                  createDialog.close();
                  setCreateDialog(undefined);
                  newNameField.value = "";
                }}
              >
                Create
              </button>
            </p>
          </form>
        </dialog>
      </div>
      {currentItem && (
        <Modal
          dialogId={itemModalId}
          item={currentItem}
          deleteItemFunc={deleteItemCallback}
          updateItemFunc={(item) => updateItem(item, currentItemIndex)}
          updateTrendFunc={(trendIndex, trend) => {
            currentItem.evidence.forEach((file, fileIndex) => {
              const trendIndex = file.trends
                .map((trend) => trend.name)
                .indexOf(trend.name);
              if (trendIndex > -1) {
                updateTrend(currentItemIndex, fileIndex, trendIndex, trend);
              }
            });
          }}
          summaryTitle={summaryTitle}
          addItemEvidenceFunc={(file) =>
            addEvidenceFile(currentItemIndex, file)
          }
        />
      )}
    </>
  );
};

export default Widget;
