import { findListingById, findListingsByHostId, createListing, updateListing, togglePublishListing, incrementViewCount, searchListings, softDeleteListing, } from '../models/listingModel';
import { NotFoundError, ValidationError } from '../utils/errors';
import { isValidCoordinates, isValidPrice } from '../utils/validators';
/**
 * Listing Service - Handles listing operations
 */
/**
 * Create a new listing
 */
export const createNewListing = async (hostId, payload) => {
    // Validate input
    if (!payload.title?.trim() || payload.title.length > 100) {
        throw new ValidationError('Title is required and must be less than 100 characters');
    }
    if (!payload.description?.trim() || payload.description.length < 50) {
        throw new ValidationError('Description is required and must be at least 50 characters');
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
export const getListing = async (listingId, incrementView = true) => {
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
export const getHostListings = async (hostId, limit = 20, offset = 0) => {
    return await findListingsByHostId(hostId, limit, offset);
};
/**
 * Update listing
 */
export const updateListingDetails = async (listingId, hostId, updates) => {
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
export const publishListing = async (listingId, hostId) => {
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
export const unpublishListing = async (listingId, hostId) => {
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
export const searchAndFilterListings = async (filters, limit = 20, offset = 0) => {
    return await searchListings(filters, limit, offset);
};
/**
 * Delete listing (soft delete)
 */
export const deleteListing = async (listingId, hostId) => {
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
export const getListingStats = async (listingId) => {
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
//# sourceMappingURL=listingService.js.map