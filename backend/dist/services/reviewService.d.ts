/**
 * Review Service
 * Business logic for reviews and ratings
 */
import * as reviewModel from '../models/reviewModel.js';
interface CreateReviewInput {
    booking_id: string;
    overall_rating: number;
    cleanliness_rating?: number;
    accuracy_rating?: number;
    communication_rating?: number;
    location_rating?: number;
    value_rating?: number;
    check_in_rating?: number;
    review_text: string;
}
/**
 * Create a review for a booking
 */
export declare function createReview(reviewerId: string, reviewInput: CreateReviewInput): Promise<reviewModel.Review>;
/**
 * Get a single review by ID
 */
export declare function getReview(reviewId: string): Promise<reviewModel.Review>;
/**
 * Get all reviews for a listing
 */
export declare function getListingReviews(listingId: string, options?: {
    limit?: number;
    offset?: number;
}): Promise<{
    reviews: reviewModel.Review[];
    total: number;
}>;
/**
 * Get reviews written by a user
 */
export declare function getUserReviewsWritten(userId: string, options?: {
    limit?: number;
    offset?: number;
}): Promise<{
    reviews: reviewModel.Review[];
    total: number;
}>;
/**
 * Get reviews received by a user
 */
export declare function getUserReviewsReceived(userId: string, options?: {
    reviewType?: 'guest_to_host' | 'host_to_guest';
    limit?: number;
    offset?: number;
}): Promise<{
    reviews: reviewModel.Review[];
    total: number;
}>;
/**
 * Respond to a review
 */
export declare function respondToReview(reviewId: string, responderId: string, responseText: string): Promise<reviewModel.Review>;
/**
 * Flag a review for moderation
 */
export declare function flagReview(reviewId: string, userId: string, reason: string): Promise<reviewModel.Review>;
/**
 * Get detailed rating breakdown for a listing
 */
export declare function getListingRatings(listingId: string): Promise<{
    overall_rating: number;
    cleanliness_rating: number;
    accuracy_rating: number;
    communication_rating: number;
    location_rating: number;
    value_rating: number;
    check_in_rating: number;
    total_reviews: number;
}>;
/**
 * Get host's overall rating
 */
export declare function getHostRating(hostId: string): Promise<{
    average_rating: number;
    total_reviews: number;
}>;
/**
 * Check if user can review a specific booking
 */
export declare function canReviewBooking(bookingId: string, userId: string): Promise<{
    canReview: boolean;
    reason?: string;
}>;
/**
 * Get pending reviews for a user (bookings they can review)
 */
export declare function getPendingReviews(userId: string): Promise<any[]>;
export {};
//# sourceMappingURL=reviewService.d.ts.map