import React from "react";

/**
 * The HTML component for all PMBoard widgets
 * to document and visualize information
 *
 * @component
 * @param data {any | undefined} the data to show in the widget.
 * @param title {string} the title to show at the top of the widget.
 * @param children {any} the modal to show when a data item is clicked.
 * @returns {JSX.Element} The rendered widget.
 * @example
 * <ResearchWidget productId={5} />
 */
const Widget = (data, title, children) => {
  return (
    <>
      <div class="panel panel-default widget">
        <div class="panel-heading">
          <h3 class="panel-title">{title}</h3>
        </div>
        <div class="panel-body">
          <table class="table">
            <thead>
              <th>Persona</th>
              <th>Evidence</th>
            </thead>
            <tbody>
              {data?.map((persona) => (
                <tr ng-repeat="row in data track by $index">
                  <td>
                    {/* <a href="#" ng-click="openModal($index, modalTemplate)">{{ row[column.value] }}</a> */}
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
