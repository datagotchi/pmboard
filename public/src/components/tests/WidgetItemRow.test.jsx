/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WidgetItemRow from "../WidgetItemRow";

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

  it("renders the component with the correct item name", () => {
    render(
      <WidgetItemRow
        item={mockItem}
        onDeleteCallback={mockOnDeleteCallback}
        onClickCallback={mockOnClickCallback}
      />
    );

    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  it("calls onClickCallback when the item name is clicked", () => {
    render(
      <WidgetItemRow
        item={mockItem}
        onDeleteCallback={mockOnDeleteCallback}
        onClickCallback={mockOnClickCallback}
      />
    );

    fireEvent.click(screen.getByText("Test Item"));
    expect(mockOnClickCallback).toHaveBeenCalledWith(mockItem);
  });

  it("displays the correct evidence count", () => {
    render(
      <WidgetItemRow
        item={mockItem}
        onDeleteCallback={mockOnDeleteCallback}
        onClickCallback={mockOnClickCallback}
      />
    );

    expect(
      screen.getByText(mockItem.evidence.length.toString())
    ).toBeInTheDocument();
  });

  it("calls onDeleteCallback when the delete button is clicked and confirmed", () => {
    window.confirm = jest.fn(() => true); // Mock confirm dialog to always return true

    render(
      <WidgetItemRow
        item={mockItem}
        onDeleteCallback={mockOnDeleteCallback}
        onClickCallback={mockOnClickCallback}
      />
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(window.confirm).toHaveBeenCalledWith("Are you sure?");
    expect(mockOnDeleteCallback).toHaveBeenCalledWith(mockItem);
  });

  it("does not call onDeleteCallback when the delete button is clicked and not confirmed", () => {
    window.confirm = jest.fn(() => false); // Mock confirm dialog to always return false

    render(
      <WidgetItemRow
        item={mockItem}
        onDeleteCallback={mockOnDeleteCallback}
        onClickCallback={mockOnClickCallback}
      />
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(window.confirm).toHaveBeenCalledWith("Are you sure?");
    expect(mockOnDeleteCallback).not.toHaveBeenCalled();
  });

  it("applies the correct badge class based on evidence length", () => {
    const shortEvidenceItem = { ...mockItem, evidence: [{ trends: [] }] };
    const longEvidenceItem = {
      ...mockItem,
      evidence: new Array(10).fill({ trends: [] }),
    };

    const { rerender } = render(
      <WidgetItemRow
        item={shortEvidenceItem}
        onDeleteCallback={mockOnDeleteCallback}
        onClickCallback={mockOnClickCallback}
      />
    );

    expect(
      screen.getByText(shortEvidenceItem.evidence.length.toString()).className
    ).toContain("bg-warning");

    rerender(
      <WidgetItemRow
        item={longEvidenceItem}
        onDeleteCallback={mockOnDeleteCallback}
        onClickCallback={mockOnClickCallback}
      />
    );

    expect(
      screen.getByText(longEvidenceItem.evidence.length.toString()).className
    ).toContain("bg-success");
  });
});
