import { Request, Response, NextFunction } from 'express';
/**
 * User Controller - Handles user profile requests
 */
/**
 * Get current user profile
 */
export declare const getMe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get user by ID
 */
export declare const getUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update profile
 */
export declare const updateMe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Upload profile picture
 */
export declare const uploadProfilePicture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get user reputation
 */
export declare const getReputation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Search users
 */
export declare const searchUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get user reviews
 */
export declare const getUserReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map