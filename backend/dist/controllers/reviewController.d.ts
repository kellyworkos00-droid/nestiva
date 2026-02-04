/**
 * Review Controller
 * HTTP handlers for review endpoints
 */
import { Request, Response } from 'express';
/**
 * Create a review for a booking
 * POST /reviews
 */
export declare function createReview(req: Request, res: Response): Promise<void>;
/**
 * Get a single review
 * GET /reviews/:reviewId
 */
export declare function getReview(req: Request, res: Response): Promise<void>;
/**
 * Get all reviews for a listing
 * GET /reviews/listing/:listingId
 */
export declare function getListingReviews(req: Request, res: Response): Promise<void>;
/**
 * Get detailed ratings breakdown for a listing
 * GET /reviews/listing/:listingId/ratings
 */
export declare function getListingRatings(req: Request, res: Response): Promise<void>;
/**
 * Get reviews written by the authenticated user
 * GET /reviews/my-reviews
 */
export declare function getMyReviews(req: Request, res: Response): Promise<void>;
/**
 * Get reviews received by a user (about them as host or guest)
 * GET /reviews/user/:userId/received
 */
export declare function getUserReviewsReceived(req: Request, res: Response): Promise<void>;
/**
 * Get host's overall rating
 * GET /reviews/host/:hostId/rating
 */
export declare function getHostRating(req: Request, res: Response): Promise<void>;
/**
 * Respond to a review
 * POST /reviews/:reviewId/respond
 */
export declare function respondToReview(req: Request, res: Response): Promise<void>;
/**
 * Flag a review for moderation
 * POST /reviews/:reviewId/flag
 */
export declare function flagReview(req: Request, res: Response): Promise<void>;
/**
 * Check if user can review a booking
 * GET /reviews/booking/:bookingId/can-review
 */
export declare function canReviewBooking(req: Request, res: Response): Promise<void>;
/**
 * Get pending reviews for authenticated user
 * GET /reviews/pending
 */
export declare function getPendingReviews(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=reviewController.d.ts.map