"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const usersModel_1 = __importDefault(require("../models/usersModel"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    jest.setTimeout(20000);
    app = yield (0, index_1.default)();
    yield usersModel_1.default.deleteMany({});
}));
afterAll((done) => {
    done();
});
describe("Auth API", () => {
    const username = "test-user";
    const email = "liron.dabach3@gmail.com";
    const password = "StrongPass123!";
    let registerRefreshToken;
    let loginRefreshToken;
    let refreshedRefreshToken;
    test("register requires username, email and password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            username,
            email,
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("registers a user and returns tokens", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            username,
            email,
            password,
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        registerRefreshToken = response.body.refreshToken;
        const user = yield usersModel_1.default.findOne({ username, email });
        expect(user).not.toBeNull();
        expect(user === null || user === void 0 ? void 0 : user.refreshTokens).toContain(registerRefreshToken);
    }));
    test("logs in a user and returns new tokens", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            username,
            email,
            password,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        loginRefreshToken = response.body.refreshToken;
        expect(loginRefreshToken).not.toBe(registerRefreshToken);
        const user = yield usersModel_1.default.findOne({ username, email });
        expect(user).not.toBeNull();
        expect(user === null || user === void 0 ? void 0 : user.refreshTokens).toContain(registerRefreshToken);
        expect(user === null || user === void 0 ? void 0 : user.refreshTokens).toContain(loginRefreshToken);
    }));
    test("refreshes token and rotates refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh-token").send({
            refreshToken: loginRefreshToken,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        refreshedRefreshToken = response.body.refreshToken;
        expect(refreshedRefreshToken).not.toBe(loginRefreshToken);
        const user = yield usersModel_1.default.findOne({ username, email });
        expect(user).not.toBeNull();
        expect(user === null || user === void 0 ? void 0 : user.refreshTokens).toContain(refreshedRefreshToken);
        expect(user === null || user === void 0 ? void 0 : user.refreshTokens).not.toContain(loginRefreshToken);
    }));
    test("logout revokes refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send({
            refreshToken: refreshedRefreshToken,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
        const user = yield usersModel_1.default.findOne({ username, email });
        expect(user).not.toBeNull();
        expect(user === null || user === void 0 ? void 0 : user.refreshTokens).not.toContain(refreshedRefreshToken);
        const refreshAttempt = yield (0, supertest_1.default)(app)
            .post("/auth/refresh-token")
            .send({ refreshToken: refreshedRefreshToken });
        expect(refreshAttempt.status).toBe(401);
    }));
});
//# sourceMappingURL=auth.test.js.map