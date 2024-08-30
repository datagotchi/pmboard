import { expect } from "chai";
import sinon from "sinon";
// import supertest from "supertest";

import pg from "pg";
const { Pool, Client } = pg;

// import app from "../../app";
import {} from "../routes/evidenceFunctions.js";
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
});
