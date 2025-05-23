/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import * as ReactTagInput from "react-tag-input";
import StakeholderEvidencePane from "../panes/StakeholderEvidencePane";
jest.mock("react-tag-input", () => ({
  WithContext: jest.fn(),
  SEPARATORS: {
    ENTER: 13,
  },
}));

jest.mock("../../hooks/useOAuthAPI");

describe("StakeholderEvidencePane.jsx", () => {
  const mockWithContext = ReactTagInput.WithContext;
  const handleDeleteSpy = jest.fn();
  global.fetch = jest.fn().mockResolvedValue({ json: jest.fn() });

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

  it("Renders mock evidence personas", async () => {
    const mockPersonas = [
      { id: "1", name: "Persona 1" },
      { id: "2", name: "Persona 2" },
    ];
    const { container } = render(
      <StakeholderEvidencePane
        evidence={mockPersonas}
        productId="productId"
        containerModalId="containerModalId"
        addFileFunc={jest.fn()}
        removeFileFunc={jest.fn()}
      />
    );

    const rows = Array.from(container.querySelectorAll("tr"));
    expect(rows.length).toEqual(mockPersonas.length);
    rows.forEach((row) => expect(row).toBeInTheDocument());
  });
});
