import { Request, Response, NextFunction } from 'express';
/**
 * Booking Controller - Handles booking requests
 */
/**
 * Create new booking
 */
export declare const createBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get booking by ID
 */
export declare const getBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get my bookings (as guest)
 */
export declare const getMyBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get bookings to manage (as host)
 */
export declare const getHostBookingsToManage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get bookings for a specific listing
 */
export declare const getListingBookings_: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Confirm booking (host accepts)
 */
export declare const confirmBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Reject booking (host declines)
 */
export declare const rejectBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Cancel booking
 */
export declare const cancelBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Check-in booking
 */
export declare const checkInBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Check-out booking
 */
export declare const checkOutBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get booking statistics for a listing
 */
export declare const getListingBookingStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get upcoming bookings for host
 */
export declare const getUpcomingBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=bookingController.d.ts.map