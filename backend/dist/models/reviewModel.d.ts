/**
 * Review Model
 * Database operations for reviews and ratings
 */
export interface Review {
    id: string;
    booking_id: string;
    listing_id: string;
    reviewer_id: string;
    reviewee_id: string;
    review_type: 'guest_to_host' | 'host_to_guest';
    overall_rating: number;
    cleanliness_rating?: number;
    accuracy_rating?: number;
    communication_rating?: number;
    location_rating?: number;
    value_rating?: number;
    check_in_rating?: number;
    review_text: string;
    response_text?: string;
    response_at?: Date;
    is_published: boolean;
    is_flagged: boolean;
    flag_reason?: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateReviewData {
    booking_id: string;
    listing_id: string;
    reviewer_id: string;
    reviewee_id: string;
    review_type: 'guest_to_host' | 'host_to_guest';
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
 * Find review by ID
 */
export declare function findReviewById(reviewId: string): Promise<Review | null>;
/**
 * Find review by booking and reviewer
 */
export declare function findReviewByBookingAndReviewer(bookingId: string, reviewerId: string): Promise<Review | null>;
/**
 * Find all reviews for a listing
 */
export declare function findReviewsByListingId(listingId: string, options?: {
    onlyPublished?: boolean;
    limit?: number;
    offset?: number;
}): Promise<{
    reviews: Review[];
    total: number;
}>;
/**
 * Find reviews written by a user
 */
export declare function findReviewsByReviewerId(reviewerId: string, options?: {
    limit?: number;
    offset?: number;
}): Promise<{
    reviews: Review[];
    total: number;
}>;
/**
 * Find reviews received by a user (as host or guest)
 */
export declare function findReviewsByRevieweeId(revieweeId: string, options?: {
    reviewType?: 'guest_to_host' | 'host_to_guest';
    limit?: number;
    offset?: number;
}): Promise<{
    reviews: Review[];
    total: number;
}>;
/**
 * Create a new review
 */
export declare function createReview(reviewData: CreateReviewData): Promise<Review>;
/**
 * Update review response
 */
export declare function updateReviewResponse(reviewId: string, responseText: string): Promise<Review>;
/**
 * Flag a review for moderation
 */
export declare function flagReview(reviewId: string, reason: string): Promise<Review>;
/**
 * Unpublish a review
 */
export declare function unpublishReview(reviewId: string): Promise<Review>;
/**
 * Get average ratings for a listing (all categories)
 */
export declare function getListingAverageRatings(listingId: string): Promise<{
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
 * Get host's average rating from all their listings
 */
export declare function getHostAverageRating(hostId: string): Promise<{
    average_rating: number;
    total_reviews: number;
}>;
/**
 * Check if user can review a booking
 */
export declare function canUserReviewBooking(bookingId: string, userId: string): Promise<boolean>;
//# sourceMappingURL=reviewModel.d.ts.map