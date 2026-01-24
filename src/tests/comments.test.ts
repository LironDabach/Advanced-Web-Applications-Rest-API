import request from "supertest";
import initApp from "../index";
import commentsModel from "../models/commentsModel";
import postsModel from "../models/postsModel";
import { Express } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let app: Express;
let authToken: string;
const userId = new mongoose.Types.ObjectId().toString();
let createdPostId: string;
let createdCommentId: string;

beforeAll(async () => {
  jest.setTimeout(20000);
  app = await initApp();
  await commentsModel.deleteMany({});
  await postsModel.deleteMany({});
  const createdPost = await postsModel.create({
    title: "Post for comments",
    body: "Seed post body",
    senderID: userId,
  });
  createdPostId = createdPost._id.toString();
  const secret = process.env.JWT_SECRET || "default_secret";
  authToken = jwt.sign({ _id: userId }, secret, { expiresIn: "1h" });
});

afterAll((done) => {
  done();
});

describe("Comments CRUD API", () => {
  test("creates a comment", async () => {
    const response = await request(app)
      .post("/comment")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        postID: createdPostId,
        userID: userId,
        content: "First comment",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.content).toBe("First comment");
    createdCommentId = response.body._id;
  });

  test("gets all comments", async () => {
    const response = await request(app).get("/comment");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("gets all comments for a specific post", async () => {
    const response = await request(app).get(
      `/comment?postID=${createdPostId}`,
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((comment: { postID: string }) => {
      expect(comment.postID).toBe(createdPostId);
    });
  });

  test("updates a comment", async () => {
    const response = await request(app)
      .put(`/comment/${createdCommentId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        content: "Updated comment",
      });

    expect(response.status).toBe(200);
    expect(response.body.content).toBe("Updated comment");
  });

  test("deletes a comment", async () => {
    const response = await request(app)
      .delete(`/comment/${createdCommentId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);

    const check = await request(app).get(
      `/comment?postID=${createdPostId}`,
    );
    expect(check.status).toBe(200);
    const ids = check.body.map((comment: { _id: string }) => comment._id);
    expect(ids).not.toContain(createdCommentId);
  });
});
