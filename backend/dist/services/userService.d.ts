import { User } from '../types/index';
/**
 * User Service - Handles user profile operations
 */
/**
 * Get user profile by ID
 */
export declare const getUserProfile: (userId: string) => Promise<User>;
/**
 * Get user public profile
 */
export declare const getUserPublicProfile: (userId: string) => Promise<Omit<User, "password_hash" | "verification_document_url"> | null>;
/**
 * Update user profile
 */
export declare const updateProfile: (userId: string, updates: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    phone_number?: string;
    response_time_hours?: number;
}) => Promise<User>;
/**
 * Update profile picture
 */
export declare const updateProfilePicture: (userId: string, pictureUrl: string) => Promise<User>;
/**
 * Get user trust and reputation stats
 */
export declare const getUserReputation: (userId: string) => Promise<{
    user: User;
    stats: {
        trustScore: number;
        responseRate: number;
        isSuperhost: boolean;
        reviewCount: number;
        averageRating: number;
    };
} | null>;
/**
 * Get user listing count
 */
export declare const getUserListingCount: (userId: string) => Promise<number>;
/**
 * Get user booking history
 */
export declare const getUserBookingCount: (userId: string) => Promise<{
    total: number;
    completed: number;
    upcoming: number;
}>;
/**
 * Search users
 */
export declare const search: (query: string, limit?: number, offset?: number) => Promise<{
    users: User[];
    total: number;
}>;
/**
 * Get user followers count
 */
export declare const getUserFollowersCount: (userId: string) => Promise<number>;
/**
 * Get user following count
 */
export declare const getUserFollowingCount: (userId: string) => Promise<number>;
//# sourceMappingURL=userService.d.ts.map