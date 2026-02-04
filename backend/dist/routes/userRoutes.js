import express from 'express';
import * as userController from '../controllers/userController';
import { optionalAuthMiddleware, requireAuthMiddleware } from '../middleware/auth';
const router = express.Router();
/**
 * User Routes
 * Base: /api/v1/users
 */
// Get current user (protected)
router.get('/me', requireAuthMiddleware, userController.getMe);
// Update user profile (protected)
router.put('/me', requireAuthMiddleware, userController.updateMe);
// Upload profile picture (protected)
router.post('/me/profile-picture', requireAuthMiddleware, userController.uploadProfilePicture);
// Get user by ID (public)
router.get('/:userId', optionalAuthMiddleware, userController.getUser);
// Get user reputation (public)
router.get('/:userId/reputation', optionalAuthMiddleware, userController.getReputation);
// Get user reviews (public)
router.get('/:userId/reviews', optionalAuthMiddleware, userController.getUserReviews);
// Search users (public)
router.get('/search', optionalAuthMiddleware, userController.searchUsers);
export default router;
//# sourceMappingURL=userRoutes.js.map