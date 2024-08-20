import { expect } from "chai";
import sinon from "sinon";
// import supertest from "supertest";

import pg from "pg";
const { Pool, Client } = pg;

// import app from "../../app";
import { updateEvidenceExpressFunc } from "../evidenceFunctions.js";
import { after } from "mocha";

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
const mockClient = {
  query: async ({ text, values }) => {
    console.log("*** mockClient.query called with: ", text, values);
    switch (text) {
      case "delete from evidence where story_id = $1::integer":
        return {};
      case text.match("update evidence set")?.input:
        return {};
      case text.match("insert into evidence")?.input:
        const match = text.match(
          /insert into evidence\W+\((.*)\)\W+values \((.*)\)\W+returning */
        );
        const columns = match[1].split(",");
        if (
          columns
            .map((column) => column.trim().trimStart())
            .some((column) => !VALID_FIELDS.includes(column))
        ) {
          throw new Error(INVALID_COLUMNS_MESSAGE);
        }
        const retObj = {};
        const values = match[2].split(",");
        columns.forEach((column, i) => {
          retObj[column.trim().trimStart()] = values[i].trim().trimStart();
        });
        retObj.id = 1;
        return {
          rows: [retObj],
        };
      case text.match("from trends")?.input:
        return [];
      case text.match("insert into trends")?.input:
        return {};
      default:
        throw new Error("Unrecognized query");
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
        reqWithValidItemKey = {
          ...REQ_BASE,
          [VALID_ITEM_KEY]: VALID_ITEM_KEY_VALUE,
        };
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
        sinon.assert.calledOnce(mockClientQuerySpy); // TODO: withMatch regex not working
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
            await route(
              {
                ...reqWithValidItemKey,
                body: [invalidRecord],
              },
              mockRes,
              mockNextObject.next
            );
            sinon.assert.calledOnce(mockClientQuerySpy);
            sinon.assert.calledOnce(mockClientReleaseSpy);
            sinon.assert.notCalled(mockResJsonSpy);
            sinon.assert.calledOnce(mockNextSpy); // TODO: withMatch regex not working
          });
          describe("working correctly with valid fields", () => {
            it("successfully inserts new records", async () => {
              await route(
                {
                  ...reqWithValidItemKey,
                  body: [{ name: "asdf" }, { name: "asdf2" }],
                  story_id: 2,
                },
                mockRes,
                mockNextObject.next
              );
              sinon.assert.calledTwice(mockClientQuerySpy);
              expect(await mockClientQuerySpy.returnValues[0]).to.deep.equal({
                rows: [
                  {
                    id: 1,
                    name: "'asdf'",
                    story_id: "$1::integer",
                    created_date: "current_timestamp",
                    modified_date: "current_timestamp",
                  },
                ],
              });
              expect(await mockClientQuerySpy.returnValues[1]).to.deep.equal({
                rows: [
                  {
                    id: 1,
                    name: "'asdf2'",
                    story_id: "$1::integer",
                    created_date: "current_timestamp",
                    modified_date: "current_timestamp",
                  },
                ],
              });
              sinon.assert.calledOnce(mockClientReleaseSpy);
              sinon.assert.calledOnce(mockResJsonSpy);
              sinon.assert.notCalled(mockNextSpy);
            });
            it("successfully updates existing records", async () => {
              await route(
                {
                  ...reqWithValidItemKey,
                  body: [{ name: "asdf", id: 1 }],
                  story_id: 2,
                },
                mockRes,
                mockNextObject.next
              );
              sinon.assert.calledOnce(mockClientQuerySpy);
              sinon.assert.calledOnce(mockClientReleaseSpy);
              sinon.assert.calledOnce(mockResJsonSpy);
              sinon.assert.notCalled(mockNextSpy);
            });
            describe("successfully inserts new trends", () => {
              it("successfully inserts new trends after inserting new evidence", async () => {
                await route(
                  {
                    ...reqWithValidItemKey,
                    body: [{ name: "asdf", trends: [{ name: "asdf2" }] }],
                    story_id: 2,
                  },
                  mockRes,
                  mockNextObject.next
                );
                sinon.assert.called(mockClientQuerySpy);
                expect(await mockClientQuerySpy.returnValues[0]).to.deep.equal({
                  rows: [
                    {
                      id: 1,
                      name: "'asdf'",
                      story_id: "$1::integer",
                      created_date: "current_timestamp",
                      modified_date: "current_timestamp",
                    },
                  ],
                });
                sinon.assert.calledThrice(mockClientQuerySpy);
                sinon.assert.calledOnce(mockClientReleaseSpy);
                sinon.assert.calledOnce(mockResJsonSpy);
                sinon.assert.notCalled(mockNextSpy);
              });
              it("successfully inserts new trends after updating existing evidence", async () => {
                await route(
                  {
                    ...reqWithValidItemKey,
                    body: [
                      { id: 1, name: "asdf", trends: [{ name: "asdf2" }] },
                    ],
                    story_id: 2,
                  },
                  mockRes,
                  mockNextObject.next
                );
                sinon.assert.calledThrice(mockClientQuerySpy);
                sinon.assert.calledOnce(mockClientReleaseSpy);
                sinon.assert.calledOnce(mockResJsonSpy);
                sinon.assert.notCalled(mockNextSpy);
              });
            });
            it("successfully updates existing trends", async () => {
              await route(
                {
                  ...reqWithValidItemKey,
                  body: [{ name: "asdf", trends: [{ name: "asdf2", id: 1 }] }],
                  story_id: 2,
                },
                mockRes,
                mockNextObject.next
              );
              sinon.assert.calledThrice(mockClientQuerySpy);
              sinon.assert.calledOnce(mockClientReleaseSpy);
              sinon.assert.calledOnce(mockResJsonSpy);
              sinon.assert.notCalled(mockNextSpy);
            });
          });
        });
      });
    });
    afterEach(() => {
      sinon.restore();
    });
  });
});
