import { expect } from "chai";
import { before, beforeEach } from "mocha";
import sinon from "sinon";
import supertest from "supertest";

import pg from "pg";
const { Pool, Client } = pg;

import app from "../app.js";

const mockClient = {
  query: async ({ text }) => {
    console.log("*** mockClient.query called with: ", { text });
    switch (text) {
      // case "select * from questions where user_id = $1::integer":
      //   return { rows: mockQuestions };
      // case "select * from users where id = $1::integer":
      //   return { rows: [mockUser] };
      // case "select id from questions where user_id = $1::integer":
      //   return { rows: mockQuestions };
      // case "insert into jobs (user_id, email) values ($1::integer, $2::text) returning *":
      //   return { rows: [mockJob] };
      // case "insert into messages (job_id, question_id, value, sender) values ($1::integer, $2::integer, $3::text, $4::text)":
      //   return { rows: [] };
      default:
        throw new Error("Unrecognized query");
    }
  },
  release: () => {},
};

describe("stories.js", () => {
  let poolStub;
  before(() => {
    poolStub = sinon
      .stub(Pool.prototype, "connect")
      .callsFake(async () => mockClient);
  });
  let mockClientQuerySpy, mockClientReleaseSpy;
  beforeEach(() => {
    mockClientQuerySpy = sinon.spy(mockClient, "query");
    mockClientReleaseSpy = sinon.spy(mockClient, "release");
  });
  describe("PUT /:story_id", () => {
    it("does not insert a new journey when an ID is provided", async () => {
      await supertest(app)
        .put(`/products/2/stories/2`)
        .send({
          summary: { id: 1, steps: [{}] },
          story_id: 2,
        })
        .expect(200);
      sinon.assert.calledOnceWithMatch(
        mockClientQuerySpy,
        sinon.match({
          text: sinon.match(/insert into journey_steps.*/),
        })
      );
      sinon.assert.calledOnce(mockClientReleaseSpy);
    });
  });
  after(() => {
    poolStub.restore();
  });
});
