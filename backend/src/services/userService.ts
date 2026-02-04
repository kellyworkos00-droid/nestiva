import {
  findUserById,
  updateUserProfile,
  getUserTrustStats,
  searchUsers,
} from '../models/userModel';
import { NotFoundError } from '../utils/errors';
import { User } from '../types/index';

/**
 * User Service - Handles user profile operations
 */

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<User> => {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
};

/**
 * Get user public profile
 */
export const getUserPublicProfile = async (
  userId: string
): Promise<Omit<User, 'password_hash' | 'verification_document_url'> | null> => {
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
export const updateProfile = async (
  userId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    phone_number?: string;
    response_time_hours?: number;
  }
): Promise<User> => {
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
export const updateProfilePicture = async (
  userId: string,
  pictureUrl: string
): Promise<User> => {
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
export const getUserReputation = async (userId: string): Promise<{
  user: User;
  stats: {
    trustScore: number;
    responseRate: number;
    isSuperhost: boolean;
    reviewCount: number;
    averageRating: number;
  };
} | null> => {
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
export const getUserListingCount = async (userId: string): Promise<number> => {
  // This would typically query from the listings table
  // For now, placeholder
  return 0;
};

/**
 * Get user booking history
 */
export const getUserBookingCount = async (userId: string): Promise<{
  total: number;
  completed: number;
  upcoming: number;
}> => {
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
export const search = async (
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ users: User[]; total: number }> => {
  return await searchUsers(query, limit, offset);
};

/**
 * Get user followers count
 */
export const getUserFollowersCount = async (userId: string): Promise<number> => {
  // This would typically query from the follows table
  // For now, placeholder
  return 0;
};

/**
 * Get user following count
 */
export const getUserFollowingCount = async (userId: string): Promise<number> => {
  // This would typically query from the follows table
  // For now, placeholder
  return 0;
};
