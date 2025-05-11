/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Modal from "../Modal";
import { EvidencePaneContext } from "../../contexts/EvidencePaneContext";
import FileEvidencePane from "../panes/FileEvidencePane";

jest.mock("../../hooks/useOAuthAPI");

jest.mock("react-tag-input", () => ({
  WithContext: jest.fn(),
  SEPARATORS: {
    ENTER: 13,
  },
}));

describe("Modal Component", () => {
  const mockItem = {
    id: 1,
    name: "Test Item",
    evidence: [
      {
        id: 1,
        trends: [
          { name: "Trend1", type: "type1" },
          { name: "Trend2", type: "type2" },
        ],
      },
    ],
    summary: "Test Summary",
  };

  beforeEach(() => {
    // HTMLDialogElement not supported in jsdom
    // solution from: https://github.com/jsdom/jsdom/issues/3294#issuecomment-2499134049
    if (!HTMLDialogElement.prototype.showModal) {
      HTMLDialogElement.prototype.showModal = function () {
        this.open = true;
      };
    }
    if (!HTMLDialogElement.prototype.close) {
      HTMLDialogElement.prototype.close = function (returnValue) {
        this.open = false;
        this.returnValue = returnValue;
      };
    }
  });

  it("renders the modal with correct title", () => {
    render(<Modal item={mockItem} />);
    expect(screen.getByText(mockItem.name)).toBeInTheDocument();
  });

  it("renders the Evidence tab by default", () => {
    render(
      <EvidencePaneContext.Provider value={FileEvidencePane}>
        <Modal item={mockItem} />
      </EvidencePaneContext.Provider>
    );
    const tabPane = screen.getByRole("tabpanel", {
      name: "evidence",
      hidden: true,
    });
    expect(tabPane).toHaveAttribute("class", "tab-pane active");
  });

  // FIXME: requires loading bootstrap js
  // it("renders the Summary tab when clicked", async () => {
  //   render(<Modal item={mockItem} />);
  //   const summaryTab = screen.getByRole("tab", {
  //     name: "summary",
  //     hidden: true,
  //   });
  //   fireEvent.click(summaryTab);
  //   await waitFor(() =>
  //     expect(
  //       screen.getByRole("tabpanel", { name: "modalSummary", hidden: true })
  //     ).toHaveAttribute("class", "tab-pane active")
  //   );
  // });

  // FIXME: requires bootstrap js
  // it("calls addEvidenceFunc when adding evidence", () => {
  //   const mockAddFileFunc = jest.fn();
  //   render(
  //     <EvidencePaneContext.Provider value={FileEvidencePane}>
  //       <Modal
  //         item={mockItem}
  //         addEvidenceFunc={mockAddFileFunc}
  //         dialogId="modalId"
  //       />
  //     </EvidencePaneContext.Provider>
  //   );

  //   fireEvent.click(screen.getByText("Add File"));
  //   const dialog = document.getElementById("addFilesModal: modalId");
  //   expect(dialog).toBeVisible();

  //   const firstCheckbox = document.querySelector("input[type='checkbox']");
  //   expect(firstCheckbox).toBeVisible();
  //   fireEvent.click(firstCheckbox);
  //   fireEvent.click(screen.getByText("Submit"));

  //   expect(mockAddFileFunc).toHaveBeenCalledWith(1, { name: "New Evidence" });
  // });

  // FIXME: requires bootstrap js
  // it("calls removeEvidenceFunc when removing evidence", () => {
  //   const mockRemoveFileFunc = jest.fn();
  //   render(<Modal item={mockItem} removeEvidenceFunc={mockRemoveFileFunc} />);

  //   expect(mockRemoveFileFunc).toHaveBeenCalledWith(1, 2);
  // });

  it("displays a message when there is no evidence", () => {
    const emptyItem = { ...mockItem, evidence: [] };
    render(<Modal item={emptyItem} />);
    expect(
      screen.getByText("There is no evidence. Start by adding a file!")
    ).toBeInTheDocument();
  });
});
