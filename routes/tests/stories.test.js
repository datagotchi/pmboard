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
jest.mock("../collectionItemFunctions", () => ({
  addItem: jest.fn().mockReturnValue(
    jest.fn().mockImplementation((req, res, next) => {
      res.sendStatus(200);
    })
  ),
  deleteItem: jest.fn().mockReturnValue(
    jest.fn().mockImplementation((req, res, next) => {
      res.sendStatus(200);
    })
  ),
}));
jest.mock("../evidenceFunctions", () => {
  const reusedFunc = jest.fn().mockReturnValue(
    jest.fn().mockImplementation((req, res, next) => {
      res.sendStatus(200);
    })
  );
  return {
    getEvidenceExpressFunc: reusedFunc,
    addEvidenceExpressFunc: reusedFunc,
    trackEvidenceIdExpressFunc: reusedFunc,
    deleteEvidenceExpressFunc: reusedFunc,
    addTrendExpressFunc: reusedFunc,
    updateTrendExpressFunc: reusedFunc,
    deleteTrendExpressFunc: reusedFunc,
  };
});

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
describe("GET /stories", () => {
  afterEach(() => {
    mockPoolQuery.mockReset();
  });

  it("should return stories with evidence and journey details", async () => {
    mockPoolQuery
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "Story 1" }] }) // Stories query
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "Evidence 1" }] }) // Evidence query
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "Trend 1" }] }) // Trends query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Journey query
      .mockResolvedValueOnce({ rows: [{ id: 1, step: "Step 1" }] }); // Journey steps query

    const res = await request(app).get("/stories");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 1,
        name: "Story 1",
        evidence: [
          {
            id: 1,
            name: "Evidence 1",
            trends: [{ id: 1, name: "Trend 1" }],
          },
        ],
        summary: {
          id: 1,
          steps: [{ id: 1, step: "Step 1" }],
        },
      },
    ]);
  });
});

describe("PUT /stories", () => {
  it("should update stories and return 200", async () => {
    mockPoolQuery.mockResolvedValueOnce({});

    const res = await request(app)
      .put("/stories")
      .send([{ id: 1, name: "Updated Story" }]);

    expect(res.status).toBe(200);
    expect(mockPoolQuery).toHaveBeenCalledWith({
      text: "update stories set name = 'Updated Story' where id = $1::integer",
      values: [1],
    });
  });
});

describe("POST /stories", () => {
  it("should call addItem function", async () => {
    await request(app).post("/stories");

    expect(collectionItemFunctions.addItem).toHaveBeenCalledWith("stories");
  });
});

describe("PUT /stories/:story_id", () => {
  it("should insert journey and steps if summary is provided", async () => {
    mockPoolQuery.mockReset(); // FIXME: I do this afterEach, but somehow needed to do it again?
    mockPoolQuery
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Insert journey
      .mockResolvedValueOnce({}); // Insert journey_steps

    const res = await request(app)
      .put("/stories/1")
      .send({
        summary: {
          steps: [
            {
              tagId: "tag1",
              tagClassName: "class1",
              tagText: "text1",
              x: "100",
              y: "200",
            },
          ],
        },
      });

    expect(res.status).toBe(200);
    expect(mockPoolQuery).toHaveBeenNthCalledWith(1, {
      text: "insert into journeys (story_id) values ($1::integer) returning *",
      values: ["1"],
    });
    expect(mockPoolQuery).toHaveBeenNthCalledWith(2, {
      text: `insert into journey_steps (journey_id, tag_id, tag_class_name, tag_text, x, y) 
          values ($1::integer, $2::text, $3::text, $4::text, $5::text, $6::text) 
          on conflict (journey_id, tag_id) do update 
            set tag_class_name = $3::text, x = $5::text, y = $6::text`,
      values: [1, "tag1", "class1", "text1", "100", "200"],
    });
  });

  it("should return 400 if summary is not provided", async () => {
    const res = await request(app).put("/stories/1").send({});

    expect(res.status).toBe(400);
  });
});

describe("DELETE /stories/:story_id", () => {
  it("should call deleteItem function", async () => {
    const deleteItemMock = jest.spyOn(collectionItemFunctions, "deleteItem");
    deleteItemMock.mockImplementation(() => {});

    await request(app).delete("/stories/1");

    expect(deleteItemMock).toHaveBeenCalledWith("stories", "story_id");
  });
});

describe("GET /stories/:story_id/evidence", () => {
  it("should call getEvidenceExpressFunc", async () => {
    const getEvidenceMock = jest.spyOn(
      evidenceFunctions,
      "getEvidenceExpressFunc"
    );
    getEvidenceMock.mockImplementation(() => {});

    await request(app).get("/stories/1/evidence");

    expect(getEvidenceMock).toHaveBeenCalledWith("stories", "story_id");
  });
});

describe("POST /stories/:story_id/evidence", () => {
  it("should call addEvidenceExpressFunc", async () => {
    const addEvidenceMock = jest.spyOn(
      evidenceFunctions,
      "addEvidenceExpressFunc"
    );
    addEvidenceMock.mockImplementation(() => {});

    await request(app).post("/stories/1/evidence");

    expect(addEvidenceMock).toHaveBeenCalledWith("story_id");
  });
});

describe("DELETE /stories/:story_id/evidence/:evidence_id", () => {
  it("should call deleteEvidenceExpressFunc", async () => {
    const deleteEvidenceMock = jest.spyOn(
      evidenceFunctions,
      "deleteEvidenceExpressFunc"
    );
    deleteEvidenceMock.mockImplementation(() => {});

    await request(app).delete("/stories/1/evidence/1");

    expect(deleteEvidenceMock).toHaveBeenCalled();
  });
});

describe("POST /stories/:story_id/evidence/:evidence_id/trends", () => {
  it("should call addTrendExpressFunc", async () => {
    const addTrendMock = jest.spyOn(evidenceFunctions, "addTrendExpressFunc");
    addTrendMock.mockImplementation(() => {});

    await request(app).post("/stories/1/evidence/1/trends");

    expect(addTrendMock).toHaveBeenCalledWith("stories", "story_id");
  });
});

describe("PUT /stories/:story_id/evidence/:evidence_id/trends/:trend_ix", () => {
  it("should call updateTrendExpressFunc", async () => {
    const updateTrendMock = jest.spyOn(
      evidenceFunctions,
      "updateTrendExpressFunc"
    );
    updateTrendMock.mockImplementation(() => {});

    await request(app).put("/stories/1/evidence/1/trends/1");

    expect(updateTrendMock).toHaveBeenCalledWith("stories", "story_id");
  });
});

describe("DELETE /stories/:story_id/evidence/:evidence_id/trends/:trend_ix", () => {
  it("should call deleteTrendExpressFunc", async () => {
    const deleteTrendMock = jest.spyOn(
      evidenceFunctions,
      "deleteTrendExpressFunc"
    );
    deleteTrendMock.mockImplementation(() => {});

    await request(app).delete("/stories/1/evidence/1/trends/1");

    expect(deleteTrendMock).toHaveBeenCalledWith("stories", "story_id");
  });
});
