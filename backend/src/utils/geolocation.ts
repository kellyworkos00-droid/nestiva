/**
 * Geolocation Utility
 * Handles distance calculations, coordinate validation, and location operations
 */

/**
 * Haversine formula: Calculate distance between two points on Earth
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km: number): number {
  return Math.round((km * 0.621371) * 100) / 100;
}

/**
 * Convert miles to kilometers
 */
export function milesToKm(miles: number): number {
  return Math.round((miles / 0.621371) * 100) / 100;
}

/**
 * Validate latitude
 */
export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90 && typeof lat === 'number' && !isNaN(lat);
}

/**
 * Validate longitude
 */
export function isValidLongitude(lon: number): boolean {
  return lon >= -180 && lon <= 180 && typeof lon === 'number' && !isNaN(lon);
}

/**
 * Validate coordinates
 */
export function areValidCoordinates(lat: number, lon: number): boolean {
  return isValidLatitude(lat) && isValidLongitude(lon);
}

/**
 * Parse location string to coordinates
 * Format: "latitude,longitude" or with decimals
 */
export function parseLocationString(location: string): { lat: number; lon: number } | null {
  const parts = location.split(',').map(p => parseFloat(p.trim()));

  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return null;
  }

  const [lat, lon] = parts;

  if (!areValidCoordinates(lat, lon)) {
    return null;
  }

  return { lat, lon };
}

/**
 * Get bounding box for a radius around a point
 * Returns {minLat, maxLat, minLon, maxLon}
 */
export function getBoundingBox(
  centerLat: number,
  centerLon: number,
  radiusKm: number
): {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
} {
  // Rough approximation: 1 degree of latitude ≈ 111 km
  const latOffset = (radiusKm / 111) * 1.2; // Add 20% buffer
  const lonOffset = (radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180))) * 1.2;

  return {
    minLat: centerLat - latOffset,
    maxLat: centerLat + latOffset,
    minLon: centerLon - lonOffset,
    maxLon: centerLon + lonOffset,
  };
}

/**
 * Check if point is within bounding box
 */
export function isPointInBoundingBox(
  lat: number,
  lon: number,
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number }
): boolean {
  return (
    lat >= bounds.minLat &&
    lat <= bounds.maxLat &&
    lon >= bounds.minLon &&
    lon <= bounds.maxLon
  );
}

/**
 * Parse map bounds string
 * Format: "south,west,north,east" (typical GeoJSON order)
 */
export function parseMapBounds(
  boundsString: string
): { south: number; west: number; north: number; east: number } | null {
  const parts = boundsString.split(',').map(p => parseFloat(p.trim()));

  if (parts.length !== 4) {
    return null;
  }

  const [south, west, north, east] = parts;

  if (isNaN(south) || isNaN(west) || isNaN(north) || isNaN(east)) {
    return null;
  }

  // Validate bounds
  if (
    !isValidLatitude(south) ||
    !isValidLatitude(north) ||
    !isValidLongitude(west) ||
    !isValidLongitude(east)
  ) {
    return null;
  }

  if (south >= north || west >= east) {
    return null;
  }

  return { south, west, north, east };
}

/**
 * Check if point is within map bounds
 */
export function isPointInMapBounds(
  lat: number,
  lon: number,
  bounds: { south: number; west: number; north: number; east: number }
): boolean {
  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lon >= bounds.west &&
    lon <= bounds.east
  );
}

/**
 * Calculate center point of bounding box
 */
export function getBoundingBoxCenter(bounds: {
  south: number;
  west: number;
  north: number;
  east: number;
}): { lat: number; lon: number } {
  return {
    lat: (bounds.south + bounds.north) / 2,
    lon: (bounds.west + bounds.east) / 2,
  };
}

/**
 * Calculate center point of two coordinates
 */
export function getMidpoint(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { lat: number; lon: number } {
  return {
    lat: (lat1 + lat2) / 2,
    lon: (lon1 + lon2) / 2,
  };
}

/**
 * Format coordinates to specific precision
 */
export function formatCoordinates(
  lat: number,
  lon: number,
  precision: number = 6
): { lat: number; lon: number } {
  const factor = Math.pow(10, precision);
  return {
    lat: Math.round(lat * factor) / factor,
    lon: Math.round(lon * factor) / factor,
  };
}
