import { Request, Response, NextFunction } from 'express';
import { createSuccessResponse, createErrorResponse, ApiError } from '../utils/errors';
import {
  registerUser,
  loginUser,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  uploadVerificationDocument,
} from '../services/authService';

/**
 * Auth Controller - Handles authentication requests
 */

/**
 * Register endpoint
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, first_name, last_name, user_type } = req.body;

    const result = await registerUser({
      email,
      password,
      first_name,
      last_name,
      user_type,
    });

    res.status(201).json(
      createSuccessResponse({
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken,
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

/**
 * Login endpoint
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await loginUser({
      email,
      password,
    });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json(
      createSuccessResponse({
        user: result.user,
        token: result.token,
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

/**
 * Send phone verification code
 */
export const sendPhoneCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      throw new Error('Phone number is required');
    }

    const code = await sendPhoneVerificationCode(phone_number);

    res.status(200).json(
      createSuccessResponse({
        message: 'Verification code sent',
        // In production, don't return the code to client
        code: process.env.NODE_ENV === 'development' ? code : undefined,
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

/**
 * Verify phone code
 */
export const verifyPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { phone_number, code } = req.body;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user = await verifyPhoneCode(userId, phone_number, code);

    res.status(200).json(
      createSuccessResponse({
        user,
        message: 'Phone number verified',
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

/**
 * Upload verification document
 */
export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { document_url, document_type } = req.body;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    if (!document_url || !document_type) {
      throw new Error('Document URL and type are required');
    }

    const user = await uploadVerificationDocument(userId, document_url, document_type);

    res.status(200).json(
      createSuccessResponse({
        user,
        message: 'Document uploaded for verification',
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

/**
 * Logout endpoint
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.status(200).json(
      createSuccessResponse({
        message: 'Logged out successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};
