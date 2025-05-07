import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../Modal";

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

  const mockProps = {
    item: mockItem,
    dialogId: "test-dialog",
    productId: "test-product",
    addEvidenceFunc: jest.fn(),
    removeEvidenceFunc: jest.fn(),
    summaryTitle: "Summary",
    updateItemFunc: jest.fn(),
    deleteTrendFunc: jest.fn(),
    addTrendFunc: jest.fn(),
    updateTrendFunc: jest.fn(),
  };

  it("renders the modal with correct title", () => {
    render(<Modal {...mockProps} />);
    expect(screen.getByText(mockItem.name)).toBeInTheDocument();
  });

  it("renders the Evidence tab by default", () => {
    render(<Modal {...mockProps} />);
    expect(screen.getByRole("tabpanel", { name: /evidence/i })).toBeVisible();
  });

  it("renders the Summary tab when clicked", () => {
    render(<Modal {...mockProps} />);
    const summaryTab = screen.getByRole("tab", { name: /summary/i });
    fireEvent.click(summaryTab);
    expect(screen.getByRole("tabpanel", { name: /summary/i })).toBeVisible();
  });

  it("calls addEvidenceFunc when adding evidence", () => {
    render(<Modal {...mockProps} />);
    const addFileFunc = mockProps.addEvidenceFunc;
    addFileFunc(1, { name: "New Evidence" });
    expect(addFileFunc).toHaveBeenCalledWith(1, { name: "New Evidence" });
  });

  it("calls removeEvidenceFunc when removing evidence", () => {
    render(<Modal {...mockProps} />);
    const removeFileFunc = mockProps.removeEvidenceFunc;
    removeFileFunc(1, 2);
    expect(removeFileFunc).toHaveBeenCalledWith(1, 2);
  });

  it("displays a message when there is no evidence", () => {
    const emptyItem = { ...mockItem, evidence: [] };
    render(<Modal {...mockProps} item={emptyItem} />);
    expect(
      screen.getByText("There is no evidence. Start by adding a file!")
    ).toBeInTheDocument();
  });

  it("updates the summary when summaryChanged is called", () => {
    render(<Modal {...mockProps} />);
    const newSummary = "Updated Summary";
    mockProps.updateItemFunc.mockClear();
    const summaryChanged = screen.getByRole("tabpanel", { name: /summary/i });
    fireEvent.change(summaryChanged, { target: { value: newSummary } });
    expect(mockProps.updateItemFunc).toHaveBeenCalled();
  });
});
