import { pool } from '../config/database';
import { Booking } from '../types/index';
import { NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

/**
 * Booking model - Database query functions
 */

/**
 * Find booking by ID
 */
export const findBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE id = $1`,
      [bookingId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Database error in findBookingById:', error);
    throw error;
  }
};

/**
 * Find bookings by guest ID
 */
export const findBookingsByGuestId = async (
  guestId: string,
  status?: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ bookings: Booking[]; total: number }> => {
  try {
    let query = `SELECT * FROM bookings WHERE guest_id = $1`;
    const params: any[] = [guestId];
    let paramCount = 2;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM bookings WHERE guest_id = $1`;
    const countParams: any[] = [guestId];
    if (status) {
      countQuery += ` AND status = $2`;
      countParams.push(status);
    }
    const countResult = await pool.query(countQuery, countParams);

    return {
      bookings: result.rows,
      total: parseInt(countResult.rows[0].total),
    };
  } catch (error) {
    console.error('Database error in findBookingsByGuestId:', error);
    throw error;
  }
};

/**
 * Find bookings by host ID
 */
export const findBookingsByHostId = async (
  hostId: string,
  status?: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ bookings: Booking[]; total: number }> => {
  try {
    let query = `SELECT * FROM bookings WHERE host_id = $1`;
    const params: any[] = [hostId];
    let paramCount = 2;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM bookings WHERE host_id = $1`;
    const countParams: any[] = [hostId];
    if (status) {
      countQuery += ` AND status = $2`;
      countParams.push(status);
    }
    const countResult = await pool.query(countQuery, countParams);

    return {
      bookings: result.rows,
      total: parseInt(countResult.rows[0].total),
    };
  } catch (error) {
    console.error('Database error in findBookingsByHostId:', error);
    throw error;
  }
};

/**
 * Find bookings by listing ID
 */
export const findBookingsByListingId = async (
  listingId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ bookings: Booking[]; total: number }> => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings 
       WHERE listing_id = $1 
       ORDER BY check_in_date DESC 
       LIMIT $2 OFFSET $3`,
      [listingId, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM bookings WHERE listing_id = $1`,
      [listingId]
    );

    return {
      bookings: result.rows,
      total: parseInt(countResult.rows[0].total),
    };
  } catch (error) {
    console.error('Database error in findBookingsByListingId:', error);
    throw error;
  }
};

/**
 * Check availability for a listing between dates
 */
export const checkAvailability = async (
  listingId: string,
  checkInDate: Date,
  checkOutDate: Date,
  excludeBookingId?: string
): Promise<boolean> => {
  try {
    let query = `
      SELECT COUNT(*) as count FROM bookings
      WHERE listing_id = $1
      AND status IN ('pending', 'confirmed')
      AND (
        (check_in_date < $3 AND check_out_date > $2)
        OR (check_in_date >= $2 AND check_in_date < $3)
        OR (check_out_date > $2 AND check_out_date <= $3)
      )
    `;
    const params: any[] = [listingId, checkInDate, checkOutDate];

    if (excludeBookingId) {
      query += ` AND id != $4`;
      params.push(excludeBookingId);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count) === 0;
  } catch (error) {
    console.error('Database error in checkAvailability:', error);
    throw error;
  }
};

/**
 * Create new booking
 */
export const createBooking = async (bookingData: {
  listing_id: string;
  guest_id: string;
  host_id: string;
  check_in_date: Date;
  check_out_date: Date;
  number_of_guests: number;
  number_of_nights: number;
  base_price: number;
  cleaning_fee: number;
  service_fee: number;
  discount_amount: number;
  discount_code?: string;
  total_price: number;
  currency: string;
  special_requests?: string;
  guest_message?: string;
}): Promise<Booking> => {
  try {
    const bookingId = uuidv4();
    const now = new Date();

    const result = await pool.query(
      `INSERT INTO bookings (
        id, listing_id, guest_id, host_id, check_in_date, check_out_date,
        number_of_guests, number_of_nights, status, booking_stage,
        base_price, cleaning_fee, service_fee, discount_amount, discount_code,
        total_price, currency, payment_status, special_requests, guest_message,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22
      ) RETURNING *`,
      [
        bookingId,
        bookingData.listing_id,
        bookingData.guest_id,
        bookingData.host_id,
        bookingData.check_in_date,
        bookingData.check_out_date,
        bookingData.number_of_guests,
        bookingData.number_of_nights,
        'pending',
        'awaiting_host',
        bookingData.base_price,
        bookingData.cleaning_fee,
        bookingData.service_fee,
        bookingData.discount_amount,
        bookingData.discount_code || null,
        bookingData.total_price,
        bookingData.currency,
        'pending',
        bookingData.special_requests || null,
        bookingData.guest_message || null,
        now,
        now,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Database error in createBooking:', error);
    throw error;
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'dispute',
  bookingStage?: 'awaiting_host' | 'awaiting_guest' | 'confirmed' | 'checked_in' | 'checked_out'
): Promise<Booking> => {
  try {
    let query = `UPDATE bookings SET status = $1, updated_at = NOW()`;
    const params: any[] = [status];
    let paramCount = 2;

    if (bookingStage) {
      query += `, booking_stage = $${paramCount}`;
      params.push(bookingStage);
      paramCount++;
    }

    query += ` WHERE id = $${paramCount} RETURNING *`;
    params.push(bookingId);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      throw new NotFoundError('Booking');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database error in updateBookingStatus:', error);
    throw error;
  }
};

/**
 * Confirm booking (host accepts)
 */
export const confirmBooking = async (
  bookingId: string,
  hostResponse?: string
): Promise<Booking> => {
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = $1, booking_stage = $2, host_response = $3,
           host_response_at = NOW(), updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      ['confirmed', 'confirmed', hostResponse || null, bookingId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Booking');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database error in confirmBooking:', error);
    throw error;
  }
};

/**
 * Reject booking (host declines)
 */
export const rejectBooking = async (
  bookingId: string,
  hostResponse?: string
): Promise<Booking> => {
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = $1, host_response = $2, host_response_at = NOW(),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      ['cancelled', hostResponse || null, bookingId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Booking');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database error in rejectBooking:', error);
    throw error;
  }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (
  bookingId: string,
  cancelledBy: 'guest' | 'host' | 'admin',
  cancellationReason?: string
): Promise<Booking> => {
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = $1, cancellation_requested_by = $2,
           cancellation_reason = $3, cancelled_at = NOW(), updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      ['cancelled', cancelledBy, cancellationReason || null, bookingId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Booking');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database error in cancelBooking:', error);
    throw error;
  }
};

/**
 * Check-in booking
 */
export const checkInBooking = async (bookingId: string): Promise<Booking> => {
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET booking_stage = $1, updated_at = NOW()
       WHERE id = $2 AND status = 'confirmed'
       RETURNING *`,
      ['checked_in', bookingId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Booking or booking not confirmed');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database error in checkInBooking:', error);
    throw error;
  }
};

/**
 * Check-out booking
 */
export const checkOutBooking = async (bookingId: string): Promise<Booking> => {
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET booking_stage = $1, status = $2, updated_at = NOW()
       WHERE id = $3 AND status = 'confirmed'
       RETURNING *`,
      ['checked_out', 'completed', bookingId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Booking or booking not confirmed');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database error in checkOutBooking:', error);
    throw error;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  bookingId: string,
  paymentStatus: 'pending' | 'completed' | 'refunded' | 'failed',
  paymentIntentId?: string
): Promise<Booking> => {
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET payment_status = $1, payment_intent_id = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [paymentStatus, paymentIntentId || null, bookingId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Booking');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database error in updatePaymentStatus:', error);
    throw error;
  }
};

/**
 * Get booking statistics for a listing
 */
export const getListingBookingStats = async (
  listingId: string
): Promise<{
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  occupancyRate: number;
}> => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'confirmed' OR status = 'completed' THEN 1 END) as confirmed_bookings,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN total_price END), 0) as average_booking_value,
        COALESCE(SUM(CASE WHEN status = 'confirmed' OR status = 'completed' THEN number_of_nights ELSE 0 END), 0) as total_nights
       FROM bookings
       WHERE listing_id = $1`,
      [listingId]
    );

    const stats = result.rows[0];
    
    // Calculate occupancy rate (simplified - assumes 30 days window)
    const occupancyRate = (parseInt(stats.total_nights) / 30) * 100;

    return {
      totalBookings: parseInt(stats.total_bookings),
      confirmedBookings: parseInt(stats.confirmed_bookings),
      totalRevenue: parseFloat(stats.total_revenue),
      averageBookingValue: parseFloat(stats.average_booking_value),
      occupancyRate: Math.min(occupancyRate, 100), // Cap at 100%
    };
  } catch (error) {
    console.error('Database error in getListingBookingStats:', error);
    throw error;
  }
};

/**
 * Get upcoming bookings for a host
 */
export const getUpcomingBookings = async (
  hostId: string,
  limit: number = 10
): Promise<Booking[]> => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings
       WHERE host_id = $1
       AND status = 'confirmed'
       AND check_in_date >= NOW()
       ORDER BY check_in_date ASC
       LIMIT $2`,
      [hostId, limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Database error in getUpcomingBookings:', error);
    throw error;
  }
};
