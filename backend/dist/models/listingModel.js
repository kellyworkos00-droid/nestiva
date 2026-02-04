import { pool } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';
/**
 * Listing model - Database query functions
 */
/**
 * Find listing by ID
 */
export const findListingById = async (listingId) => {
    try {
        const result = await pool.query(`SELECT * FROM listings WHERE id = $1 AND deleted_at IS NULL`, [listingId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    catch (error) {
        console.error('Database error in findListingById:', error);
        throw error;
    }
};
/**
 * Get all listings by host ID
 */
export const findListingsByHostId = async (hostId, limit = 20, offset = 0) => {
    try {
        const result = await pool.query(`SELECT * FROM listings
       WHERE host_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`, [hostId, limit, offset]);
        const countResult = await pool.query(`SELECT COUNT(*) as total FROM listings
       WHERE host_id = $1 AND deleted_at IS NULL`, [hostId]);
        return {
            listings: result.rows,
            total: parseInt(countResult.rows[0].total),
        };
    }
    catch (error) {
        console.error('Database error in findListingsByHostId:', error);
        throw error;
    }
};
/**
 * Create new listing
 */
export const createListing = async (userData) => {
    try {
        const listingId = uuidv4();
        const now = new Date();
        const result = await pool.query(`INSERT INTO listings (
        id, host_id, title, description, category, property_type, address, city,
        country, latitude, longitude, max_guests, bedrooms, beds, bathrooms,
        amenities, house_rules, cancellation_policy, base_price, currency,
        cleaning_fee, service_fee_percentage, is_published, availability_status,
        instant_book_enabled, view_count, review_count, average_rating,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
      ) RETURNING *`, [
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
            userData.currency,
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
        ]);
        // Parse JSONB fields
        const listing = result.rows[0];
        listing.amenities = listing.amenities || [];
        listing.house_rules = listing.house_rules || [];
        return listing;
    }
    catch (error) {
        console.error('Database error in createListing:', error);
        throw error;
    }
};
/**
 * Update listing
 */
export const updateListing = async (listingId, updates) => {
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
        const updateFields = [];
        const values = [];
        let paramCount = 1;
        for (const field of allowedFields) {
            if (field in updates) {
                const value = updates[field];
                if (field === 'amenities' || field === 'house_rules') {
                    updateFields.push(`${field} = $${paramCount}`);
                    values.push(JSON.stringify(value));
                }
                else {
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
    }
    catch (error) {
        console.error('Database error in updateListing:', error);
        throw error;
    }
};
/**
 * Publish/unpublish listing
 */
export const togglePublishListing = async (listingId, isPublished) => {
    try {
        const result = await pool.query(`UPDATE listings
       SET is_published = $1, updated_at = NOW()
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING *`, [isPublished, listingId]);
        if (result.rows.length === 0) {
            throw new NotFoundError('Listing');
        }
        const listing = result.rows[0];
        listing.amenities = listing.amenities || [];
        listing.house_rules = listing.house_rules || [];
        return listing;
    }
    catch (error) {
        console.error('Database error in togglePublishListing:', error);
        throw error;
    }
};
/**
 * Increment view count
 */
export const incrementViewCount = async (listingId) => {
    try {
        await pool.query(`UPDATE listings
       SET view_count = view_count + 1, updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`, [listingId]);
    }
    catch (error) {
        console.error('Database error in incrementViewCount:', error);
        throw error;
    }
};
/**
 * Search listings with filters
 */
export const searchListings = async (filters, limit = 20, offset = 0) => {
    try {
        let query = `
      SELECT DISTINCT l.* FROM listings l
      WHERE l.deleted_at IS NULL AND l.is_published = true
    `;
        const params = [];
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
        const countParams = [];
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
            listings: result.rows.map((listing) => ({
                ...listing,
                amenities: listing.amenities || [],
                house_rules: listing.house_rules || [],
            })),
            total: parseInt(countResult.rows[0].total),
        };
    }
    catch (error) {
        console.error('Database error in searchListings:', error);
        throw error;
    }
};
/**
 * Soft delete listing
 */
export const softDeleteListing = async (listingId) => {
    try {
        await pool.query(`UPDATE listings
       SET deleted_at = NOW(), updated_at = NOW(), is_published = false
       WHERE id = $1 AND deleted_at IS NULL`, [listingId]);
    }
    catch (error) {
        console.error('Database error in softDeleteListing:', error);
        throw error;
    }
};
//# sourceMappingURL=listingModel.js.map