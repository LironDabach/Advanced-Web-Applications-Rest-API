import request from "supertest";
import initApp from "../index";
import usersModel from "../models/usersModel";
import { Express } from "express";

let app: Express;

beforeAll(async () => 
  {
  jest.setTimeout(20000);
  app = await initApp();
  await usersModel.deleteMany({});
});

afterAll((done) => 
  {
  done();
});

describe("Auth API", () => 
  {
  const username = "test-user";
  const email = "liron.dabach3@gmail.com";
  const password = "StrongPass123!";
  let registerRefreshToken: string;
  let loginRefreshToken: string;
  let refreshedRefreshToken: string;

  test("register requires username, email and password", async () => 
    
    {
    const response = await request(app).post("/auth/register").send(
      {
      username,
      email,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("registers a user and returns tokens", async () => 
    {
    const response = await request(app).post("/auth/register").send(
      {
      username,
      email,
      password,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
    registerRefreshToken = response.body.refreshToken;

    const user = await usersModel.findOne({ username, email });
    expect(user).not.toBeNull();
    expect(user?.refreshTokens).toContain(registerRefreshToken);
  });

  test("logs in a user and returns new tokens", async () => 
    {
    const response = await request(app).post("/auth/login").send(
      {
      username,
      email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
    loginRefreshToken = response.body.refreshToken;
    expect(loginRefreshToken).not.toBe(registerRefreshToken);

    const user = await usersModel.findOne({ username, email });
    expect(user).not.toBeNull();
    expect(user?.refreshTokens).toContain(registerRefreshToken);
    expect(user?.refreshTokens).toContain(loginRefreshToken);
  });

  test("refreshes token and rotates refresh token", async () => 
    {
    const response = await request(app).post("/auth/refresh-token").send(
      {
      refreshToken: loginRefreshToken,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
    refreshedRefreshToken = response.body.refreshToken;
    expect(refreshedRefreshToken).not.toBe(loginRefreshToken);

    const user = await usersModel.findOne({ username, email });
    expect(user).not.toBeNull();
    expect(user?.refreshTokens).toContain(refreshedRefreshToken);
    expect(user?.refreshTokens).not.toContain(loginRefreshToken);
  });

  test("logout revokes refresh token", async () => 
    {
    const response = await request(app).post("/auth/logout").send(
      {
      refreshToken: refreshedRefreshToken,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");

    const user = await usersModel.findOne({ username, email });
    expect(user).not.toBeNull();
    expect(user?.refreshTokens).not.toContain(refreshedRefreshToken);

    const refreshAttempt = await request(app)
      .post("/auth/refresh-token")
      .send({ refreshToken: refreshedRefreshToken });
    expect(refreshAttempt.status).toBe(401);
  });
});
