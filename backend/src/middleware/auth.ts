import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

/**
 * Require authentication middleware
 * Throws 401 if token is missing or invalid
 */
export const requireAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Authorization token required',
        },
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
        },
      });
    }

    (req as any).user = {
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
    };

    (req as any).token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed',
      },
    });
  }
};

/**
 * Optional authentication middleware
 * Continues without error if token is missing or invalid
 */
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const decoded = verifyAccessToken(token);

      if (decoded) {
        (req as any).user = {
          userId: decoded.userId,
          email: decoded.email,
          userType: decoded.userType,
        };

        (req as any).token = token;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
