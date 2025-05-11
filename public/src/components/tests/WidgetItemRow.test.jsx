/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import WidgetItemRow, { EVIDENCE_MILESTONE } from "../WidgetItemRow";

describe("WidgetItemRow Component", () => {
  const mockItem = {
    name: "Test Item",
    evidence: [
      {
        trends: [{ type: "objective" }, { type: "goal" }, { type: "activity" }],
      },
      {
        trends: [
          { type: "objective" },
          { type: "goal" },
          { type: "activity" },
          { type: "task" },
          { type: "resource" },
        ],
      },
    ],
  };

  const mockOnDeleteCallback = jest.fn();
  const mockOnClickCallback = jest.fn();
  const mockConfirm = jest.fn().mockReturnValue(false);
  let originalConfirm;

  beforeEach(() => {
    originalConfirm = window.confirm;
    window.confirm = mockConfirm;
  });

  afterEach(() => {
    window.confirm = originalConfirm;
    jest.clearAllMocks();
  });

  it("renders the component with the correct item name", () => {
    render(
      <table>
        <tbody>
          <WidgetItemRow
            item={mockItem}
            onDeleteCallback={mockOnDeleteCallback}
            onClickCallback={mockOnClickCallback}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  it("calls onClickCallback when the item name is clicked", () => {
    render(
      <table>
        <tbody>
          <WidgetItemRow
            item={mockItem}
            onDeleteCallback={mockOnDeleteCallback}
            onClickCallback={mockOnClickCallback}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Test Item"));
    expect(mockOnClickCallback).toHaveBeenCalledWith(mockItem);
  });

  it("displays the correct evidence count", () => {
    render(
      <table>
        <tbody>
          <WidgetItemRow
            item={mockItem}
            onDeleteCallback={mockOnDeleteCallback}
            onClickCallback={mockOnClickCallback}
          />
        </tbody>
      </table>
    );

    expect(
      screen.getByText(mockItem.evidence.length.toString())
    ).toBeInTheDocument();
  });

  it("calls onDeleteCallback when the delete button is clicked and confirmed", () => {
    mockConfirm.mockReturnValueOnce(true);

    render(
      <table>
        <tbody>
          <WidgetItemRow
            item={mockItem}
            onDeleteCallback={mockOnDeleteCallback}
            onClickCallback={mockOnClickCallback}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(window.confirm).toHaveBeenCalledWith("Are you sure?");
    expect(mockOnDeleteCallback).toHaveBeenCalledWith(mockItem);
  });

  it("does not call onDeleteCallback when the delete button is clicked and not confirmed", () => {
    mockConfirm.mockReturnValueOnce(false);

    render(
      <table>
        <tbody>
          <WidgetItemRow
            item={mockItem}
            onDeleteCallback={mockOnDeleteCallback}
            onClickCallback={mockOnClickCallback}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(window.confirm).toHaveBeenCalledWith("Are you sure?");
    expect(mockOnDeleteCallback).not.toHaveBeenCalled();
  });

  it("applies the correct badge class based on evidence length", () => {
    const shortEvidenceItem = { ...mockItem, evidence: [{ trends: [] }] };
    const longEvidenceItem = {
      ...mockItem,
      evidence: new Array(EVIDENCE_MILESTONE).fill({ trends: [] }),
    };

    const { rerender } = render(
      <table>
        <tbody>
          <WidgetItemRow
            item={shortEvidenceItem}
            onDeleteCallback={mockOnDeleteCallback}
            onClickCallback={mockOnClickCallback}
          />
        </tbody>
      </table>
    );

    screen.debug();

    expect(
      screen.getByText(shortEvidenceItem.evidence.length.toString()).className
    ).toContain("evidence badge bg-warning");

    rerender(
      <WidgetItemRow
        item={longEvidenceItem}
        onDeleteCallback={mockOnDeleteCallback}
        onClickCallback={mockOnClickCallback}
      />
    );

    expect(
      screen.getByText(longEvidenceItem.evidence.length.toString()).className
    ).toContain("evidence badge bg-success");
  });
});
