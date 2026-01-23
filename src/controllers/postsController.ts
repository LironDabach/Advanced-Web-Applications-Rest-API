import postModel from "../models/postsModel";
import { Request, Response } from "express";
import baseController from "../controllers/baseController";
import postsModel from "../models/postsModel";
import { AuthRequest } from "../middleware/authMiddleware";

class PostsController extends baseController {
  constructor() {
    super(postsModel);
  }

  // Override create method to associate post with authenticated user
  async create(req: AuthRequest, res: Response) {
    if (req.user) {
      req.body.senderID = req.user._id; // Associate post with user ID from token
    }
    return super.create(req, res);
  }
  // Override delete method to allow only creator to delete the post
  async del(req: AuthRequest, res: Response) {
    const id = req.params.id;
    try {
      const post = await this.model.findById(id);
      if (!post) {
        res.status(404).send("Post not found");
        return;
      }
      if (req.user && post.creatredBy.toString() === req.user._id) {
        super.del(req, res);
        return;
      } else {
        res.status(403).send("Forbidden: Not the creator of the post");
        return;
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: Can't delete post");
    }
  }

  // Override update method to allow only creator to update the post
  async update(req: AuthRequest, res: Response) {
    const id = req.params.id;
    try {
      const post = await this.model.findById(id);
      if (!post) {
        res.status(404).send("Error: Post not found");
        return;
      }
      if (
        req.body.creatredBy &&
        req.body.creatredBy !== post.creatredBy.toString()
      ) {
        res.status(400).send("Error: Cannot change creator of the post");
        return;
      }
      super.update(req, res);
      return;
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: Can't update post");
    }
  }
}

export default new PostsController();
