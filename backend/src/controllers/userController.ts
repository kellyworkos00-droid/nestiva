import { Request, Response, NextFunction } from 'express';
import { createSuccessResponse, createErrorResponse, ApiError } from '../utils/errors';
import {
  getUserProfile,
  getUserPublicProfile,
  updateProfile,
  updateProfilePicture,
  getUserReputation,
  search,
} from '../services/userService';

/**
 * User Controller - Handles user profile requests
 */

/**
 * Get current user profile
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user = await getUserProfile(userId);

    res.status(200).json(createSuccessResponse({ user }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Get user by ID
 */
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await getUserPublicProfile(userId);

    if (!user) {
      res.status(404).json(
        createErrorResponse(new ApiError(404, 'NOT_FOUND', 'User not found'), req.path)
      );
      return;
    }

    res.status(200).json(createSuccessResponse({ user }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Update profile
 */
export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { first_name, last_name, bio, phone_number, response_time_hours } = req.body;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user = await updateProfile(userId, {
      first_name,
      last_name,
      bio,
      phone_number,
      response_time_hours,
    });

    res.status(200).json(createSuccessResponse({ user }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { profile_picture_url } = req.body;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    if (!profile_picture_url) {
      throw new Error('Profile picture URL is required');
    }

    const user = await updateProfilePicture(userId, profile_picture_url);

    res.status(200).json(createSuccessResponse({ user }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Get user reputation
 */
export const getReputation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const result = await getUserReputation(userId);

    if (!result) {
      res.status(404).json(
        createErrorResponse(new ApiError(404, 'NOT_FOUND', 'User not found'), req.path)
      );
      return;
    }

    res.status(200).json(createSuccessResponse(result));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Search users
 */
export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q, limit = '20', offset = '0' } = req.query;

    if (!q) {
      throw new Error('Search query is required');
    }

    const result = await search(
      q as string,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json(createSuccessResponse(result));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Get user reviews
 */
export const getUserReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { limit = '20', offset = '0' } = req.query;

    // TODO: Implement review service and query
    res.status(200).json(
      createSuccessResponse({
        reviews: [],
        total: 0,
      })
    );
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};
