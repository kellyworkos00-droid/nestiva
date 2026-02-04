import { User } from '../types/index';
/**
 * User model - Database query functions
 */
/**
 * Find user by email
 */
export declare const findUserByEmail: (email: string) => Promise<User | null>;
/**
 * Find user by ID
 */
export declare const findUserById: (userId: string) => Promise<User | null>;
/**
 * Create new user
 */
export declare const createUser: (userData: {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    user_type: "guest" | "host" | "both";
}) => Promise<User>;
/**
 * Update user profile
 */
export declare const updateUserProfile: (userId: string, updates: Partial<User>) => Promise<User>;
/**
 * Update user verification status
 */
export declare const updateVerificationStatus: (userId: string, status: "pending" | "verified" | "rejected") => Promise<User>;
/**
 * Update user verification document
 */
export declare const updateVerificationDocument: (userId: string, documentUrl: string) => Promise<User>;
/**
 * Increment user response rate
 */
export declare const updateResponseMetrics: (userId: string, responseTimeHours: number) => Promise<User>;
/**
 * Soft delete user
 */
export declare const softDeleteUser: (userId: string) => Promise<void>;
/**
 * Search users by name or email (for public profiles)
 */
export declare const searchUsers: (query: string, limit?: number, offset?: number) => Promise<{
    users: User[];
    total: number;
}>;
/**
 * Get user trust score and statistics
 */
export declare const getUserTrustStats: (userId: string) => Promise<{
    trustScore: number;
    responseRate: number;
    isSuperhost: boolean;
    reviewCount: number;
    averageRating: number;
} | null>;
//# sourceMappingURL=userModel.d.ts.map