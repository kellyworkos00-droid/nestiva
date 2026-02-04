import { JWTPayload } from '../types/index';
/**
 * Generate JWT access token
 */
export declare const generateAccessToken: (payload: JWTPayload) => string;
/**
 * Generate JWT refresh token
 */
export declare const generateRefreshToken: (payload: JWTPayload) => string;
/**
 * Verify access token
 */
export declare const verifyAccessToken: (token: string) => JWTPayload | null;
/**
 * Verify refresh token
 */
export declare const verifyRefreshToken: (token: string) => JWTPayload | null;
/**
 * Decode token without verification (for inspection)
 */
export declare const decodeToken: (token: string) => JWTPayload | null;
//# sourceMappingURL=jwt.d.ts.map