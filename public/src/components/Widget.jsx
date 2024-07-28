import React from "react";

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
const Widget = (data, type, title, addFunc, children) => {
  return (
    <>
      <div class="panel panel-default widget">
        <div class="panel-heading">
          <h3 class="panel-title">{title}</h3>
        </div>
        <div class="panel-body">
          <table class="table">
            <thead>
              <th>{type}</th>
              <th>Evidence</th>
            </thead>
            <tbody>
              {data?.map((datum) => (
                <tr>
                  <td>
                    <a onClick="openModal({datum.id})">{row[column.value]}</a>
                  </td>
                  <td>
                    {/* <span class="evidence label" ng-class="{'label-danger': !row.evidence.length, 'label-warning': row.evidence.length < 10, 'label-success': row.evidence.length >= 10}">{{ row.evidence.length }}</span> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="panel-footer">
          <a href="#" editable-text="newName" onaftersave="create(newName)">
            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
            Add another
          </a>
        </div>
      </div>
      {children}
    </>
  );
};

export default Widget;
