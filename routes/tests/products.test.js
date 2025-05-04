import request from "supertest";
import express from "express";
import router from "../products.js";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.pool = {
    query: jest
      .fn()
      .mockResolvedValue({ rows: [{ id: 1, name: "Test Product" }] }),
  };
  next();
});
app.use("/products", router);

describe("Products Routes", () => {
  describe("GET /products", () => {
    it("should return a list of products", async () => {
      const response = await request(app).get("/products");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, name: "Test Product" }]);
    });
  });

  describe("GET /products/:product_id", () => {
    it("should return a product by ID", async () => {
      const response = await request(app).get("/products/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });
  });

  describe("PUT /products/:product_id/:collection_name", () => {
    it("should update a product collection", async () => {
      const response = await request(app)
        .put("/products/1/personas")
        .send([{ id: 1, name: "Persona 1" }]);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, name: "Persona 1" }]);
    });
  });

  describe("DELETE /products/:product_id", () => {
    it("should delete a product", async () => {
      const response = await request(app).delete("/products/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });
  });
});
