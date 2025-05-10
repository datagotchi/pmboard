/**
 * @jest-environment node
 */

import pg from "pg";
const { Pool } = pg;

jest.mock("pg", () => {
  const mPool = {
    connect: jest.fn(() => {
      return Promise.resolve({
        query: jest.fn(),
        release: jest.fn(),
      });
    }),
  };
  return { Pool: jest.fn(() => mPool) };
});

// import app from "../../app";
import {} from "../evidenceFunctions.js";
const addEvidence = require("../evidenceFunctions.js").addEvidenceExpressFunc(
  "story_id"
);
const deleteEvidence =
  require("../evidenceFunctions.js").deleteEvidenceExpressFunc();
const addTrend = require("../evidenceFunctions.js").addTrendExpressFunc();
const updateTrend = require("../evidenceFunctions.js").updateTrendExpressFunc();
const deleteTrend = require("../evidenceFunctions.js").deleteTrendExpressFunc();

const VALID_FIELDS = [
  "name",
  "url",
  "icon",
  "persona_id",
  "story_id",
  "created_date",
  "modified_date",
];
const INVALID_COLUMNS_MESSAGE = "Invalid column(s)";
const mockPool = {
  query: jest.fn(),
  // async ({ text, values }) => {
  //   switch (text) {
  //     case "delete from evidence where story_id = $1::integer":
  //       return {};
  //     case text.match("update evidence set")?.input:
  //       return {};
  //     case text.match("insert into evidence")?.input:
  //       const match = text.match(
  //         /insert into evidence\W+\((.*)\)\W+values \((.*)\)\W+returning */
  //       );
  //       const columns = match[1].split(",");
  //       if (
  //         columns
  //           .map((column) => column.trim().trimStart())
  //           .some((column) => !VALID_FIELDS.includes(column))
  //       ) {
  //         throw new Error(INVALID_COLUMNS_MESSAGE);
  //       }
  //       const retObj = {};
  //       const values = match[2].split(",");
  //       columns.forEach((column, i) => {
  //         retObj[column.trim().trimStart()] = values[i].trim().trimStart();
  //       });
  //       retObj.id = 1;
  //       return {
  //         rows: [retObj],
  //       };
  //     case text.match("from trends")?.input:
  //       return [];
  //     case text.match("insert into trends")?.input:
  //       return {};
  //     default:
  //       throw new Error("Unrecognized query");
  //   }
  // },
  release: jest.fn(),
};

describe("evidenceFunctions.js", () => {
  beforeAll(() => {
    mockPool.query = jest.fn().mockResolvedValue({
      rows: [],
    });
    mockPool.release = jest.fn();
  });

  it("should add evidence successfully", async () => {
    const mockReq = {
      story_id: 1,
      body: {
        name: "Test Evidence",
        url: "http://example.com",
        icon: "icon.png",
      },
      pool: mockPool,
    };

    const mockRes = {
      json: jest.fn(),
    };
    const mockResJsonSpy = jest.spyOn(mockRes, "json");

    const mockNextObject = { next: jest.fn() };
    await addEvidence(mockReq, mockRes, mockNextObject.next);

    const mockClientQuery = mockPool.query;
    expect(mockClientQuery).toHaveBeenCalledWith({
      text: `insert into evidence 
          (name, url, icon, story_id) 
          values ('Test Evidence','http://example.com','icon.png', $1::integer)`,
      values: [1],
    });
    expect(mockResJsonSpy).toHaveBeenCalledWith({ success: true });
  });

  it("should delete evidence successfully", async () => {
    const mockReq = {
      evidence_id: 1,
      pool: mockPool,
    };

    const mockRes = {
      json: jest.fn(),
    };
    const mockResJsonSpy = jest.spyOn(mockRes, "json");

    const mockClientQuery = mockPool.query;
    const mockNextObject = { next: jest.fn() };
    await deleteEvidence(mockReq, mockRes, mockNextObject.next);

    expect(mockClientQuery).toHaveBeenCalledWith({
      text: "delete from evidence where id = $1::integer",
      values: [1],
    });
    expect(mockResJsonSpy).toHaveBeenCalledWith({ success: true });
  });

  it("should add a trend successfully", async () => {
    const mockReq = {
      evidence_id: 1,
      body: {
        name: "Test Trend",
        type: "positive",
      },
      pool: mockPool,
    };

    const mockRes = {
      json: jest.fn(),
    };
    const mockResJsonSpy = jest.spyOn(mockRes, "json");
    const mockNextObject = { next: jest.fn() };
    const mockClientQuery = mockPool.query;

    await addTrend(mockReq, mockRes, mockNextObject.next);

    expect(mockClientQuery).toHaveBeenCalledWith({
      text: "insert into trends (name, type, evidence_id) values ($1::text, $2::text, $3::integer) returning *",
      values: ["Test Trend", "positive", 1],
    });
    expect(mockResJsonSpy).toHaveBeenCalled();
  });

  it("should update a trend successfully", async () => {
    const mockReq = {
      params: { trend_id: 1 },
      body: {
        name: "Updated Trend",
        type: "negative",
      },
      pool: mockPool,
    };

    const mockRes = {
      json: jest.fn(),
    };
    const mockResJsonSpy = jest.spyOn(mockRes, "json");
    const mockNextObject = { next: jest.fn() };
    const mockClientQuery = mockPool.query;

    await updateTrend(mockReq, mockRes, mockNextObject.next);

    expect(mockClientQuery).toHaveBeenCalledWith({
      text: "update trends set name = $1::text, type = $2::text where id = $3::integer",
      values: ["Updated Trend", "negative", 1],
    });
    expect(mockResJsonSpy).toHaveBeenCalledWith({ success: true });
  });

  it("should delete a trend successfully", async () => {
    const mockReq = {
      params: { trend_id: 1 },
      pool: mockPool,
    };

    const mockRes = {
      json: jest.fn(),
    };
    const mockResJsonSpy = jest.spyOn(mockRes, "json");
    const mockNextObject = { next: jest.fn() };
    const mockClientQuery = mockPool.query;

    await deleteTrend(mockReq, mockRes, mockNextObject.next);

    expect(mockClientQuery).toHaveBeenCalledWith({
      text: "delete from trends where id = $1::integer",
      values: [1],
    });
    expect(mockResJsonSpy).toHaveBeenCalledWith({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
