import { Response } from "express";
import baseController from "../controllers/baseController";
import { AuthRequest } from "../middleware/authMiddleware";
declare class PostsController extends baseController {
    constructor();
    create(req: AuthRequest, res: Response): Promise<void>;
    del(req: AuthRequest, res: Response): Promise<void>;
    update(req: AuthRequest, res: Response): Promise<void>;
}
declare const _default: PostsController;
export default _default;
//# sourceMappingURL=postsController.d.ts.map