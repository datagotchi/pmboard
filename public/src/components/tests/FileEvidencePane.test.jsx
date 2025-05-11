/**
 * @jest-environment jsdom
 */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import * as ReactTagInput from "react-tag-input";

import FileEvidencePane from "../panes/FileEvidencePane";
import { AllTagsContext } from "../../contexts/AllTagsContext";

jest.mock("../../hooks/useOAuthAPI");

jest.mock("react-tag-input", () => ({
  WithContext: jest.fn(),
  SEPARATORS: {
    ENTER: 13,
  },
}));

describe("FileEvidencePane.jsx", () => {
  const mockWithContext = ReactTagInput.WithContext;
  const handleDeleteSpy = jest.fn();

  const mockTrends = [{ id: "1", name: "Trend 1", type: "type1" }];
  const mockFiles = [
    {
      id: "1",
      url: "file1.txt",
      type: "text/plain",
      size: 1234,
      lastModified: 1625256000000,
      trends: mockTrends,
    },
  ];

  beforeEach(() => {
    mockWithContext.mockImplementation(
      ({ tags, handleDelete, onTagUpdate, handleAddition }) => {
        return (
          <>
            <input
              type="text"
              placeholder="Add a tag"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  const newTag = {
                    id: event.target.value,
                    text: event.target.value,
                    className: "type2",
                    trend_id: "2",
                  };
                  handleAddition(newTag);
                  event.target.value = "";
                }
              }}
            />
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
          </>
        );
      }
    );
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

  it("Renders mock evidence files", async () => {
    const mockEvidenceFiles = [
      {
        id: "1",
        name: "file1.txt",
        type: "text/plain",
        size: 1234,
        lastModified: 1625256000000,
      },
      {
        id: "2",
        name: "file2.jpg",
        type: "image/jpeg",
        size: 5678,
        lastModified: 1625257000000,
      },
    ];
    const { container } = render(
      <FileEvidencePane evidence={mockEvidenceFiles} />
    );
    const rows = Array.from(container.querySelectorAll("tr"));
    expect(rows.length).toEqual(mockEvidenceFiles.length);
    rows.forEach((row) => {
      expect(row).toBeInTheDocument();
    });
  });
  it("Adds files correctly", async () => {
    const mockEvidenceFiles = [
      {
        id: "1",
        name: "file1.txt",
        type: "text/plain",
        size: 1234,
        lastModified: 1625256000000,
      },
    ];

    const mockNewFile = {
      id: "2",
      name: "file2.jpg",
      type: "image/jpeg",
      size: 5678,
      lastModified: 1625257000000,
    };

    const { container, getByText, rerender } = render(
      <FileEvidencePane evidence={mockEvidenceFiles} />
    );

    // Simulate adding a new file
    const addFileButton = getByText("Add File");
    addFileButton.click();

    // Mock the addition of the new file
    mockEvidenceFiles.push(mockNewFile);

    rerender(<FileEvidencePane evidence={mockEvidenceFiles} />);

    const rows = Array.from(container.querySelectorAll("tbody > tr"));
    expect(rows.length).toEqual(mockEvidenceFiles.length);
    expect(rows.some((row) => row.textContent.includes(mockNewFile.name))).toBe(
      true
    );
  });
  it("Removes files correctly", async () => {
    const allTags = [
      { id: "1", text: "Trend 1", className: "type1" },
      { id: "2", text: "Trend 2", className: "type2" },
    ];
    const mockEvidenceFiles = [
      {
        id: "1",
        url: "file1.txt",
        type: "text/plain",
        size: 1234,
        lastModified: 1625256000000,
        trends: [{ id: "1", name: "Trend 1", type: "type3" }],
      },
      {
        id: "2",
        url: "file2.jpg",
        type: "image/jpeg",
        size: 5678,
        lastModified: 1625257000000,
        trends: [{ id: "2", name: "Trend 2", type: "type4" }],
      },
    ];

    const { container, getByText, rerender } = render(
      <AllTagsContext.Provider value={allTags}>
        <FileEvidencePane
          evidence={mockEvidenceFiles}
          deleteTrendFunc={jest.fn()}
        />
      </AllTagsContext.Provider>
    );

    // Simulate removing a file
    const removeFileButton = screen.getAllByText("X")[0]; // Select the first "X" button
    removeFileButton.click();

    // Mock the removal of the file
    mockEvidenceFiles.pop();

    rerender(
      <AllTagsContext.Provider value={allTags}>
        <FileEvidencePane
          evidence={mockEvidenceFiles}
          deleteTrendFunc={jest.fn()}
        />
      </AllTagsContext.Provider>
    );

    const rows = Array.from(container.querySelectorAll("tr"));
    expect(rows.length).toEqual(mockEvidenceFiles.length);
    expect(rows.some((row) => row.textContent.includes("file2.jpg"))).toBe(
      false
    );
  });
  it("Adds trends correctly", async () => {
    const mockNewTrend = { id: "2", name: "Trend 2", type: "type2" };
    const mockAddTrendFunc = jest.fn().mockResolvedValue(mockNewTrend);
    const allTags = [
      { id: "Trend 1", text: "Trend 1", className: "type1" },
      { id: "Trend 2", text: "Trend 2", className: "type2" },
    ];

    render(
      <AllTagsContext.Provider value={allTags}>
        <FileEvidencePane
          evidence={mockFiles}
          addTrendFunc={mockAddTrendFunc}
        />
      </AllTagsContext.Provider>
    );

    // expect original tags to be passed to ReactTags
    expect(mockWithContext).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: mockTrends.map((trend) => ({
          id: trend.name,
          text: trend.name,
          className: trend.type,
          trend_id: trend.id,
        })),
      }),
      undefined
    );

    // Simulate adding a new trend
    const addTrendTextbox = screen.getByPlaceholderText("Add a tag");
    expect(addTrendTextbox).toBeInTheDocument();
    expect(addTrendTextbox.tagName).toEqual("INPUT");
    expect(addTrendTextbox.value).toEqual("");

    // Mock the addition of the new trend
    addTrendTextbox.value = mockNewTrend.name;
    expect(addTrendTextbox.value).toEqual(mockNewTrend.name);
    // addTrendButton.dispatchEvent(
    //   new KeyboardEvent("keydown", { key: "Enter", code: 13 })
    // );
    fireEvent.keyDown(addTrendTextbox, {
      key: "Enter",
      code: 13,
    });

    // expect the new trend to be added
    expect(mockAddTrendFunc).toHaveBeenCalledWith(mockFiles[0].id, {
      name: mockNewTrend.name,
    });

    // expect there to be a new tag from the new trend
    // TODO: mockWithContext is being called only with the original tag
    // const allTrends = [...mockTrends, mockNewTrend];
    // expect(mockWithContext).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     tags: allTrends.map((trend) => ({
    //       id: trend.name,
    //       text: trend.name,
    //       className: trend.type,
    //       trend_id: trend.id,
    //     })),
    //   }),
    //   undefined
    // );
  });
  it("Removes trends correctly", async () => {
    const mockTrends = [
      { id: "1", text: "Trend 1" },
      { id: "2", text: "Trend 2" },
    ];

    const mockDeleteTrendFunc = jest.fn();

    render(
      <FileEvidencePane
        evidence={mockFiles}
        deleteTrendFunc={mockDeleteTrendFunc}
      />
    );

    // Simulate removing a trend
    const removeTrendButton = screen.getAllByText("X")[0]; // Select the first "X" button
    expect(removeTrendButton).toBeInTheDocument();
    expect(removeTrendButton.tagName).toEqual("BUTTON");
    expect(removeTrendButton.textContent).toEqual("X");
    removeTrendButton.click();

    expect(mockDeleteTrendFunc).toHaveBeenCalledTimes(1);

    // Mock the removal of the trend
    // mockTrends.pop();

    // const trendElements = screen.queryAllByText(/Trend/);
    // expect(trendElements.length).toEqual(mockTrends.length);
    // expect(trendElements.some((el) => el.textContent.includes("Trend 2"))).toBe(
    //   false
    // );
  });
  it("Updates trend names correctly", async () => {
    const updatedTrend = { id: "1", name: "Updated Trend 1" };

    const mockUpdateTrendNameFunc = jest.fn().mockResolvedValue(updatedTrend);

    render(
      <FileEvidencePane
        evidence={mockFiles}
        updateTrendNameFunc={mockUpdateTrendNameFunc}
        allTagsUpdated={jest.fn()}
      />
    );

    // Simulate updating a trend
    const trendElement = screen.getByText("Trend 1");
    expect(trendElement).toBeInTheDocument();
    expect(trendElement.tagName).toEqual("SPAN");
    expect(trendElement.textContent).toEqual("Trend 1");
    trendElement.click();

    const inputElement = screen.getByDisplayValue("Trend 1");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.tagName).toEqual("INPUT");
    expect(inputElement.value).toEqual("Trend 1");
    // Simulate entering a new name
    fireEvent.change(inputElement, {
      target: { value: "Updated Trend 1" },
    });
    // expect(inputElement).toHaveValue("Updated Trend 1");
    // Simulate blurring the input to trigger the update
    fireEvent.blur(inputElement);

    // Assert that the trend was updated
    expect(mockUpdateTrendNameFunc).toHaveBeenCalledWith("1", updatedTrend);
    const updatedTrendElement = screen.getByText("Updated Trend 1");
    expect(updatedTrendElement).toBeInTheDocument();
  });
});
