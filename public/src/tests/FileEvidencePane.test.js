import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import FileEvidencePane from "../components/panes/FileEvidencePane";

// import { mockFacts } from "../hooks/__mocks__/axios";

describe("FileEvidencePane.js", () => {
  test("Renders mock evidence files", async () => {
    const { container } = render(
      <FileEvidencePane evidence={mockEvidenceFiles} />
    );
    const rows = container.querySelector("tr");
    expect(rows).toBeInTheDocument();
    expect(rows.length).toEqual(mockEvidenceFiles.length);
  });
  test("Adds files correctly", async () => {});
  test("Removes files correctly", async () => {});
  test("Adds trends correctly", async () => {});
  test("Removes trends correctly", async () => {});
  test("Updates trend names correctly", async () => {});
});
