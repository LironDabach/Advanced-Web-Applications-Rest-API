"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postsController_1 = __importDefault(require("../controllers/postsController"));
const router = express_1.default.Router();
router.get("/", postsController_1.default.getAll.bind(postsController_1.default));
router.get("/:id", postsController_1.default.getById.bind(postsController_1.default));
router.post("/", postsController_1.default.create.bind(postsController_1.default));
router.put("/:id", postsController_1.default.update.bind(postsController_1.default));
router.delete("/:id", postsController_1.default.del.bind(postsController_1.default));
// router.post("/", authenticate, postsController.create.bind(postsController));
// router.put("/:id", authenticate, postsController.update.bind(postsController));
// router.delete("/:id", authenticate, postsController.del.bind(postsController));
exports.default = router;
//# sourceMappingURL=postsRoute.js.map