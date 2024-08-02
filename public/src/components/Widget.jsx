import React, { useEffect, useState } from "react";
import { WidgetDataItem } from "../types";
import Modal from "./Modal";

/**
 * The HTML component for all PMBoard widgets to document and visualize information
 *
 * @param {object} props
 * @param {WidgetDataItem[] | undefined} props.data The data to show in the widget.
 * @param {string} props.type The type of the data rows.
 * @param {string} props.title The title to show at the top of the widget.
 * @param {(persona: Persona) => void} props.addFunc The function to call when a new item is added.
 * @param {(persona: Persona) => void} props.updateFunc The function to call when an item is updated.
 * @param {(personaIndex: number) => void} props.deleteFunc The function to call when a new item is deleted.
 * @param {string} props.itemModalId The ID of the item modal passed in `children`.
 * @returns {JSX.Element} The rendered widget.
 * @example
 * <Widget data={*} type={*} title="*" addFunc={*} deleteFunc={*} itemModalId="*" />
 */
const Widget = ({
  data,
  type,
  title,
  addFunc,
  updateFunc,
  deleteFunc,
  itemModalId,
}) => {
  /**
   * @type {[WidgetDataItem[] | undefined, React.Dispatch<any[]>]}
   */
  const [liveData, setLiveData] = useState();

  useEffect(() => {
    if (data && !liveData) {
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

  /**
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
   */
  const showCreateDialog = (event) => {
    /**
     * @type HTMLDialogElement
     */
    const createDialog = document.getElementById("createDialog");
    setCreateDialog(createDialog);
    // TODO: only add once
    createDialog.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        createDialog.close();
      }
    });
    createDialog.showModal();
  };

  const getEvidenceLabelClass = (item) => {
    switch (item.evidence.length) {
      case item.evidence.length > 0 && item.evidence.length < 10:
        return "label-warning";
      case item.evidence.length >= 10:
        return "label-success";
      default:
        return "label-danger";
    }
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
         * @type HTMLDialogElement
         */
        const modal = document.getElementById(itemModalId);
        setItemModal(modal);
      }
    }
  }, [currentItem, itemModal]);

  return (
    <>
      <div className="panel panel-default widget">
        <div className="panel-heading">
          <h3 className="panel-title">{title}</h3>
        </div>
        <div className="panel-body">
          <table className="table">
            <thead>
              <tr>
                <th>{type}</th>
                <th>Evidence</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {liveData?.map((item, index) => (
                <tr key={`Item #${index}`}>
                  <td>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setCurrentItem(item);
                        setCurrentItemIndex(index);
                      }}
                    >
                      {item.name}
                    </a>
                  </td>
                  <td>
                    <span
                      className={`evidence label ${getEvidenceLabelClass(
                        item
                      )}`}
                    >
                      {item.evidence.length}
                    </span>
                  </td>
                  <td>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (confirm("Are you sure?")) {
                          deleteFunc(index);
                          liveData.splice(index, 1);
                          setLiveData([...liveData]);
                        }
                      }}
                    >
                      <span className="remove-evidence glyphicon glyphicon-remove" />{" "}
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel-footer">
          <button onClick={showCreateDialog}>
            <span
              className="glyphicon glyphicon-plus"
              aria-hidden="true"
            ></span>{" "}
            Add another
          </button>
        </div>
        <dialog id="createDialog">
          <p>
            New name: <input type="text" id="newName" />
          </p>
          <p>
            <button
              onClick={() => {
                const newNameField = document.getElementById("newName");
                const newName = newNameField.value;
                const newItem = { name: newName, evidence: [] };
                setLiveData([...liveData, newItem]);
                addFunc(newItem);
                createDialog.close();
                setCreateDialog(undefined);
                newNameField.value = "";
              }}
            >
              Create
            </button>
          </p>
        </dialog>
      </div>
      {currentItem && (
        <Modal
          dialogId={itemModalId}
          item={currentItem}
          deleteFunc={(item) => {
            const itemIndex = liveData.indexOf(item);
            liveData.splice(itemIndex, 1);
            setLiveData([...liveData]);
            deleteFunc(itemIndex);
          }}
          updateFunc={(item) => updateFunc(item, currentItemIndex)}
        />
      )}
    </>
  );
};

export default Widget;
