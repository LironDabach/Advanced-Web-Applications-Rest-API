import { Request, Response, NextFunction } from "express";
export type AuthRequest = Request & {
    user?: {
        _id: string;
    };
};
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authMiddleware.d.ts.map