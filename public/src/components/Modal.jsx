import React from "react";

const Modal = ({ item, dialogId }) => {
  return (
    <dialog id={dialogId}>
      <div>
        <div>
          <div>
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span>&times;</span>
              </button>
              <h4 className="modal-title">{item?.name}</h4>
            </div>
            <div className="modal-body">
              <div role="tabpanel">
                <ul className="nav nav-tabs" role="tablist"></ul>
                <div className="tab-content"></div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-danger remove-item glyphicon glyphicon-remove"
                aria-label="Delete"
              >
                Delete
              </button>
              <button
                type="button"
                className="btn-primary"
                data-dismiss="modal"
                aria-label="Close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
