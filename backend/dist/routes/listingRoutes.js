import express from 'express';
import * as listingController from '../controllers/listingController';
import { optionalAuthMiddleware, requireAuthMiddleware } from '../middleware/auth';
const router = express.Router();
/**
 * Listing Routes
 * Base: /api/v1/listings
 */
// Create listing (protected)
router.post('/', requireAuthMiddleware, listingController.createListing);
// Get my listings (protected)
router.get('/my-listings', requireAuthMiddleware, listingController.getMyListings);
// Search listings (public)
router.get('/search', optionalAuthMiddleware, listingController.searchListings);
// Get listing by ID (public)
router.get('/:listingId', optionalAuthMiddleware, listingController.getListing_);
// Update listing (protected)
router.put('/:listingId', requireAuthMiddleware, listingController.updateListing);
// Publish listing (protected)
router.post('/:listingId/publish', requireAuthMiddleware, listingController.publishListing_);
// Unpublish listing (protected)
router.post('/:listingId/unpublish', requireAuthMiddleware, listingController.unpublishListing_);
// Get listing stats (protected)
router.get('/:listingId/stats', requireAuthMiddleware, listingController.getStats);
// Delete listing (protected)
router.delete('/:listingId', requireAuthMiddleware, listingController.deleteListing_);
export default router;
//# sourceMappingURL=listingRoutes.js.map