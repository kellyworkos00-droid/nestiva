import { Request, Response, NextFunction } from 'express';
/**
 * Auth Controller - Handles authentication requests
 */
/**
 * Register endpoint
 */
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Login endpoint
 */
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Send phone verification code
 */
export declare const sendPhoneCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Verify phone code
 */
export declare const verifyPhone: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Upload verification document
 */
export declare const uploadDocument: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Logout endpoint
 */
export declare const logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map