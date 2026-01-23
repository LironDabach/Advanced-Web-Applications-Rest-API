import { Request, Response } from "express";
declare class BaseController {
    model: any;
    constructor(model: any);
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response): Promise<void>;
    del(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
}
export default BaseController;
//# sourceMappingURL=baseController.d.ts.map