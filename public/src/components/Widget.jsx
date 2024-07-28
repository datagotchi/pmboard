import React, { useEffect, useState } from "react";
import { WidgetDataItem } from "../types";

/**
 * The HTML component for all PMBoard widgets
 * to document and visualize information
 *
 * @component
 * @param data {WidgetDataItem[] | undefined} The data to show in the widget.
 * @param type {string} The type of the data rows.
 * @param title {string} The title to show at the top of the widget.
 * @param children {any} The modal to show when a data item is clicked.
 * @param addFunc {function} The function to call when a new item is added.
 * @param deleteFunc {function} The function to call when a new item is deleted.
 * @returns {JSX.Element} The rendered widget.
 * @example
 * <ResearchWidget productId={5} />
 */
const Widget = ({ data, type, title, addFunc, deleteFunc, children }) => {
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
   * @type {[number | undefined, React.Dispatch<number>]}
   */
  const [currentDataIndex, setCurrentDataIndex] = useState();

  /**
   * @type {[HTMLDialogElement | undefined, React.Dispatch<HTMLDialogElement>]}
   */
  const [dialog, setDialog] = useState();

  /**
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
   */
  const showCreateDialog = (event) => {
    /**
     * @type HTMLDialogElement
     */
    const dialog = document.getElementById("newItemDialog");
    setDialog(dialog);
    dialog.showModal();
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
                    <a onClick={() => openModal(item._id)}>{item.name}</a>
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
                      style={{ cusor: "pointer" }}
                      onClick={() => {
                        deleteFunc(index);
                        liveData.splice(index, 1);
                        setLiveData([...liveData]);
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
            ></span>
            Add another
          </button>
        </div>
        <dialog id="newItemDialog">
          <p>
            New name: <input type="text" id="newName" />
          </p>
          <p>
            <button
              onClick={() => {
                const newNameField = document.getElementById("newName");
                const newName = newNameField.value;
                const newItem = { name: newName, evidence: [] };
                setCurrentDataIndex(liveData.length);
                setLiveData([...liveData, newItem]);
                addFunc(newItem);
                dialog?.close();
                newNameField.value = "";
              }}
            >
              Create
            </button>
          </p>
        </dialog>
      </div>
      {children}
    </>
  );
};

export default Widget;
