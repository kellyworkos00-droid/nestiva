/**
 * Location Controller
 * HTTP endpoints for location-based listing operations
 */

import { Request, Response } from 'express';
import * as listingModel from '../models/listingModel.js';
import * as locationUtils from '../utils/geolocation.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';

/**
 * Get nearby listings
 * GET /listings/nearby?latitude=40.7128&longitude=-74.0060&radius=10&limit=20
 */
export async function getNearbyListings(req: Request, res: Response): Promise<void> {
  try {
    const { latitude, longitude, radius = 10, limit = 20, offset = 0 } = req.query;

    if (!latitude || !longitude) {
      res.status(400).json(createErrorResponse('latitude and longitude are required'));
      return;
    }

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const radiusKm = parseFloat(radius as string) || 10;
    const pageLimit = Math.min(parseInt(limit as string) || 20, 100);
    const pageOffset = parseInt(offset as string) || 0;

    if (!locationUtils.areValidCoordinates(lat, lon)) {
      res.status(400).json(createErrorResponse('Invalid coordinates. Latitude must be -90 to 90, longitude must be -180 to 180'));
      return;
    }

    if (radiusKm <= 0 || radiusKm > 50) {
      res.status(400).json(createErrorResponse('Radius must be between 0 and 50 kilometers'));
      return;
    }

    // Extract optional filters
    const filters: any = {};
    if (req.query.min_price) filters.min_price = parseFloat(req.query.min_price as string);
    if (req.query.max_price) filters.max_price = parseFloat(req.query.max_price as string);
    if (req.query.min_rating) filters.min_rating = parseFloat(req.query.min_rating as string);
    if (req.query.property_type) filters.property_type = req.query.property_type as string;

    const result = await listingModel.findNearbyListings(
      lat,
      lon,
      radiusKm,
      pageLimit,
      pageOffset,
      filters
    );

    res.json(createSuccessResponse({
      center: { latitude: lat, longitude: lon },
      radius_km: radiusKm,
      listings: result.listings,
      total: result.total,
      limit: pageLimit,
      offset: pageOffset
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to get nearby listings'));
  }
}

/**
 * Get listings in map bounds
 * GET /listings/map?bounds=40.7580,-74.0855,40.7614,-74.0022
 */
export async function getListingsInBounds(req: Request, res: Response): Promise<void> {
  try {
    const { bounds, limit = 100, offset = 0 } = req.query;

    if (!bounds) {
      res.status(400).json(createErrorResponse('bounds parameter is required. Format: south,west,north,east'));
      return;
    }

    const parsedBounds = locationUtils.parseMapBounds(bounds as string);
    if (!parsedBounds) {
      res.status(400).json(createErrorResponse('Invalid bounds format. Use: south,west,north,east'));
      return;
    }

    const pageLimit = Math.min(parseInt(limit as string) || 100, 500);
    const pageOffset = parseInt(offset as string) || 0;

    // Extract optional filters
    const filters: any = {};
    if (req.query.min_price) filters.min_price = parseFloat(req.query.min_price as string);
    if (req.query.max_price) filters.max_price = parseFloat(req.query.max_price as string);
    if (req.query.min_rating) filters.min_rating = parseFloat(req.query.min_rating as string);
    if (req.query.property_type) filters.property_type = req.query.property_type as string;

    const result = await listingModel.findListingsInBounds(
      parsedBounds.south,
      parsedBounds.west,
      parsedBounds.north,
      parsedBounds.east,
      pageLimit,
      pageOffset,
      filters
    );

    const center = locationUtils.getBoundingBoxCenter(parsedBounds);

    res.json(createSuccessResponse({
      bounds: parsedBounds,
      center,
      listings: result.listings,
      total: result.total,
      limit: pageLimit,
      offset: pageOffset
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to get listings in bounds'));
  }
}

/**
 * Get listings by city
 * GET /listings/city/:city?country=US&limit=20
 */
export async function getListingsByCity(req: Request, res: Response): Promise<void> {
  try {
    const { city } = req.params;
    const { country, limit = 20, offset = 0 } = req.query;

    if (!city) {
      res.status(400).json(createErrorResponse('city is required'));
      return;
    }

    const pageLimit = Math.min(parseInt(limit as string) || 20, 100);
    const pageOffset = parseInt(offset as string) || 0;

    const result = await listingModel.findListingsByCity(
      city,
      country as string | undefined,
      pageLimit,
      pageOffset
    );

    res.json(createSuccessResponse({
      city,
      country: country || 'any',
      listings: result.listings,
      total: result.total,
      limit: pageLimit,
      offset: pageOffset
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to get listings by city'));
  }
}

/**
 * Get listings by country
 * GET /listings/country/:country?limit=50
 */
export async function getListingsByCountry(req: Request, res: Response): Promise<void> {
  try {
    const { country } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    if (!country) {
      res.status(400).json(createErrorResponse('country is required'));
      return;
    }

    const pageLimit = Math.min(parseInt(limit as string) || 50, 250);
    const pageOffset = parseInt(offset as string) || 0;

    const result = await listingModel.findListingsByCountry(
      country,
      pageLimit,
      pageOffset
    );

    res.json(createSuccessResponse({
      country,
      listings: result.listings,
      total: result.total,
      limit: pageLimit,
      offset: pageOffset
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to get listings by country'));
  }
}

/**
 * Calculate distance between two coordinates
 * POST /listings/distance
 */
export async function calculateDistance(req: Request, res: Response): Promise<void> {
  try {
    const { from_latitude, from_longitude, to_latitude, to_longitude } = req.body;

    if (!from_latitude || !from_longitude || !to_latitude || !to_longitude) {
      res.status(400).json(createErrorResponse('from_latitude, from_longitude, to_latitude, and to_longitude are required'));
      return;
    }

    const fromLat = parseFloat(from_latitude);
    const fromLon = parseFloat(from_longitude);
    const toLat = parseFloat(to_latitude);
    const toLon = parseFloat(to_longitude);

    if (!locationUtils.areValidCoordinates(fromLat, fromLon)) {
      res.status(400).json(createErrorResponse('Invalid from coordinates'));
      return;
    }

    if (!locationUtils.areValidCoordinates(toLat, toLon)) {
      res.status(400).json(createErrorResponse('Invalid to coordinates'));
      return;
    }

    const distanceKm = locationUtils.calculateDistance(fromLat, fromLon, toLat, toLon);
    const distanceMiles = locationUtils.kmToMiles(distanceKm);

    res.json(createSuccessResponse({
      from: { latitude: fromLat, longitude: fromLon },
      to: { latitude: toLat, longitude: toLon },
      distance_km: distanceKm,
      distance_miles: distanceMiles
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to calculate distance'));
  }
}

/**
 * Get bounding box for a radius
 * POST /listings/bounding-box
 */
export async function getBoundingBoxEndpoint(req: Request, res: Response): Promise<void> {
  try {
    const { center_latitude, center_longitude, radius_km = 10 } = req.body;

    if (!center_latitude || !center_longitude) {
      res.status(400).json(createErrorResponse('center_latitude and center_longitude are required'));
      return;
    }

    const centerLat = parseFloat(center_latitude);
    const centerLon = parseFloat(center_longitude);
    const radius = parseFloat(radius_km);

    if (!locationUtils.areValidCoordinates(centerLat, centerLon)) {
      res.status(400).json(createErrorResponse('Invalid center coordinates'));
      return;
    }

    if (radius <= 0 || radius > 50) {
      res.status(400).json(createErrorResponse('Radius must be between 0 and 50 kilometers'));
      return;
    }

    const bounds = locationUtils.getBoundingBox(centerLat, centerLon, radius);
    const parsedBounds = {
      south: bounds.minLat,
      west: bounds.minLon,
      north: bounds.maxLat,
      east: bounds.maxLon
    };

    res.json(createSuccessResponse({
      center: { latitude: centerLat, longitude: centerLon },
      radius_km: radius,
      bounding_box: parsedBounds,
      bounds_string: `${parsedBounds.south},${parsedBounds.west},${parsedBounds.north},${parsedBounds.east}`
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to get bounding box'));
  }
}
