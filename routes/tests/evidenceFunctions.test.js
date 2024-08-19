import { expect } from "chai";
import sinon from "sinon";
// import supertest from "supertest";

import pg from "pg";
const { Pool, Client } = pg;

// import app from "../../app";
import { updateEvidenceExpressFunc } from "../evidenceFunctions.js";
import { after } from "mocha";

const mockClient = {
  query: async ({ text, values }) => {
    switch (text) {
      case "delete from evidence where story_id = $1::integer":
        return {};
      case text.match("update evidence set .* where id = $1::integer"):
        return {};
      case text.match(
        "insert into evidence (.*, created_date, modified_date) values (.*, $1::integer, current_timestamp, current_timestamp) returning *"
      ):
        return {};
      // case "select value from tags where experience_id = $1::integer":
      //   return { rows: [] };
      default:
        throw new Error("Unrecognized query"); // TODO: does now show up from mocha; just fails
    }
  },
  release: () => {},
};

const mockRes = {
  json: (content) => {},
};

const mockNext = (err) => {};

describe("evidenceFunctions.js", () => {
  let poolStub,
    mockClientQuerySpy,
    mockClientReleaseSpy,
    mockResSpy,
    mockNextSpy;
  before(() => {
    poolStub = sinon
      .stub(Pool.prototype, "connect")
      .callsFake(async () => mockClient);
    mockClientQuerySpy = sinon.spy(mockClient, "query");
    mockClientReleaseSpy = sinon.spy(mockClient, "release");
    mockResSpy = sinon.spy(mockRes, "json");
    mockNextSpy = sinon.spy(mockNext);
  });
  describe("updateEvidenceExpressFunc", () => {
    it("responds correctly to invalid itemKey", () => {
      const INVALID_ITEM_KEY = "asdf";
      const INVALID_REQ = {};
      const route = updateEvidenceExpressFunc(INVALID_ITEM_KEY);
      route(INVALID_REQ, mockRes, mockNext);
      mockClientQuerySpy.notCalled;
      mockClientReleaseSpy.calledOnce;
      mockResSpy.notCalled;
      mockNextSpy.calledOnce;
    });
    describe("it working correctly with a valid itemKey", () => {
      const VALID_ITEM_KEY = "story_id";
      const route = updateEvidenceExpressFunc(VALID_ITEM_KEY);
      const REQ_WITH_VALID_ITEM_KEY = {
        [VALID_ITEM_KEY]: 2,
      };
      it("deletes records when the new evidence is an empty array", () => {
        route(
          {
            ...REQ_WITH_VALID_ITEM_KEY,
            body: [],
          },
          mockRes,
          mockNext
        );
        mockClient.query.calledWithMatch("delete from evidence");
        mockClient.release.calledOnce;
        mockRes.json.calledOnce;
        mockNext.notCalled;
      });

      //   records length > 0
      //     update existing record(s)
      //       invalid fields
      //       valid fields
      //     insert new record(s)
      //       invalid fields
      //       valid fields
      //     insert new trend(s)
      //       invalid fields
      //       valid fields
      //     update existing trend(s)
      //       invalid fields
      //       valid fields
    });
    after(() => {});
  });
});
