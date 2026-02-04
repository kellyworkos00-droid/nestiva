/**
 * Location Routes
 * API endpoints for location-based listing operations
 */

import express from 'express';
import * as locationController from '../controllers/locationController.js';

const router = express.Router();

// All location routes are public (no authentication required)

// Nearby listings within radius
router.get('/nearby', locationController.getNearbyListings);

// Listings within map bounds
router.get('/map', locationController.getListingsInBounds);

// Listings by city
router.get('/city/:city', locationController.getListingsByCity);

// Listings by country
router.get('/country/:country', locationController.getListingsByCountry);

// Distance calculation
router.post('/distance', locationController.calculateDistance);

// Bounding box calculation
router.post('/bounding-box', locationController.getBoundingBoxEndpoint);

export default router;
