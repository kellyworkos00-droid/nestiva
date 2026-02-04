import {
  findListingById,
  findListingsByHostId,
  createListing,
  updateListing,
  togglePublishListing,
  incrementViewCount,
  searchListings,
  softDeleteListing,
} from '../models/listingModel';
import { NotFoundError, ValidationError } from '../utils/errors';
import { isValidCoordinates, isValidPrice } from '../utils/validators';
import { Listing } from '../types/index';

interface CreateListingPayload {
  title: string;
  description: string;
  category: string;
  property_type: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  house_rules: string[];
  cancellation_policy: 'flexible' | 'moderate' | 'strict' | 'super_strict';
  base_price: number;
  currency: string;
  cleaning_fee: number;
  service_fee_percentage: number;
}

/**
 * Listing Service - Handles listing operations
 */

/**
 * Create a new listing
 */
export const createNewListing = async (
  hostId: string,
  payload: CreateListingPayload
): Promise<Listing> => {
  // Validate input
  if (!payload.title?.trim() || payload.title.length > 100) {
    throw new ValidationError('Title is required and must be less than 100 characters');
  }

  if (!payload.description?.trim() || payload.description.length < 50) {
    throw new ValidationError(
      'Description is required and must be at least 50 characters'
    );
  }

  if (!isValidCoordinates(payload.latitude, payload.longitude)) {
    throw new ValidationError('Invalid coordinates');
  }

  if (!isValidPrice(payload.base_price)) {
    throw new ValidationError('Invalid price');
  }

  if (!isValidPrice(payload.cleaning_fee)) {
    throw new ValidationError('Invalid cleaning fee');
  }

  if (payload.service_fee_percentage < 0 || payload.service_fee_percentage > 100) {
    throw new ValidationError('Service fee percentage must be between 0 and 100');
  }

  if (payload.max_guests < 1 || payload.bedrooms < 1 || payload.beds < 1) {
    throw new ValidationError('Capacity values must be at least 1');
  }

  // Create listing
  const listing = await createListing({
    host_id: hostId,
    ...payload,
  });

  return listing;
};

/**
 * Get listing by ID
 */
export const getListing = async (listingId: string, incrementView: boolean = true): Promise<Listing> => {
  const listing = await findListingById(listingId);
  if (!listing) {
    throw new NotFoundError('Listing');
  }

  // Increment view count
  if (incrementView) {
    await incrementViewCount(listingId);
  }

  return listing;
};

/**
 * Get all listings by host
 */
export const getHostListings = async (
  hostId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ listings: Listing[]; total: number }> => {
  return await findListingsByHostId(hostId, limit, offset);
};

/**
 * Update listing
 */
export const updateListingDetails = async (
  listingId: string,
  hostId: string,
  updates: Partial<CreateListingPayload>
): Promise<Listing> => {
  // Verify ownership
  const listing = await findListingById(listingId);
  if (!listing) {
    throw new NotFoundError('Listing');
  }

  if (listing.host_id !== hostId) {
    throw new Error('Unauthorized: You do not own this listing');
  }

  // Validate coordinates if provided
  if (updates.latitude && updates.longitude) {
    if (!isValidCoordinates(updates.latitude, updates.longitude)) {
      throw new ValidationError('Invalid coordinates');
    }
  }

  // Validate prices if provided
  if (updates.base_price && !isValidPrice(updates.base_price)) {
    throw new ValidationError('Invalid price');
  }

  if (updates.cleaning_fee && !isValidPrice(updates.cleaning_fee)) {
    throw new ValidationError('Invalid cleaning fee');
  }

  // Update listing
  const updatedListing = await updateListing(listingId, updates);
  return updatedListing;
};

/**
 * Publish listing
 */
export const publishListing = async (listingId: string, hostId: string): Promise<Listing> => {
  // Verify ownership
  const listing = await findListingById(listingId);
  if (!listing) {
    throw new NotFoundError('Listing');
  }

  if (listing.host_id !== hostId) {
    throw new Error('Unauthorized: You do not own this listing');
  }

  // Validate listing is complete
  if (!listing.title || !listing.description || !listing.base_price) {
    throw new ValidationError('Listing is incomplete. Please fill in all required fields.');
  }

  // Publish
  const publishedListing = await togglePublishListing(listingId, true);
  return publishedListing;
};

/**
 * Unpublish listing
 */
export const unpublishListing = async (listingId: string, hostId: string): Promise<Listing> => {
  // Verify ownership
  const listing = await findListingById(listingId);
  if (!listing) {
    throw new NotFoundError('Listing');
  }

  if (listing.host_id !== hostId) {
    throw new Error('Unauthorized: You do not own this listing');
  }

  // Unpublish
  const unpublishedListing = await togglePublishListing(listingId, false);
  return unpublishedListing;
};

/**
 * Search listings with filters
 */
export const searchAndFilterListings = async (
  filters: {
    city?: string;
    category?: string;
    maxPrice?: number;
    minPrice?: number;
    bedrooms?: number;
    checkInDate?: Date;
    checkOutDate?: Date;
  },
  limit: number = 20,
  offset: number = 0
): Promise<{ listings: Listing[]; total: number }> => {
  return await searchListings(filters, limit, offset);
};

/**
 * Delete listing (soft delete)
 */
export const deleteListing = async (listingId: string, hostId: string): Promise<void> => {
  // Verify ownership
  const listing = await findListingById(listingId);
  if (!listing) {
    throw new NotFoundError('Listing');
  }

  if (listing.host_id !== hostId) {
    throw new Error('Unauthorized: You do not own this listing');
  }

  // Delete
  await softDeleteListing(listingId);
};

/**
 * Get listing statistics
 */
export const getListingStats = async (
  listingId: string
): Promise<{
  viewCount: number;
  reviewCount: number;
  averageRating: number;
  inquiryCount: number;
}> => {
  const listing = await findListingById(listingId);
  if (!listing) {
    throw new NotFoundError('Listing');
  }

  return {
    viewCount: listing.view_count,
    reviewCount: listing.review_count,
    averageRating: listing.average_rating,
    inquiryCount: 0, // TODO: Query from inquiries/messages table
  };
};
