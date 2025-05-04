import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import * as ReactTagInput from "react-tag-input";
jest.mock("react-tag-input", () => ({ WithContext: jest.fn() }));

import FileEvidencePane from "../components/panes/FileEvidencePane";

// import { mockFacts } from "../hooks/__mocks__/axios";

describe("StakeholderEvidencePane.jsx", () => {
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

  it("Renders mock evidence files", async () => {
    const { container } = render(
      <FileEvidencePane evidence={mockEvidenceFiles} />
    );
    const rows = container.querySelector("tr");
    expect(rows).toBeInTheDocument();
    expect(rows.length).toEqual(mockEvidenceFiles.length);
  });
  it("Adds files correctly", async () => {});
  it("Removes files correctly", async () => {});
  it("Adds trends correctly", async () => {});
  it("Removes trends correctly", async () => {});
  it("Updates trend names correctly", async () => {});
});
