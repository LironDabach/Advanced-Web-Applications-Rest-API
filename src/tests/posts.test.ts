import request from "supertest";
import initApp from "../index";
import postsModel from "../models/postsModel";
import { Express } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let app: Express;
let authToken: string;
const userId = new mongoose.Types.ObjectId().toString();
let createdPostId: string;

beforeAll(async () => {
  jest.setTimeout(20000);
  app = await initApp();
  await postsModel.deleteMany({});
  const secret = process.env.JWT_SECRET || "default_secret";
  authToken = jwt.sign({ _id: userId }, secret, { expiresIn: "1h" });
});

afterAll((done) => {
  done();
});

describe("Posts CRUD API", () => {
  test("creates a post", async () => {
    const response = await request(app)
      .post("/post")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "First post",
        body: "Hello from tests",
        senderID: userId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe("First post");
    createdPostId = response.body._id;
  });

  test("gets all posts", async () => {
    const response = await request(app).get("/post");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("gets a post by id", async () => {
    const response = await request(app).get(`/post/${createdPostId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", createdPostId);
  });

  test("updates a post", async () => {
    const response = await request(app)
      .put(`/post/${createdPostId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Updated post",
        body: "Updated body",
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated post");
  });

  test("deletes a post", async () => {
    const response = await request(app)
      .delete(`/post/${createdPostId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);

    const check = await request(app).get(`/post/${createdPostId}`);
    expect(check.status).toBe(404);
  });
});
