import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import commentsController from "../controllers/commentsController";

const router = express.Router();

router.get("/", commentsController.getAll.bind(commentsController));
router.get("/:id", commentsController.getById.bind(commentsController));
router.post("/", commentsController.create.bind(commentsController));
router.put("/:id", commentsController.update.bind(commentsController));
router.delete("/:id", commentsController.del.bind(commentsController));

export default router;
