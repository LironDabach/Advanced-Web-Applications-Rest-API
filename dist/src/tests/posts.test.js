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
const index_1 = __importDefault(require("../../index"));
const postsModel_1 = __importDefault(require("../models/postsModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let app;
let authToken;
const userId = new mongoose_1.default.Types.ObjectId().toString();
let createdPostId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    jest.setTimeout(20000);
    app = yield (0, index_1.default)();
    yield postsModel_1.default.deleteMany({});
    const secret = process.env.JWT_SECRET || "default_secret";
    authToken = jsonwebtoken_1.default.sign({ _id: userId }, secret, { expiresIn: "1h" });
}));
afterAll((done) => {
    done();
});
describe("Posts CRUD API", () => {
    test("creates a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
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
    }));
    test("gets all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    test("gets a post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/post/${createdPostId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("_id", createdPostId);
    }));
    test("updates a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/post/${createdPostId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
            title: "Updated post",
            body: "Updated body",
        });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated post");
    }));
    test("deletes a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/post/${createdPostId}`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        const check = yield (0, supertest_1.default)(app).get(`/post/${createdPostId}`);
        expect(check.status).toBe(404);
    }));
});
//# sourceMappingURL=posts.test.js.map