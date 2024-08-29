import React, { useCallback, useEffect, useState } from "react";
import { Sortable, Plugins } from "@shopify/draggable";

import { WidgetDataItem } from "../types";

import Modal from "./Modal";
import WidgetItemRow from "./WidgetItemRow";

import useCollectionAPI from "../hooks/useCollectionAPI";
import useCollectionItems from "../hooks/useCollectionItems";
import useProductAPI from "../hooks/useProductAPI";

/**
 * The HTML component for all PMBoard widgets to document and visualize information.
 * @param {object} props The component props
 * @param {string} props.productId The ID of the current product.
 * @param {string} props.collectionName The name of the product collection.
 * @param {string} props.type The type of the data rows.
 * @param {string} props.evidenceColumnLabel The label for the evidence column.
 * @param {string} props.title The title to show at the top of the widget.
 * @param {string} props.mainModalId The ID of the item modal passed in `children`.
 * @param {string} props.summaryTitle The title of the summary tab on the modal.
 * @returns {React.JSX.Element} The rendered widget.
 * @example
 * <Widget productId="" collectionName="" type="" title="" mainModalId="" />
 */
const Widget = ({
  productId,
  collectionName,
  type,
  evidenceColumnLabel,
  title,
  mainModalId,
  summaryTitle,
}) => {
  const data = useCollectionItems(productId, collectionName);
  const {
    addItem,
    updateItem,
    deleteItem,
    updateEvidence,
    deleteTrend,
    addTrend,
    updateTrend,
  } = useCollectionAPI(productId, collectionName);
  const { updateProductCollection } = useProductAPI();

  /**
   * @type {[WidgetDataItem[] | undefined, React.Dispatch<WidgetDataItem[]>]}
   */
  const [liveData, setLiveData] = useState();

  const CREATE_DIALOG_ID = `createDialog: ${mainModalId}`;
  const NEW_NAME_FIELD_ID = `newName: ${mainModalId}`;
  const LIST_ID = `itemsTbody_${type}`;

  /**
   * @type {[Sortable | undefined, React.Dispatch<Sortable>]}
   */
  const [sortable, setSortable] = useState();

  useEffect(() => {
    if (data) {
      setLiveData(data);
    }
  }, [data]);

  /**
   * @type {[WidgetDataItem | undefined, React.Dispatch<WidgetDataItem>]}
   */
  const [currentWidgetItem, setCurrentWidgetItem] = useState();

  /**
   * @type {[HTMLDialogElement | undefined, React.Dispatch<HTMLDialogElement | undefined>]}
   */
  const [itemModal, setItemModal] = useState();

  /**
   * @type {[HTMLDialogElement | undefined, React.Dispatch<HTMLDialogElement | undefined>]}
   */
  const [createDialog, setCreateDialog] = useState();

  /**
   * Show a dialog toward the bottom of the page to create a new widget item by name.
   * @example <Component onClic={() => showCreateDialog()}
   */
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
    if (currentWidgetItem) {
      if (itemModal) {
        // TODO: track if these have been added/removed so they don't get added multiple times
        itemModal.addEventListener("click", (event) => {
          if (event.target === event.currentTarget) {
            itemModal.close();
          }
        });
        itemModal.addEventListener("close", () => {
          setItemModal(undefined);
          setCurrentWidgetItem(undefined);
        });
        itemModal.showModal();
      } else {
        /**
         * @type {HTMLDialogElement}
         */
        const modal = document.getElementById(mainModalId);
        setItemModal(modal);
      }
    }
  }, [currentWidgetItem, itemModal]);

  const [sortableContainer, setDraggableContainer] = useState();

  useEffect(() => {
    if (document.getElementById(LIST_ID) && !sortableContainer) {
      setDraggableContainer(document.getElementById(LIST_ID));
    }
  });

  useEffect(() => {
    if (sortableContainer && !sortable) {
      setSortable(
        new Sortable(sortableContainer, {
          draggable: "tr",
          handle: ".dragHandle",
          mirror: {
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
  }, [sortableContainer, sortable]);

  let currentDragIndex = -1;
  useEffect(() => {
    if (sortable && liveData) {
      sortable.on("drag:start", (event) => {
        const trElements = Array.from(sortableContainer.childNodes);
        currentDragIndex = trElements.indexOf(event.source);
      });
      sortable.on("drag:stop", (event) => {
        const trElements = Array.from(sortableContainer.childNodes).filter(
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
          newData.forEach((item, index) => (item.index = index));
          updateProductCollection(
            productId,
            collectionName,
            newData.map((item) => ({
              // to avoid including evidence & trends in the call
              id: item.id,
              index: item.index,
              name: item.name,
              product_id: item.product_id,
            }))
          )
            .then(() => {
              // TODO: refreshing the page works, but I'd prefer not to
              // setLiveData((prevLiveData) => [...newData]); // resets the live data, but renders it the old way (!)
              window.location.reload();
            })
            .catch((err) => {
              console.error(err);
            });
        }
        // done: cleanup
        currentDragIndex = -1;
      });
    }
  }, [sortable, liveData]);

  // TODO: (above TODO) vs: this uses old `liveData` after drag reordering
  const deleteItemCallback = useCallback(
    (item) => {
      setLiveData(liveData.filter((i) => i.id !== item.id));
      deleteItem(item.id);
    },
    [liveData]
  );

  const widgetOnClickCallback = useCallback(
    (item) => {
      setCurrentWidgetItem(item);
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
                <th>{evidenceColumnLabel}</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody id={LIST_ID}>
              {liveData &&
                liveData
                  .sort((a, b) => a.index - b.index)
                  .map((item, index) => (
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
      {currentWidgetItem && (
        <Modal
          productId={productId}
          dialogId={mainModalId}
          item={currentWidgetItem}
          updateItemFunc={(item) => updateItem(item)}
          summaryTitle={summaryTitle}
          updateEvidenceOnServer={(evidence) => {
            currentWidgetItem.evidence = evidence;
            updateEvidence(currentWidgetItem.id, evidence);
          }}
          deleteTrendFunc={deleteTrend}
          addTrendFunc={addTrend}
          updateTrendFunc={updateTrend}
        />
      )}
    </>
  );
};

export default Widget;
