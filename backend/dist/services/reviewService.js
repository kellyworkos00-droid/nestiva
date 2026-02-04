/**
 * Review Service
 * Business logic for reviews and ratings
 */
import * as reviewModel from '../models/reviewModel.js';
import * as bookingModel from '../models/bookingModel.js';
import * as listingModel from '../models/listingModel.js';
import * as userModel from '../models/userModel.js';
import { NotFoundError, UnauthorizedError, ValidationError, BadRequestError } from '../utils/errors.js';
/**
 * Create a review for a booking
 */
export async function createReview(reviewerId, reviewInput) {
    const { booking_id, ...ratings } = reviewInput;
    // Validate ratings (1-5 scale)
    const ratingFields = [
        'overall_rating',
        'cleanliness_rating',
        'accuracy_rating',
        'communication_rating',
        'location_rating',
        'value_rating',
        'check_in_rating'
    ];
    for (const field of ratingFields) {
        const value = ratings[field];
        if (value !== undefined && (value < 1 || value > 5)) {
            throw new ValidationError(`${field} must be between 1 and 5`);
        }
    }
    // Validate review text length
    if (reviewInput.review_text.length < 10) {
        throw new ValidationError('Review text must be at least 10 characters long');
    }
    if (reviewInput.review_text.length > 2000) {
        throw new ValidationError('Review text cannot exceed 2000 characters');
    }
    // Get booking details
    const booking = await bookingModel.findBookingById(booking_id);
    if (!booking) {
        throw new NotFoundError('Booking not found');
    }
    // Check if booking is completed
    if (booking.status !== 'completed') {
        throw new BadRequestError('Can only review completed bookings');
    }
    // Determine if reviewer is guest or host
    let reviewType;
    let revieweeId;
    if (booking.guest_id === reviewerId) {
        reviewType = 'guest_to_host';
        revieweeId = booking.host_id;
    }
    else if (booking.host_id === reviewerId) {
        reviewType = 'host_to_guest';
        revieweeId = booking.guest_id;
    }
    else {
        throw new UnauthorizedError('You are not part of this booking');
    }
    // Check if user has already reviewed this booking
    const existingReview = await reviewModel.findReviewByBookingAndReviewer(booking_id, reviewerId);
    if (existingReview) {
        throw new BadRequestError('You have already reviewed this booking');
    }
    // Validate category ratings are only for guest reviews
    if (reviewType === 'host_to_guest') {
        if (reviewInput.cleanliness_rating ||
            reviewInput.accuracy_rating ||
            reviewInput.location_rating ||
            reviewInput.value_rating ||
            reviewInput.check_in_rating) {
            throw new ValidationError('Category ratings are only available for guest-to-host reviews');
        }
    }
    // Create the review
    const review = await reviewModel.createReview({
        booking_id,
        listing_id: booking.listing_id,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        review_type: reviewType,
        overall_rating: reviewInput.overall_rating,
        cleanliness_rating: reviewInput.cleanliness_rating,
        accuracy_rating: reviewInput.accuracy_rating,
        communication_rating: reviewInput.communication_rating,
        location_rating: reviewInput.location_rating,
        value_rating: reviewInput.value_rating,
        check_in_rating: reviewInput.check_in_rating,
        review_text: reviewInput.review_text
    });
    return review;
}
/**
 * Get a single review by ID
 */
export async function getReview(reviewId) {
    const review = await reviewModel.findReviewById(reviewId);
    if (!review) {
        throw new NotFoundError('Review not found');
    }
    return review;
}
/**
 * Get all reviews for a listing
 */
export async function getListingReviews(listingId, options = {}) {
    // Verify listing exists
    const listing = await listingModel.findListingById(listingId);
    if (!listing) {
        throw new NotFoundError('Listing not found');
    }
    return reviewModel.findReviewsByListingId(listingId, {
        onlyPublished: true,
        ...options
    });
}
/**
 * Get reviews written by a user
 */
export async function getUserReviewsWritten(userId, options = {}) {
    return reviewModel.findReviewsByReviewerId(userId, options);
}
/**
 * Get reviews received by a user
 */
export async function getUserReviewsReceived(userId, options = {}) {
    return reviewModel.findReviewsByRevieweeId(userId, options);
}
/**
 * Respond to a review
 */
export async function respondToReview(reviewId, responderId, responseText) {
    // Validate response text
    if (responseText.length < 10) {
        throw new ValidationError('Response must be at least 10 characters long');
    }
    if (responseText.length > 1000) {
        throw new ValidationError('Response cannot exceed 1000 characters');
    }
    // Get the review
    const review = await reviewModel.findReviewById(reviewId);
    if (!review) {
        throw new NotFoundError('Review not found');
    }
    // Check if review already has a response
    if (review.response_text) {
        throw new BadRequestError('This review already has a response');
    }
    // Verify the responder is the reviewee (person being reviewed)
    if (review.reviewee_id !== responderId) {
        throw new UnauthorizedError('You can only respond to reviews about you');
    }
    // Update the review with response
    return reviewModel.updateReviewResponse(reviewId, responseText);
}
/**
 * Flag a review for moderation
 */
export async function flagReview(reviewId, userId, reason) {
    // Validate reason
    if (!reason || reason.length < 10) {
        throw new ValidationError('Please provide a detailed reason (at least 10 characters)');
    }
    // Get the review
    const review = await reviewModel.findReviewById(reviewId);
    if (!review) {
        throw new NotFoundError('Review not found');
    }
    // Check if already flagged
    if (review.is_flagged) {
        throw new BadRequestError('This review has already been flagged');
    }
    // Flag the review
    return reviewModel.flagReview(reviewId, reason);
}
/**
 * Get detailed rating breakdown for a listing
 */
export async function getListingRatings(listingId) {
    // Verify listing exists
    const listing = await listingModel.findListingById(listingId);
    if (!listing) {
        throw new NotFoundError('Listing not found');
    }
    return reviewModel.getListingAverageRatings(listingId);
}
/**
 * Get host's overall rating
 */
export async function getHostRating(hostId) {
    // Verify user exists and is a host
    const user = await userModel.findUserById(hostId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    if (user.user_type !== 'host' && user.user_type !== 'both') {
        throw new BadRequestError('User is not a host');
    }
    return reviewModel.getHostAverageRating(hostId);
}
/**
 * Check if user can review a specific booking
 */
export async function canReviewBooking(bookingId, userId) {
    // Get booking
    const booking = await bookingModel.findBookingById(bookingId);
    if (!booking) {
        return { canReview: false, reason: 'Booking not found' };
    }
    // Check if booking is completed
    if (booking.status !== 'completed') {
        return { canReview: false, reason: 'Booking must be completed to leave a review' };
    }
    // Check if user is part of booking
    if (booking.guest_id !== userId && booking.host_id !== userId) {
        return { canReview: false, reason: 'You are not part of this booking' };
    }
    // Check if user has already reviewed
    const existingReview = await reviewModel.findReviewByBookingAndReviewer(bookingId, userId);
    if (existingReview) {
        return { canReview: false, reason: 'You have already reviewed this booking' };
    }
    return { canReview: true };
}
/**
 * Get pending reviews for a user (bookings they can review)
 */
export async function getPendingReviews(userId) {
    // Get completed bookings for the user
    const guestBookings = await bookingModel.findBookingsByGuestId(userId, 'completed');
    const hostBookings = await bookingModel.findBookingsByHostId(userId, 'completed');
    const allBookings = [...guestBookings, ...hostBookings];
    // Filter bookings that haven't been reviewed yet
    const pendingReviews = [];
    for (const booking of allBookings) {
        const existingReview = await reviewModel.findReviewByBookingAndReviewer(booking.id, userId);
        if (!existingReview) {
            pendingReviews.push({
                booking_id: booking.id,
                listing_id: booking.listing_id,
                check_in_date: booking.check_in_date,
                check_out_date: booking.check_out_date,
                is_guest: booking.guest_id === userId,
                is_host: booking.host_id === userId
            });
        }
    }
    return pendingReviews;
}
//# sourceMappingURL=reviewService.js.map