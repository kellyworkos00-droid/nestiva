import { findUserById, updateUserProfile, getUserTrustStats, searchUsers, } from '../models/userModel';
import { NotFoundError } from '../utils/errors';
/**
 * User Service - Handles user profile operations
 */
/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new NotFoundError('User');
    }
    return user;
};
/**
 * Get user public profile
 */
export const getUserPublicProfile = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        return null;
    }
    const { password_hash, verification_document_url, ...publicUser } = user;
    return publicUser;
};
/**
 * Update user profile
 */
export const updateProfile = async (userId, updates) => {
    // Validate updates
    if (updates.first_name && !updates.first_name.trim()) {
        throw new Error('First name cannot be empty');
    }
    if (updates.last_name && !updates.last_name.trim()) {
        throw new Error('Last name cannot be empty');
    }
    if (updates.bio && updates.bio.length > 500) {
        throw new Error('Bio cannot exceed 500 characters');
    }
    const user = await updateUserProfile(userId, updates);
    return user;
};
/**
 * Update profile picture
 */
export const updateProfilePicture = async (userId, pictureUrl) => {
    // In production, upload to S3 or CDN
    // For now, just store the URL
    const user = await updateUserProfile(userId, {
        profile_picture_url: pictureUrl,
    });
    return user;
};
/**
 * Get user trust and reputation stats
 */
export const getUserReputation = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        return null;
    }
    const stats = await getUserTrustStats(userId);
    if (!stats) {
        return null;
    }
    return { user, stats };
};
/**
 * Get user listing count
 */
export const getUserListingCount = async (userId) => {
    // This would typically query from the listings table
    // For now, placeholder
    return 0;
};
/**
 * Get user booking history
 */
export const getUserBookingCount = async (userId) => {
    // This would typically query from the bookings table
    // For now, placeholder
    return {
        total: 0,
        completed: 0,
        upcoming: 0,
    };
};
/**
 * Search users
 */
export const search = async (query, limit = 20, offset = 0) => {
    return await searchUsers(query, limit, offset);
};
/**
 * Get user followers count
 */
export const getUserFollowersCount = async (userId) => {
    // This would typically query from the follows table
    // For now, placeholder
    return 0;
};
/**
 * Get user following count
 */
export const getUserFollowingCount = async (userId) => {
    // This would typically query from the follows table
    // For now, placeholder
    return 0;
};
//# sourceMappingURL=userService.js.map