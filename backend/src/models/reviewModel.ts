/**
 * Review Model
 * Database operations for reviews and ratings
 */

import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../utils/errors.js';

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
export async function findReviewById(reviewId: string): Promise<Review | null> {
  const result = await pool.query(
    `SELECT * FROM reviews WHERE id = $1`,
    [reviewId]
  );

  return result.rows[0] || null;
}

/**
 * Find review by booking and reviewer
 */
export async function findReviewByBookingAndReviewer(
  bookingId: string,
  reviewerId: string
): Promise<Review | null> {
  const result = await pool.query(
    `SELECT * FROM reviews WHERE booking_id = $1 AND reviewer_id = $2`,
    [bookingId, reviewerId]
  );

  return result.rows[0] || null;
}

/**
 * Find all reviews for a listing
 */
export async function findReviewsByListingId(
  listingId: string,
  options: {
    onlyPublished?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ reviews: Review[]; total: number }> {
  const { onlyPublished = true, limit = 20, offset = 0 } = options;

  let whereClause = 'WHERE listing_id = $1 AND review_type = $2';
  const params: any[] = [listingId, 'guest_to_host'];

  if (onlyPublished) {
    whereClause += ' AND is_published = true';
  }

  // Get total count
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM reviews ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count);

  // Get reviews with pagination
  const result = await pool.query(
    `SELECT r.*, 
      u.first_name, u.last_name, u.profile_picture_url
     FROM reviews r
     JOIN users u ON r.reviewer_id = u.id
     ${whereClause}
     ORDER BY r.created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  return {
    reviews: result.rows,
    total
  };
}

/**
 * Find reviews written by a user
 */
export async function findReviewsByReviewerId(
  reviewerId: string,
  options: {
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ reviews: Review[]; total: number }> {
  const { limit = 20, offset = 0 } = options;

  // Get total count
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM reviews WHERE reviewer_id = $1`,
    [reviewerId]
  );
  const total = parseInt(countResult.rows[0].count);

  // Get reviews
  const result = await pool.query(
    `SELECT r.*, 
      l.title as listing_title,
      u.first_name as reviewee_first_name,
      u.last_name as reviewee_last_name
     FROM reviews r
     JOIN listings l ON r.listing_id = l.id
     JOIN users u ON r.reviewee_id = u.id
     WHERE r.reviewer_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [reviewerId, limit, offset]
  );

  return {
    reviews: result.rows,
    total
  };
}

/**
 * Find reviews received by a user (as host or guest)
 */
export async function findReviewsByRevieweeId(
  revieweeId: string,
  options: {
    reviewType?: 'guest_to_host' | 'host_to_guest';
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ reviews: Review[]; total: number }> {
  const { reviewType, limit = 20, offset = 0 } = options;

  let whereClause = 'WHERE r.reviewee_id = $1';
  const params: any[] = [revieweeId];

  if (reviewType) {
    whereClause += ` AND r.review_type = $${params.length + 1}`;
    params.push(reviewType);
  }

  // Get total count
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM reviews r ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count);

  // Get reviews
  const result = await pool.query(
    `SELECT r.*, 
      u.first_name as reviewer_first_name,
      u.last_name as reviewer_last_name,
      u.profile_picture_url as reviewer_profile_picture,
      l.title as listing_title
     FROM reviews r
     JOIN users u ON r.reviewer_id = u.id
     JOIN listings l ON r.listing_id = l.id
     ${whereClause}
     ORDER BY r.created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  return {
    reviews: result.rows,
    total
  };
}

/**
 * Create a new review
 */
export async function createReview(reviewData: CreateReviewData): Promise<Review> {
  const id = uuidv4();

  const result = await pool.query(
    `INSERT INTO reviews (
      id, booking_id, listing_id, reviewer_id, reviewee_id, review_type,
      overall_rating, cleanliness_rating, accuracy_rating, communication_rating,
      location_rating, value_rating, check_in_rating, review_text,
      is_published, is_flagged, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    [
      id,
      reviewData.booking_id,
      reviewData.listing_id,
      reviewData.reviewer_id,
      reviewData.reviewee_id,
      reviewData.review_type,
      reviewData.overall_rating,
      reviewData.cleanliness_rating || null,
      reviewData.accuracy_rating || null,
      reviewData.communication_rating || null,
      reviewData.location_rating || null,
      reviewData.value_rating || null,
      reviewData.check_in_rating || null,
      reviewData.review_text,
      true, // is_published
      false // is_flagged
    ]
  );

  return result.rows[0];
}

/**
 * Update review response
 */
export async function updateReviewResponse(
  reviewId: string,
  responseText: string
): Promise<Review> {
  const result = await pool.query(
    `UPDATE reviews 
     SET response_text = $1, 
         response_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [responseText, reviewId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Review not found');
  }

  return result.rows[0];
}

/**
 * Flag a review for moderation
 */
export async function flagReview(
  reviewId: string,
  reason: string
): Promise<Review> {
  const result = await pool.query(
    `UPDATE reviews 
     SET is_flagged = true,
         flag_reason = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [reason, reviewId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Review not found');
  }

  return result.rows[0];
}

/**
 * Unpublish a review
 */
export async function unpublishReview(reviewId: string): Promise<Review> {
  const result = await pool.query(
    `UPDATE reviews 
     SET is_published = false,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [reviewId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Review not found');
  }

  return result.rows[0];
}

/**
 * Get average ratings for a listing (all categories)
 */
export async function getListingAverageRatings(listingId: string): Promise<{
  overall_rating: number;
  cleanliness_rating: number;
  accuracy_rating: number;
  communication_rating: number;
  location_rating: number;
  value_rating: number;
  check_in_rating: number;
  total_reviews: number;
}> {
  const result = await pool.query(
    `SELECT 
      COALESCE(AVG(overall_rating), 0) as overall_rating,
      COALESCE(AVG(cleanliness_rating), 0) as cleanliness_rating,
      COALESCE(AVG(accuracy_rating), 0) as accuracy_rating,
      COALESCE(AVG(communication_rating), 0) as communication_rating,
      COALESCE(AVG(location_rating), 0) as location_rating,
      COALESCE(AVG(value_rating), 0) as value_rating,
      COALESCE(AVG(check_in_rating), 0) as check_in_rating,
      COUNT(*) as total_reviews
     FROM reviews
     WHERE listing_id = $1 
       AND review_type = 'guest_to_host'
       AND is_published = true`,
    [listingId]
  );

  return result.rows[0];
}

/**
 * Get host's average rating from all their listings
 */
export async function getHostAverageRating(hostId: string): Promise<{
  average_rating: number;
  total_reviews: number;
}> {
  const result = await pool.query(
    `SELECT 
      COALESCE(AVG(r.overall_rating), 0) as average_rating,
      COUNT(*) as total_reviews
     FROM reviews r
     JOIN listings l ON r.listing_id = l.id
     WHERE l.host_id = $1 
       AND r.review_type = 'guest_to_host'
       AND r.is_published = true`,
    [hostId]
  );

  return result.rows[0];
}

/**
 * Check if user can review a booking
 */
export async function canUserReviewBooking(
  bookingId: string,
  userId: string
): Promise<boolean> {
  // Check if booking is completed
  const bookingResult = await pool.query(
    `SELECT status, guest_id, host_id FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingResult.rows.length === 0) {
    return false;
  }

  const booking = bookingResult.rows[0];

  // Only completed bookings can be reviewed
  if (booking.status !== 'completed') {
    return false;
  }

  // Check if user is part of the booking
  if (booking.guest_id !== userId && booking.host_id !== userId) {
    return false;
  }

  // Check if user has already reviewed
  const reviewResult = await pool.query(
    `SELECT id FROM reviews WHERE booking_id = $1 AND reviewer_id = $2`,
    [bookingId, userId]
  );

  return reviewResult.rows.length === 0;
}
