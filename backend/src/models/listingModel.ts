import { pool } from '../config/database';
import { Listing } from '../types/index';
import { NotFoundError } from '../utils/errors';
import { getCurrencyByCountry } from '../utils/currency';
import { v4 as uuidv4 } from 'uuid';

/**
 * Listing model - Database query functions
 */

/**
 * Find listing by ID
 */
export const findListingById = async (listingId: string): Promise<Listing | null> => {
  try {
    const result = await pool.query(
      `SELECT * FROM listings WHERE id = $1 AND deleted_at IS NULL`,
      [listingId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Database error in findListingById:', error);
    throw error;
  }
};

/**
 * Get all listings by host ID
 */
export const findListingsByHostId = async (
  hostId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ listings: Listing[]; total: number }> => {
  try {
    const result = await pool.query(
      `SELECT * FROM listings
       WHERE host_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [hostId, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM listings
       WHERE host_id = $1 AND deleted_at IS NULL`,
      [hostId]
    );

    return {
      listings: result.rows,
      total: parseInt(countResult.rows[0].total),
    };
  } catch (error) {
    console.error('Database error in findListingsByHostId:', error);
    throw error;
  }
};

/**
 * Create new listing
 */
export const createListing = async (userData: {
  host_id: string;
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
  currency?: string;
  cleaning_fee: number;
  service_fee_percentage: number;
}): Promise<Listing> => {
  try {
    const listingId = uuidv4();
    const now = new Date();
    
    // Auto-set currency based on country if not provided
    const currency = userData.currency || getCurrencyByCountry(userData.country);

    const result = await pool.query(
      `INSERT INTO listings (
        id, host_id, title, description, category, property_type, address, city,
        country, latitude, longitude, max_guests, bedrooms, beds, bathrooms,
        amenities, house_rules, cancellation_policy, base_price, currency,
        cleaning_fee, service_fee_percentage, is_published, availability_status,
        instant_book_enabled, view_count, review_count, average_rating,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
      ) RETURNING *`,
      [
        listingId,
        userData.host_id,
        userData.title,
        userData.description,
        userData.category,
        userData.property_type,
        userData.address,
        userData.city,
        userData.country,
        userData.latitude,
        userData.longitude,
        userData.max_guests,
        userData.bedrooms,
        userData.beds,
        userData.bathrooms,
        JSON.stringify(userData.amenities),
        JSON.stringify(userData.house_rules),
        userData.cancellation_policy,
        userData.base_price,
        currency,
        userData.cleaning_fee,
        userData.service_fee_percentage,
        false, // not published yet
        'available',
        true, // instant book enabled by default
        0, // view count
        0, // review count
        0, // average rating
        now,
        now,
      ]
    );

    // Parse JSONB fields
    const listing = result.rows[0];
    listing.amenities = listing.amenities || [];
    listing.house_rules = listing.house_rules || [];

    return listing;
  } catch (error) {
    console.error('Database error in createListing:', error);
    throw error;
  }
};

/**
 * Update listing
 */
export const updateListing = async (
  listingId: string,
  updates: Partial<Listing>
): Promise<Listing> => {
  try {
    const listing = await findListingById(listingId);
    if (!listing) {
      throw new NotFoundError('Listing');
    }

    const allowedFields = [
      'title',
      'description',
      'category',
      'property_type',
      'address',
      'city',
      'country',
      'max_guests',
      'bedrooms',
      'beds',
      'bathrooms',
      'amenities',
      'house_rules',
      'cancellation_policy',
      'base_price',
      'cleaning_fee',
      'availability_status',
      'instant_book_enabled',
    ];

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    for (const field of allowedFields) {
      if (field in updates) {
        const value = (updates as any)[field];
        if (field === 'amenities' || field === 'house_rules') {
          updateFields.push(`${field} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          updateFields.push(`${field} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return listing;
    }

    updateFields.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    values.push(listingId);

    const query = `
      UPDATE listings
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount + 1} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new NotFoundError('Listing');
    }

    const updatedListing = result.rows[0];
    updatedListing.amenities = updatedListing.amenities || [];
    updatedListing.house_rules = updatedListing.house_rules || [];

    return updatedListing;
  } catch (error) {
    console.error('Database error in updateListing:', error);
    throw error;
  }
};

/**
 * Publish/unpublish listing
 */
export const togglePublishListing = async (
  listingId: string,
  isPublished: boolean
): Promise<Listing> => {
  try {
    const result = await pool.query(
      `UPDATE listings
       SET is_published = $1, updated_at = NOW()
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING *`,
      [isPublished, listingId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Listing');
    }

    const listing = result.rows[0];
    listing.amenities = listing.amenities || [];
    listing.house_rules = listing.house_rules || [];

    return listing;
  } catch (error) {
    console.error('Database error in togglePublishListing:', error);
    throw error;
  }
};

/**
 * Increment view count
 */
export const incrementViewCount = async (listingId: string): Promise<void> => {
  try {
    await pool.query(
      `UPDATE listings
       SET view_count = view_count + 1, updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`,
      [listingId]
    );
  } catch (error) {
    console.error('Database error in incrementViewCount:', error);
    throw error;
  }
};

/**
 * Search listings with filters
 */
export const searchListings = async (
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
  try {
    let query = `
      SELECT DISTINCT l.* FROM listings l
      WHERE l.deleted_at IS NULL AND l.is_published = true
    `;
    const params: any[] = [];
    let paramCount = 1;

    // Add filters
    if (filters.city) {
      query += ` AND LOWER(l.city) ILIKE LOWER($${paramCount})`;
      params.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.category) {
      query += ` AND LOWER(l.category) = LOWER($${paramCount})`;
      params.push(filters.category);
      paramCount++;
    }

    if (filters.minPrice) {
      query += ` AND l.base_price >= $${paramCount}`;
      params.push(filters.minPrice);
      paramCount++;
    }

    if (filters.maxPrice) {
      query += ` AND l.base_price <= $${paramCount}`;
      params.push(filters.maxPrice);
      paramCount++;
    }

    if (filters.bedrooms) {
      query += ` AND l.bedrooms >= $${paramCount}`;
      params.push(filters.bedrooms);
      paramCount++;
    }

    // Check availability
    if (filters.checkInDate && filters.checkOutDate) {
      query += `
        AND NOT EXISTS (
          SELECT 1 FROM bookings b
          WHERE b.listing_id = l.id
          AND b.status != 'cancelled'
          AND b.check_in_date < $${paramCount + 1}
          AND b.check_out_date > $${paramCount}
        )
      `;
      params.push(filters.checkOutDate, filters.checkInDate);
      paramCount += 2;
    }

    // Add pagination
    query += ` ORDER BY l.average_rating DESC, l.view_count DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(DISTINCT l.id) as total FROM listings l WHERE l.deleted_at IS NULL AND l.is_published = true`;
    const countParams: any[] = [];
    let countParamCount = 1;

    if (filters.city) {
      countQuery += ` AND LOWER(l.city) ILIKE LOWER($${countParamCount})`;
      countParams.push(`%${filters.city}%`);
      countParamCount++;
    }

    if (filters.category) {
      countQuery += ` AND LOWER(l.category) = LOWER($${countParamCount})`;
      countParams.push(filters.category);
      countParamCount++;
    }

    if (filters.minPrice) {
      countQuery += ` AND l.base_price >= $${countParamCount}`;
      countParams.push(filters.minPrice);
      countParamCount++;
    }

    if (filters.maxPrice) {
      countQuery += ` AND l.base_price <= $${countParamCount}`;
      countParams.push(filters.maxPrice);
      countParamCount++;
    }

    if (filters.bedrooms) {
      countQuery += ` AND l.bedrooms >= $${countParamCount}`;
      countParams.push(filters.bedrooms);
      countParamCount++;
    }

    const countResult = await pool.query(countQuery, countParams);

    return {
      listings: result.rows.map((listing: any) => ({
        ...listing,
        amenities: listing.amenities || [],
        house_rules: listing.house_rules || [],
      })),
      total: parseInt(countResult.rows[0].total),
    };
  } catch (error) {
    console.error('Database error in searchListings:', error);
    throw error;
  }
};

/**
 * Soft delete listing
 */
export const softDeleteListing = async (listingId: string): Promise<void> => {
  try {
    await pool.query(
      `UPDATE listings
       SET deleted_at = NOW(), updated_at = NOW(), is_published = false
       WHERE id = $1 AND deleted_at IS NULL`,
      [listingId]
    );
  } catch (error) {
    console.error('Database error in softDeleteListing:', error);
    throw error;
  }
};

/**
 * Find listings near a location (within radius)
 */
export const findNearbyListings = async (
  centerLat: number,
  centerLon: number,
  radiusKm: number = 10,
  limit: number = 20,
  offset: number = 0,
  filters?: {
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    property_type?: string;
    amenities?: string[];
  }
): Promise<{ listings: (Listing & { distance_km: number })[]; total: number }> => {
  try {
    // Using PostGIS distance calculation
    // Falls back to basic math if PostGIS not available
    let query = `
      SELECT *,
        (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + 
        sin(radians($1)) * sin(radians(latitude)))) AS distance_km
      FROM listings
      WHERE deleted_at IS NULL AND is_published = true
    `;

    const values: any[] = [centerLat, centerLon];
    let paramCount = 3;

    // Add distance filter
    query += ` AND (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
      cos(radians(longitude) - radians($2)) + 
      sin(radians($1)) * sin(radians(latitude)))) <= $${paramCount}`;
    values.push(radiusKm);
    paramCount++;

    // Add price filters
    if (filters?.min_price !== undefined) {
      query += ` AND base_price >= $${paramCount}`;
      values.push(filters.min_price);
      paramCount++;
    }
    if (filters?.max_price !== undefined) {
      query += ` AND base_price <= $${paramCount}`;
      values.push(filters.max_price);
      paramCount++;
    }

    // Add rating filter
    if (filters?.min_rating !== undefined) {
      query += ` AND average_rating >= $${paramCount}`;
      values.push(filters.min_rating);
      paramCount++;
    }

    // Add property type filter
    if (filters?.property_type) {
      query += ` AND property_type = $${paramCount}`;
      values.push(filters.property_type);
      paramCount++;
    }

    // Sort by distance
    query += ` ORDER BY distance_km ASC`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total FROM listings
      WHERE deleted_at IS NULL AND is_published = true
        AND (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + 
        sin(radians($1)) * sin(radians(latitude)))) <= $3
    `;

    const countValues: any[] = [centerLat, centerLon, radiusKm];

    if (filters?.min_price !== undefined) {
      countQuery += ` AND base_price >= $${countValues.length + 1}`;
      countValues.push(filters.min_price);
    }
    if (filters?.max_price !== undefined) {
      countQuery += ` AND base_price <= $${countValues.length + 1}`;
      countValues.push(filters.max_price);
    }
    if (filters?.min_rating !== undefined) {
      countQuery += ` AND average_rating >= $${countValues.length + 1}`;
      countValues.push(filters.min_rating);
    }
    if (filters?.property_type) {
      countQuery += ` AND property_type = $${countValues.length + 1}`;
      countValues.push(filters.property_type);
    }

    const countResult = await pool.query(countQuery, countValues);

    return {
      listings: result.rows.map(row => ({
        ...row,
        amenities: row.amenities || [],
        house_rules: row.house_rules || [],
        distance_km: Math.round(row.distance_km * 100) / 100,
      })),
      total: parseInt(countResult.rows[0].total),
    };
  } catch (error) {
    console.error('Database error in findNearbyListings:', error);
    throw error;
  }
};

/**
 * Find listings within map bounds
 */
export const findListingsInBounds = async (
  south: number,
  west: number,
  north: number,
  east: number,
  limit: number = 100,
  offset: number = 0,
  filters?: {
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    property_type?: string;
  }
): Promise<{ listings: Listing[]; total: number }> => {
  try {
    let query = `
      SELECT * FROM listings
      WHERE deleted_at IS NULL AND is_published = true
        AND latitude >= $1 AND latitude <= $2
        AND longitude >= $3 AND longitude <= $4
    `;

    const values: any[] = [south, north, west, east];
    let paramCount = 5;

    // Add price filters
    if (filters?.min_price !== undefined) {
      query += ` AND base_price >= $${paramCount}`;
      values.push(filters.min_price);
      paramCount++;
    }
    if (filters?.max_price !== undefined) {
      query += ` AND base_price <= $${paramCount}`;
      values.push(filters.max_price);
      paramCount++;
    }

    // Add rating filter
    if (filters?.min_rating !== undefined) {
      query += ` AND average_rating >= $${paramCount}`;
      values.push(filters.min_rating);
      paramCount++;
    }

    // Add property type filter
    if (filters?.property_type) {
      query += ` AND property_type = $${paramCount}`;
      values.push(filters.property_type);
      paramCount++;
    }

    // Sort by rating and recently updated
    query += ` ORDER BY average_rating DESC, updated_at DESC`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total FROM listings
      WHERE deleted_at IS NULL AND is_published = true
        AND latitude >= $1 AND latitude <= $2
        AND longitude >= $3 AND longitude <= $4
    `;

    const countValues: any[] = [south, north, west, east];

    if (filters?.min_price !== undefined) {
      countQuery += ` AND base_price >= $${countValues.length + 1}`;
      countValues.push(filters.min_price);
    }
    if (filters?.max_price !== undefined) {
      countQuery += ` AND base_price <= $${countValues.length + 1}`;
      countValues.push(filters.max_price);
    }
    if (filters?.min_rating !== undefined) {
      countQuery += ` AND average_rating >= $${countValues.length + 1}`;
      countValues.push(filters.min_rating);
    }
    if (filters?.property_type) {
      countQuery += ` AND property_type = $${countValues.length + 1}`;
      countValues.push(filters.property_type);
    }

    const countResult = await pool.query(countQuery, countValues);

    return {
      listings: result.rows.map(row => ({
        ...row,
        amenities: row.amenities || [],
        house_rules: row.house_rules || [],
      })),
      total: parseInt(countResult.rows[0].total),
    };
  } catch (error) {
    console.error('Database error in findListingsInBounds:', error);
    throw error;
  }
};

/**
 * Find listings by city
 */
export const findListingsByCity = async (
  city: string,
  country?: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ listings: Listing[]; total: number }> => {
  try {
    let query = `
      SELECT * FROM listings
      WHERE deleted_at IS NULL AND is_published = true
        AND LOWER(city) = LOWER($1)
    `;

    const values: any[] = [city];

    if (country) {
      query += ` AND LOWER(country) = LOWER($${values.length + 1})`;
      values.push(country);
    }

    query += ` ORDER BY average_rating DESC, updated_at DESC`;
    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total FROM listings
      WHERE deleted_at IS NULL AND is_published = true
        AND LOWER(city) = LOWER($1)
    `;

    const countValues: any[] = [city];

    if (country) {
      countQuery += ` AND LOWER(country) = LOWER($${countValues.length + 1})`;
      countValues.push(country);
    }

    const countResult = await pool.query(countQuery, countValues);

    return {
      listings: result.rows.map(row => ({
        ...row,
        amenities: row.amenities || [],
        house_rules: row.house_rules || [],
      })),
      total: parseInt(countResult.rows[0].total),
    };
  } catch (error) {
    console.error('Database error in findListingsByCity:', error);
    throw error;
  }
};

/**
 * Find listings by country
 */
export const findListingsByCountry = async (
  country: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ listings: Listing[]; total: number }> => {
  try {
    let query = `
      SELECT * FROM listings
      WHERE deleted_at IS NULL AND is_published = true
        AND LOWER(country) = LOWER($1)
      ORDER BY average_rating DESC, updated_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [country, limit, offset]);

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM listings
       WHERE deleted_at IS NULL AND is_published = true
         AND LOWER(country) = LOWER($1)`,
      [country]
    );

    return {
      listings: result.rows.map(row => ({
        ...row,
        amenities: row.amenities || [],
        house_rules: row.house_rules || [],
      })),
      total: parseInt(countResult.rows[0].total),
    };
  } catch (error) {
    console.error('Database error in findListingsByCountry:', error);
    throw error;
  }
};
