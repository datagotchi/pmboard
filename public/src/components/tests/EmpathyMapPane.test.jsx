/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import EmpathyMapPane from "../panes/EmpathyMapPane";
import { AllTagsContext } from "../../contexts/AllTagsContext";
import { getOccurenceNumber } from "../../../../util";
import { indexToClassName } from "../panes/EmpathyMapPaneFunctions";

import * as ReactTagInput from "react-tag-input";
jest.mock("react-tag-input", () => ({ WithContext: jest.fn() }));

const mockEmpathyMapAllTags = [
  {
    id: "tag1",
    text: "tag (1)",
    className: "objective",
  },
  {
    id: "tag2",
    text: "tag (2)",
    className: "objective",
  },
  {
    id: "tag3",
    text: "tag (3)",
    className: "goal",
  },
];

describe("EmpathyMapPane.jsx", () => {
  const mockWithContext = ReactTagInput.WithContext;
  const handleDeleteSpy = jest.fn();

  beforeEach(() => {
    mockWithContext.mockImplementation(
      ({ tags, handleDelete, onTagUpdate }) => {
        return (
          <ul>
            {tags.map((tag, index) => (
              <li key={`Tag #${index}`}>
                <span
                  onClick={(event) => {
                    const element = event.target;
                    element.style.display = "none";
                    element.nextSibling.style.display = "inline";
                  }}
                >
                  {tag.text}
                </span>
                <input
                  type="text"
                  style={{ display: "none" }}
                  value={tag.id}
                  onChange={(event) => {
                    tag.id = event.target.value;
                    tag.text = event.target.value;
                  }}
                  onBlur={async (event) => {
                    const response = await onTagUpdate(index, tag);
                    const previousSibling = event.target.previousSibling;
                    if (response) {
                      previousSibling.innerHTML = response.id; // TODO: ugh why do I have to do this manually
                    }
                    previousSibling.style.display = "inline";
                    event.target.style.display = "none";
                  }}
                />
                <button
                  onClick={() => {
                    handleDeleteSpy(index);
                    handleDelete(index);
                  }}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        );
      }
    );
  });

  it("Renders mock allTags correctly", async () => {
    const { container } = render(
      <AllTagsContext.Provider value={mockEmpathyMapAllTags}>
        <EmpathyMapPane />
      </AllTagsContext.Provider>
    );
    const rows = container.querySelectorAll("tr");
    let currentCount = 1;
    rows.forEach((row, index) => {
      expect(row).toBeInTheDocument();
      const className = indexToClassName[index];
      console.log("*** row", row.innerHTML);
      const spans = Array.from(row.querySelectorAll("span"));
      spans.forEach((span) => {
        expect(span).toBeInTheDocument();
        const count = getOccurenceNumber(span.textContent);
        expect(count).toEqual(currentCount);
        currentCount += 1;
      });
    });
  });
  // it("Changes tag classNames correctly", async () => {});
});
