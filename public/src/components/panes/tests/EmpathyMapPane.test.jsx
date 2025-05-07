/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import EmpathyMapPane from "../EmpathyMapPane";
import { AllTagsContext } from "../../../contexts/AllTagsContext";
import { getOccurenceNumber } from "../../../../../util";
import { indexToClassName } from "../EmpathyMapPaneFunctions";

import * as ReactTagInput from "react-tag-input";
jest.mock("react-tag-input", () => ({ WithContext: jest.fn() }));

const mockEmpathyMapAllTags = [
  {
    id: "tag1",
    text: " tag1",
    className: "objective",
  },
  {
    id: "tag1",
    text: " tag1",
    className: "objective",
  },
  {
    id: "tag2",
    text: " tag2",
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
    const rows = container.querySelector("tr");
    expect(rows).toBeInTheDocument();
    rows.forEach((row, index) => {
      const className = indexToClassName[index];
      const count = getOccurenceNumber(row.innerText);
      // expect(count).toEqual(...); // number in mockEmpathyMapAllTags
    });
    expect(rows.length).toEqual(mockEmpathyMapAllTags.length);
  });
  it("Changes tag classNames correctly", async () => {});
});
