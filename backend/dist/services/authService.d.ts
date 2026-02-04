import { User } from '../types/index';
interface RegisterPayload {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    user_type: 'guest' | 'host' | 'both';
}
interface LoginPayload {
    email: string;
    password: string;
}
interface AuthResponse {
    user: Omit<User, 'password_hash'>;
    token: string;
    refreshToken: string;
}
/**
 * Auth Service - Handles authentication operations
 */
/**
 * Register a new user
 */
export declare const registerUser: (payload: RegisterPayload) => Promise<AuthResponse>;
/**
 * Login user
 */
export declare const loginUser: (payload: LoginPayload) => Promise<AuthResponse>;
/**
 * Verify phone number
 */
export declare const sendPhoneVerificationCode: (phoneNumber: string) => Promise<string>;
/**
 * Verify phone code
 */
export declare const verifyPhoneCode: (userId: string, phoneNumber: string, code: string) => Promise<User>;
/**
 * Handle ID verification upload
 */
export declare const uploadVerificationDocument: (userId: string, documentUrl: string, documentType: string) => Promise<User>;
/**
 * Verify JWT token and get user
 */
export declare const verifyTokenAndGetUser: (userId: string) => Promise<User | null>;
export {};
//# sourceMappingURL=authService.d.ts.map