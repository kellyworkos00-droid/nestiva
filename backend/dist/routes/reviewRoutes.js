/**
 * Review Routes
 * API endpoints for reviews and ratings
 */
import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { requireAuthMiddleware } from '../middleware/auth.js';
const router = express.Router();
// Create a review (authenticated)
router.post('/', requireAuthMiddleware, reviewController.createReview);
// Get pending reviews for authenticated user
router.get('/pending', requireAuthMiddleware, reviewController.getPendingReviews);
// Get reviews written by authenticated user
router.get('/my-reviews', requireAuthMiddleware, reviewController.getMyReviews);
// Check if user can review a specific booking
router.get('/booking/:bookingId/can-review', requireAuthMiddleware, reviewController.canReviewBooking);
// Get all reviews for a listing (public)
router.get('/listing/:listingId', reviewController.getListingReviews);
// Get rating breakdown for a listing (public)
router.get('/listing/:listingId/ratings', reviewController.getListingRatings);
// Get host's overall rating (public)
router.get('/host/:hostId/rating', reviewController.getHostRating);
// Get reviews received by a user (public)
router.get('/user/:userId/received', reviewController.getUserReviewsReceived);
// Get a single review (public)
router.get('/:reviewId', reviewController.getReview);
// Respond to a review (authenticated)
router.post('/:reviewId/respond', requireAuthMiddleware, reviewController.respondToReview);
// Flag a review for moderation (authenticated)
router.post('/:reviewId/flag', requireAuthMiddleware, reviewController.flagReview);
export default router;
//# sourceMappingURL=reviewRoutes.js.map