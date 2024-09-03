import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import EmpathyMapPane from "../components/panes/EmpathyMapPane";

// import { mockFacts } from "../hooks/__mocks__/axios";

describe("EmpathyMapPane.js", () => {
  test("Renders mock allTags", async () => {
    const { container } = render(<EmpathyMapPane evidence={mockEmpathyMap} />);
    const rows = container.querySelector("tr");
    expect(rows).toBeInTheDocument();
    expect(rows.length).toEqual(mockEmpathyMap.length);
  });
  test("Changes tag classNames correctly", async () => {});
});
