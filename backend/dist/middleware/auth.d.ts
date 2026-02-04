import { Request, Response, NextFunction } from 'express';
/**
 * Require authentication middleware
 * Throws 401 if token is missing or invalid
 */
export declare const requireAuthMiddleware: (req: Request, res: Response, next: NextFunction) => any;
/**
 * Optional authentication middleware
 * Continues without error if token is missing or invalid
 */
export declare const optionalAuthMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map