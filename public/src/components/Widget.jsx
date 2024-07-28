import React, { useState } from "react";

/**
 * The HTML component for all PMBoard widgets
 * to document and visualize information
 *
 * @component
 * @param data {any | undefined} The data to show in the widget.
 * @param type {string} The type of the data rows.
 * @param title {string} The title to show at the top of the widget.
 * @param children {any} The modal to show when a data item is clicked.
 * @param addFunc {function} The function to call when a new item is added.
 * @param deleteFunc {function} The function to call when a new item is deleted.
 * @returns {JSX.Element} The rendered widget.
 * @example
 * <ResearchWidget productId={5} />
 */
const Widget = ({ data, type, title, addFunc, children }) => {
  /**
   * @type {[HTMLDialogElement | undefined, React.Dispatch<HTMLDialogElement>]}
   */
  const [dialog, setDialog] = useState();
  /**
   *
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
              </tr>
            </thead>
            <tbody>
              {data?.map((datum) => (
                <tr>
                  <td>
                    {/* <a onClick="openModal({datum.id})">{row[column.value]}</a> */}
                  </td>
                  <td>
                    {/* <span className="evidence label" ng-className="{'label-danger': !row.evidence.length, 'label-warning': row.evidence.length < 10, 'label-success': row.evidence.length >= 10}">{{ row.evidence.length }}</span> */}
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
                const newName = document.getElementById("newName").value;
                addFunc({ name: newName });
                dialog?.close();
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
