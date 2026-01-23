import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import postsController from "../controllers/postsController";

const router = express.Router();

router.get("/", postsController.getAll.bind(postsController));
router.get("/:id", postsController.getById.bind(postsController));
router.post("/", postsController.create.bind(postsController));
router.put("/:id", postsController.update.bind(postsController));
router.delete("/:id", postsController.del.bind(postsController));

export default router;
