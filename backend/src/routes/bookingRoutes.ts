import express, { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { requireAuthMiddleware } from '../middleware/auth';

const router: Router = express.Router();

/**
 * Booking Routes
 * Base: /api/v1/bookings
 */

// Create booking (protected)
router.post('/', requireAuthMiddleware, bookingController.createBooking);

// Get my bookings as guest (protected)
router.get('/my-bookings', requireAuthMiddleware, bookingController.getMyBookings);

// Get bookings to manage as host (protected)
router.get('/host-bookings', requireAuthMiddleware, bookingController.getHostBookingsToManage);

// Get upcoming bookings (protected)
router.get('/upcoming', requireAuthMiddleware, bookingController.getUpcomingBookings);

// Get booking by ID (protected)
router.get('/:bookingId', requireAuthMiddleware, bookingController.getBooking);

// Confirm booking (protected - host only)
router.post('/:bookingId/confirm', requireAuthMiddleware, bookingController.confirmBooking);

// Reject booking (protected - host only)
router.post('/:bookingId/reject', requireAuthMiddleware, bookingController.rejectBooking);

// Cancel booking (protected - guest or host)
router.post('/:bookingId/cancel', requireAuthMiddleware, bookingController.cancelBooking);

// Check-in booking (protected)
router.post('/:bookingId/check-in', requireAuthMiddleware, bookingController.checkInBooking);

// Check-out booking (protected)
router.post('/:bookingId/check-out', requireAuthMiddleware, bookingController.checkOutBooking);

// Get bookings for a listing (protected - host only)
router.get('/listing/:listingId', requireAuthMiddleware, bookingController.getListingBookings_);

// Get booking statistics for a listing (protected - host only)
router.get('/listing/:listingId/stats', requireAuthMiddleware, bookingController.getListingBookingStats);

export default router;
