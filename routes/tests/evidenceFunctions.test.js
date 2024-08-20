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
    console.log("*** match: ", text.match("insert into evidence"));
    console.log("*** mockClient.query called with: ", text, values);
    switch (text) {
      case "delete from evidence where story_id = $1::integer":
        return {};
      case text.match("update evidence set .* where id = $1::integer"):
        return {};
      case text.match("insert into evidence").input:
        return {};
      // case "select value from tags where experience_id = $1::integer":
      //   return { rows: [] };
      default:
        throw new Error("Unrecognized query"); // TODO: does now show up from mocha; just fails
    }
  },
  release: () => {
    console.log("*** mockClient.release called");
  },
};

const mockRes = {
  json: (content) => {},
};

// below: because sinon spying on standalone functions DOES NOT WORK, so I have to put it in an object
const mockNextObject = {
  next: (err) => {
    console.log("*** mockNextObject.next called with: ", err);
  },
};

describe("evidenceFunctions.js", () => {
  let mockClientQuerySpy, mockClientReleaseSpy, mockResJsonSpy, mockNextSpy;
  let REQ_BASE;
  beforeEach(() => {
    REQ_BASE = {
      client: mockClient,
    };
    mockClientQuerySpy = sinon.spy(mockClient, "query");
    mockClientReleaseSpy = sinon.spy(mockClient, "release");
    mockResJsonSpy = sinon.spy(mockRes, "json");
    mockNextSpy = sinon.spy(mockNextObject, "next");
  });
  describe("updateEvidenceExpressFunc", () => {
    it("responds correctly to invalid itemKey", async () => {
      const INVALID_ITEM_KEY = "asdf";
      const INVALID_REQ = { ...REQ_BASE };
      const route = updateEvidenceExpressFunc(INVALID_ITEM_KEY);
      await route(INVALID_REQ, mockRes, mockNextObject.next);
      sinon.assert.notCalled(mockClientQuerySpy);
      sinon.assert.calledOnce(mockClientReleaseSpy);
      sinon.assert.notCalled(mockResJsonSpy);
      sinon.assert.calledOnceWithMatch(mockNextSpy, "Missing arguments");
    });
    let reqWithValidItemKey;
    describe("working correctly with a valid itemKey", () => {
      const VALID_ITEM_KEY = "story_id";
      const VALID_ITEM_KEY_VALUE = 2;
      let route;
      beforeEach(() => {
        console.log(
          "*** recreating reqWithValidItemKey with",
          REQ_BASE,
          VALID_ITEM_KEY,
          VALID_ITEM_KEY_VALUE
        );
        reqWithValidItemKey = {
          ...REQ_BASE,
          [VALID_ITEM_KEY]: VALID_ITEM_KEY_VALUE,
        };
      });
      beforeEach(() => {
        route = updateEvidenceExpressFunc(VALID_ITEM_KEY);
      });
      it("deletes records when the new evidence is an empty array", async () => {
        await route(
          {
            ...reqWithValidItemKey,
            body: [],
          },
          mockRes,
          mockNextObject.next
        );
        sinon.assert.calledOnce(mockClientQuerySpy); // FAILS
        sinon.assert.calledOnce(mockClientReleaseSpy);
        sinon.assert.calledOnce(mockResJsonSpy);
        sinon.assert.notCalled(mockNextSpy);
      });
      describe("working correctly with records.length > 0", () => {
        describe("working correctly updating existing records", () => {
          it("responds correctly to invalid fields", async () => {
            const INVALID_FIELDS = ["a", "b", "c"];
            const invalidRecord = INVALID_FIELDS.reduce((obj, field) => {
              obj[field] = Math.floor(Math.random() * 10);
              return obj;
            }, {});
            await route({
              ...reqWithValidItemKey,
              body: [invalidRecord],
            });
            sinon.assert.calledOnce(mockClientQuerySpy);
            sinon.assert.calledOnce(mockClientReleaseSpy);
            sinon.assert.notCalled(mockResJsonSpy);
            sinon.assert.calledOnce(mockNextSpy);
          });
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
      });
    });
    afterEach(() => {
      sinon.restore();
    });
  });
});
