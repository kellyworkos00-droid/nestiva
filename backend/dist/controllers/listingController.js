import { createSuccessResponse, createErrorResponse, ApiError } from '../utils/errors';
import { createNewListing, getListing, getHostListings, updateListingDetails, publishListing, unpublishListing, searchAndFilterListings, deleteListing, getListingStats, } from '../services/listingService';
/**
 * Listing Controller - Handles listing requests
 */
/**
 * Create new listing
 */
export const createListing = async (req, res, next) => {
    try {
        const hostId = req.user?.userId;
        if (!hostId) {
            throw new Error('Unauthorized');
        }
        const listing = await createNewListing(hostId, req.body);
        res.status(201).json(createSuccessResponse({ listing }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(createErrorResponse(error, req.path));
        }
        else {
            next(error);
        }
    }
};
/**
 * Get listing by ID
 */
export const getListing_ = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const listing = await getListing(listingId, true);
        res.status(200).json(createSuccessResponse({ listing }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(createErrorResponse(error, req.path));
        }
        else {
            next(error);
        }
    }
};
/**
 * Get host listings
 */
export const getMyListings = async (req, res, next) => {
    try {
        const hostId = req.user?.userId;
        const { limit = '20', offset = '0' } = req.query;
        if (!hostId) {
            throw new Error('Unauthorized');
        }
        const result = await getHostListings(hostId, parseInt(limit), parseInt(offset));
        res.status(200).json(createSuccessResponse(result));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(createErrorResponse(error, req.path));
        }
        else {
            next(error);
        }
    }
};
/**
 * Update listing
 */
export const updateListing = async (req, res, next) => {
    try {
        const hostId = req.user?.userId;
        const { listingId } = req.params;
        if (!hostId) {
            throw new Error('Unauthorized');
        }
        const listing = await updateListingDetails(listingId, hostId, req.body);
        res.status(200).json(createSuccessResponse({ listing }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(createErrorResponse(error, req.path));
        }
        else {
            next(error);
        }
    }
};
/**
 * Publish listing
 */
export const publishListing_ = async (req, res, next) => {
    try {
        const hostId = req.user?.userId;
        const { listingId } = req.params;
        if (!hostId) {
            throw new Error('Unauthorized');
        }
        const listing = await publishListing(listingId, hostId);
        res.status(200).json(createSuccessResponse({ listing }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(createErrorResponse(error, req.path));
        }
        else {
            next(error);
        }
    }
};
/**
 * Unpublish listing
 */
export const unpublishListing_ = async (req, res, next) => {
    try {
        const hostId = req.user?.userId;
        const { listingId } = req.params;
        if (!hostId) {
            throw new Error('Unauthorized');
        }
        const listing = await unpublishListing(listingId, hostId);
        res.status(200).json(createSuccessResponse({ listing }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(createErrorResponse(error, req.path));
        }
        else {
            next(error);
        }
    }
};
/**
 * Search and filter listings
 */
export const searchListings = async (req, res, next) => {
    try {
        const { city, category, min_price, max_price, bedrooms, check_in_date, check_out_date, limit = '20', offset = '0', } = req.query;
        const filters = {};
        if (city)
            filters.city = city;
        if (category)
            filters.category = category;
        if (min_price)
            filters.minPrice = parseFloat(min_price);
        if (max_price)
            filters.maxPrice = parseFloat(max_price);
        if (bedrooms)
            filters.bedrooms = parseInt(bedrooms);
        if (check_in_date)
            filters.checkInDate = new Date(check_in_date);
        if (check_out_date)
            filters.checkOutDate = new Date(check_out_date);
        const result = await searchAndFilterListings(filters, parseInt(limit), parseInt(offset));
        res.status(200).json(createSuccessResponse(result));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(createErrorResponse(error, req.path));
        }
        else {
            next(error);
        }
    }
};
/**
 * Delete listing
 */
export const deleteListing_ = async (req, res, next) => {
    try {
        const hostId = req.user?.userId;
        const { listingId } = req.params;
        if (!hostId) {
            throw new Error('Unauthorized');
        }
        await deleteListing(listingId, hostId);
        res.status(200).json(createSuccessResponse({ message: 'Listing deleted' }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(createErrorResponse(error, req.path));
        }
        else {
            next(error);
        }
    }
};
/**
 * Get listing statistics
 */
export const getStats = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const stats = await getListingStats(listingId);
        res.status(200).json(createSuccessResponse(stats));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(createErrorResponse(error, req.path));
        }
        else {
            next(error);
        }
    }
};
//# sourceMappingURL=listingController.js.map