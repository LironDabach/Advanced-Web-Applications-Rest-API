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
const baseController_1 = __importDefault(require("../controllers/baseController"));
const postsModel_1 = __importDefault(require("../models/postsModel"));
class PostsController extends baseController_1.default {
    constructor() {
        super(postsModel_1.default);
    }
    // Override create method to associate post with authenticated user
    create(req, res) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user) {
                req.body.senderID = req.user._id; // Associate post with user ID from token
            }
            return _super.create.call(this, req, res);
        });
    }
    // Override delete method to allow only creator to delete the post
    del(req, res) {
        const _super = Object.create(null, {
            del: { get: () => super.del }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const post = yield this.model.findById(id);
                if (!post) {
                    res.status(404).send("Post not found");
                    return;
                }
                if (req.user && post.senderID.toString() === req.user._id) {
                    _super.del.call(this, req, res);
                    return;
                }
                else {
                    res.status(403).send("Forbidden: Not the creator of the post");
                    return;
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Error: Can't delete post");
            }
        });
    }
    // Override update method to allow only creator to update the post
    update(req, res) {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const post = yield this.model.findById(id);
                if (!post) {
                    res.status(404).send("Error: Post not found");
                    return;
                }
                if (req.body.senderID && req.body.senderID !== post.senderID.toString()) {
                    res.status(400).send("Error: Cannot change creator of the post");
                    return;
                }
                if (req.user && post.senderID.toString() !== req.user._id) {
                    res.status(403).send("Forbidden: Not the creator of the post");
                    return;
                }
                _super.update.call(this, req, res);
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Error: Can't update post");
            }
        });
    }
}
exports.default = new PostsController();
//# sourceMappingURL=postsController.js.map