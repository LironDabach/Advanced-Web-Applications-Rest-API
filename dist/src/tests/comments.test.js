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
const commentsModel_1 = __importDefault(require("../models/commentsModel"));
const postsModel_1 = __importDefault(require("../models/postsModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let app;
let authToken;
const userId = new mongoose_1.default.Types.ObjectId().toString();
let createdPostId;
let createdCommentId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    jest.setTimeout(20000);
    app = yield (0, index_1.default)();
    yield commentsModel_1.default.deleteMany({});
    yield postsModel_1.default.deleteMany({});
    const createdPost = yield postsModel_1.default.create({
        title: "Post for comments",
        body: "Seed post body",
        senderID: userId,
    });
    createdPostId = createdPost._id.toString();
    const secret = process.env.JWT_SECRET || "default_secret";
    authToken = jsonwebtoken_1.default.sign({ _id: userId }, secret, { expiresIn: "1h" });
}));
afterAll((done) => {
    done();
});
describe("Comments CRUD API", () => {
    test("creates a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
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
    }));
    test("gets all comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    test("gets all comments for a specific post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/comment?postID=${createdPostId}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach((comment) => {
            expect(comment.postID).toBe(createdPostId);
        });
    }));
    test("updates a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/comment/${createdCommentId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
            content: "Updated comment",
        });
        expect(response.status).toBe(200);
        expect(response.body.content).toBe("Updated comment");
    }));
    test("deletes a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/comment/${createdCommentId}`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        const check = yield (0, supertest_1.default)(app).get(`/comment?postID=${createdPostId}`);
        expect(check.status).toBe(200);
        const ids = check.body.map((comment) => comment._id);
        expect(ids).not.toContain(createdCommentId);
    }));
});
//# sourceMappingURL=comments.test.js.map