/**
 * @jest-environment node
 */

import request from "supertest";
import express from "express";
import router from "../stories.js";
import { Pool } from "pg";
import * as collectionItemFunctions from "../collectionItemFunctions";
import * as evidenceFunctions from "../evidenceFunctions";

jest.mock("pg");
jest.mock("../collectionItemFunctions");
jest.mock("../evidenceFunctions");

const app = express();
app.use(express.json());
const mockPoolQuery = jest.fn();
app.use((req, res, next) => {
  req.pool = {
    query: mockPoolQuery,
  };
  next();
});
app.use("/stories", router);

describe("stories.js", () => {
  // let mockAddItem, mockUpdateItem, mockDeleteItem;
  // let mockGetEvidenceExpressFunc, mockAddEvidenceExpressFunc;
  // let mockTrackEvidenceIdExpressFunc, mockDeleteEvidenceExpressFunc;
  // let mockAddTrendExpressFunc,
  //   mockUpdateTrendExpressFunc,
  //   mockDeleteTrendExpressFunc;

  beforeEach(() => {
    // collectionItemFunctions.mockReturnValue({
    //   addItem: mockAddItem,
    //   updateItem: mockUpdateItem,
    //   deleteItem: mockDeleteItem,
    // });
    // evidenceFunctions.mockReturnValue({
    //   getEvidenceExpressFunc: mockGetEvidenceExpressFunc,
    //   addEvidenceExpressFunc: mockAddEvidenceExpressFunc,
    //   trackEvidenceIdExpressFunc: mockTrackEvidenceIdExpressFunc,
    //   deleteEvidenceExpressFunc: mockDeleteEvidenceExpressFunc,
    //   addTrendExpressFunc: mockAddTrendExpressFunc,
    //   updateTrendExpressFunc: mockUpdateTrendExpressFunc,
    //   deleteTrendExpressFunc: mockDeleteTrendExpressFunc,
    // });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call the correct query when getting stories", async () => {
    // const req = { pool: mockPool };
    mockPoolQuery.mockResolvedValue({ rows: [{ id: 1, name: "Test Story" }] });

    await request(app).get("/stories").expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "select * from stories",
      values: [],
    });
  });
  it("should call the correct query when updating stories", async () => {
    const req = {
      pool: new Pool(),
      body: [
        { id: 1, title: "Updated Story" },
        { id: 2, title: "Another Updated Story" },
      ],
    };

    await request(app).put("/stories").send(req.body[0]).expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "update stories set title = $1::text where id = $2::integer",
      values: ["Updated Story", 1],
    });
  });
  it("should call the correct query when adding a story", async () => {
    const req = {
      pool: new Pool(),
      body: { title: "New Story" },
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    await request(app).post("/stories").send(req.body).expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "insert into stories (title) values ($1::text) returning *",
      values: ["New Story"],
    });
  });
  it("should call the correct query when updating a story's summary", async () => {
    const req = {
      pool: new Pool(),
      story_id: 1,
      body: {
        summary: {
          id: 1,
          steps: [{ step: "Step 1" }, { step: "Step 2" }],
        },
      },
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    await request(app).put("/stories/1").send(req.body).expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "update journeys set steps = $1::json where id = $2::integer",
      values: [JSON.stringify([{ step: "Step 1" }, { step: "Step 2" }]), 1],
    });
  });
  it("should call the correct query when getting a story by ID", async () => {
    const req = {
      pool: new Pool(),
      params: { story_id: 1 },
    };
    const res = {
      json: jest.fn(),
    };
    const next = jest.fn();

    await request(app).get("/stories/1").expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "select * from stories where id = $1::integer",
      values: [1],
    });
  });
  it("should call the correct query when deleting a story", async () => {
    const req = {
      pool: new Pool(),
      params: { story_id: 1 },
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    await request(app).delete("/stories/1").expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "delete from stories where id = $1::integer",
      values: [1],
    });
  });
  it("should call the correct query when deleting a story's summary", async () => {
    const req = {
      pool: new Pool(),
      story_id: 1,
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    await request(app).delete("/stories/1/summary").expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "delete from journeys where story_id = $1::integer",
      values: [1],
    });
  });
  it("should call the correct query when deleting a story's steps", async () => {
    const req = {
      pool: new Pool(),
      story_id: 1,
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    await request(app).delete("/stories/1/steps").expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "delete from journey_steps where journey_id = $1::integer",
      values: [1],
    });
  });
  it("should call the correct query when deleting a story's evidence", async () => {
    const req = {
      pool: new Pool(),
      story_id: 1,
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    await request(app).delete("/stories/1/evidence").expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "delete from evidence where story_id = $1::integer",
      values: [1],
    });
  });
  it("should call the correct query when deleting a story's trends", async () => {
    const req = {
      pool: new Pool(),
      story_id: 1,
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    await request(app).delete("/stories/1/trends").expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "delete from trends where evidence_id = $1::integer",
      values: [1],
    });
  });
  it("should call the correct query when deleting a story's personas", async () => {
    const req = {
      pool: new Pool(),
      story_id: 1,
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    await request(app).delete("/stories/1/personas").expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "delete from personas where evidence_id = $1::integer",
      values: [1],
    });
  });
  it("should call the correct query when deleting a story's journeys", async () => {
    const req = {
      pool: new Pool(),
      story_id: 1,
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    await request(app).delete("/stories/1/journeys").expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "delete from journeys where story_id = $1::integer",
      values: [1],
    });
  });
  it("should call the correct query when deleting a story's journey steps", async () => {
    const req = {
      pool: new Pool(),
      story_id: 1,
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    await request(app).delete("/stories/1/journey_steps").expect(200);

    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "delete from journey_steps where journey_id = $1::integer",
      values: [1],
    });
  });
});
