/**
 * Review Controller
 * HTTP handlers for review endpoints
 */
import * as reviewService from '../services/reviewService.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { ApiError } from '../utils/errors.js';
/**
 * Create a review for a booking
 * POST /reviews
 */
export async function createReview(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const { booking_id, overall_rating, cleanliness_rating, accuracy_rating, communication_rating, location_rating, value_rating, check_in_rating, review_text } = req.body;
        // Validate required fields
        if (!booking_id || !overall_rating || !review_text) {
            res.status(400).json(createErrorResponse('Missing required fields'));
            return;
        }
        const review = await reviewService.createReview(userId, {
            booking_id,
            overall_rating: parseFloat(overall_rating),
            cleanliness_rating: cleanliness_rating ? parseFloat(cleanliness_rating) : undefined,
            accuracy_rating: accuracy_rating ? parseFloat(accuracy_rating) : undefined,
            communication_rating: communication_rating ? parseFloat(communication_rating) : undefined,
            location_rating: location_rating ? parseFloat(location_rating) : undefined,
            value_rating: value_rating ? parseFloat(value_rating) : undefined,
            check_in_rating: check_in_rating ? parseFloat(check_in_rating) : undefined,
            review_text
        });
        res.status(201).json(createSuccessResponse({ review }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error creating review:', error);
            res.status(500).json(createErrorResponse('Failed to create review'));
        }
    }
}
/**
 * Get a single review
 * GET /reviews/:reviewId
 */
export async function getReview(req, res) {
    try {
        const { reviewId } = req.params;
        const review = await reviewService.getReview(reviewId);
        res.json(createSuccessResponse({ review }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching review:', error);
            res.status(500).json(createErrorResponse('Failed to fetch review'));
        }
    }
}
/**
 * Get all reviews for a listing
 * GET /reviews/listing/:listingId
 */
export async function getListingReviews(req, res) {
    try {
        const { listingId } = req.params;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const result = await reviewService.getListingReviews(listingId, {
            limit,
            offset
        });
        res.json(createSuccessResponse(result));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching listing reviews:', error);
            res.status(500).json(createErrorResponse('Failed to fetch listing reviews'));
        }
    }
}
/**
 * Get detailed ratings breakdown for a listing
 * GET /reviews/listing/:listingId/ratings
 */
export async function getListingRatings(req, res) {
    try {
        const { listingId } = req.params;
        const ratings = await reviewService.getListingRatings(listingId);
        res.json(createSuccessResponse({ ratings }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching listing ratings:', error);
            res.status(500).json(createErrorResponse('Failed to fetch listing ratings'));
        }
    }
}
/**
 * Get reviews written by the authenticated user
 * GET /reviews/my-reviews
 */
export async function getMyReviews(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const result = await reviewService.getUserReviewsWritten(userId, {
            limit,
            offset
        });
        res.json(createSuccessResponse(result));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching user reviews:', error);
            res.status(500).json(createErrorResponse('Failed to fetch user reviews'));
        }
    }
}
/**
 * Get reviews received by a user (about them as host or guest)
 * GET /reviews/user/:userId/received
 */
export async function getUserReviewsReceived(req, res) {
    try {
        const { userId } = req.params;
        const reviewType = req.query.reviewType;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const result = await reviewService.getUserReviewsReceived(userId, {
            reviewType,
            limit,
            offset
        });
        res.json(createSuccessResponse(result));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching user reviews received:', error);
            res.status(500).json(createErrorResponse('Failed to fetch user reviews'));
        }
    }
}
/**
 * Get host's overall rating
 * GET /reviews/host/:hostId/rating
 */
export async function getHostRating(req, res) {
    try {
        const { hostId } = req.params;
        const rating = await reviewService.getHostRating(hostId);
        res.json(createSuccessResponse({ rating }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching host rating:', error);
            res.status(500).json(createErrorResponse('Failed to fetch host rating'));
        }
    }
}
/**
 * Respond to a review
 * POST /reviews/:reviewId/respond
 */
export async function respondToReview(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const { reviewId } = req.params;
        const { response_text } = req.body;
        if (!response_text) {
            res.status(400).json(createErrorResponse('Response text is required'));
            return;
        }
        const review = await reviewService.respondToReview(reviewId, userId, response_text);
        res.json(createSuccessResponse({ review }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error responding to review:', error);
            res.status(500).json(createErrorResponse('Failed to respond to review'));
        }
    }
}
/**
 * Flag a review for moderation
 * POST /reviews/:reviewId/flag
 */
export async function flagReview(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const { reviewId } = req.params;
        const { reason } = req.body;
        if (!reason) {
            res.status(400).json(createErrorResponse('Flag reason is required'));
            return;
        }
        const review = await reviewService.flagReview(reviewId, userId, reason);
        res.json(createSuccessResponse({
            review,
            message: 'Review flagged for moderation'
        }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error flagging review:', error);
            res.status(500).json(createErrorResponse('Failed to flag review'));
        }
    }
}
/**
 * Check if user can review a booking
 * GET /reviews/booking/:bookingId/can-review
 */
export async function canReviewBooking(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const { bookingId } = req.params;
        const result = await reviewService.canReviewBooking(bookingId, userId);
        res.json(createSuccessResponse(result));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error checking review eligibility:', error);
            res.status(500).json(createErrorResponse('Failed to check review eligibility'));
        }
    }
}
/**
 * Get pending reviews for authenticated user
 * GET /reviews/pending
 */
export async function getPendingReviews(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const pendingReviews = await reviewService.getPendingReviews(userId);
        res.json(createSuccessResponse({
            pending_reviews: pendingReviews,
            count: pendingReviews.length
        }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching pending reviews:', error);
            res.status(500).json(createErrorResponse('Failed to fetch pending reviews'));
        }
    }
}
//# sourceMappingURL=reviewController.js.map