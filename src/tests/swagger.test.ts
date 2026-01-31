import request from "supertest";
import initApp from "../index";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  jest.setTimeout(20000);
  app = await initApp();
});

afterAll((done) => {
  done();
});

describe("Swagger docs", () => {
  test("serves Swagger UI", async () => {
    const response = await request(app).get("/api-docs");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Swagger UI");
  });

  test("serves OpenAPI JSON", async () => {
    const response = await request(app).get("/api-docs.json");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("openapi");
    expect(response.body).toHaveProperty("info");
  });
});
