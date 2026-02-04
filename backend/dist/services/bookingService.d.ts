import { Booking } from '../types/index';
/**
 * Create a new booking
 */
export declare const createNewBooking: (guestId: string, bookingData: {
    listing_id: string;
    check_in_date: Date;
    check_out_date: Date;
    number_of_guests: number;
    special_requests?: string;
    guest_message?: string;
    discount_code?: string;
}) => Promise<Booking>;
/**
 * Get booking details
 */
export declare const getBookingDetails: (bookingId: string, userId: string) => Promise<Booking>;
/**
 * Get guest bookings
 */
export declare const getGuestBookings: (guestId: string, status?: string, limit?: number, offset?: number) => Promise<{
    bookings: Booking[];
    total: number;
}>;
/**
 * Get host bookings
 */
export declare const getHostBookings: (hostId: string, status?: string, limit?: number, offset?: number) => Promise<{
    bookings: Booking[];
    total: number;
}>;
/**
 * Get bookings for a listing
 */
export declare const getListingBookings: (listingId: string, hostId: string, limit?: number, offset?: number) => Promise<{
    bookings: Booking[];
    total: number;
}>;
/**
 * Confirm booking (host accepts)
 */
export declare const confirmBooking: (bookingId: string, hostId: string, hostResponse?: string) => Promise<Booking>;
/**
 * Reject booking (host declines)
 */
export declare const rejectBooking: (bookingId: string, hostId: string, hostResponse?: string) => Promise<Booking>;
/**
 * Cancel booking
 */
export declare const cancelBooking: (bookingId: string, userId: string, cancellationReason?: string) => Promise<{
    booking: Booking;
    refundAmount: number;
}>;
/**
 * Check-in booking
 */
export declare const checkInBooking: (bookingId: string, userId: string) => Promise<Booking>;
/**
 * Check-out booking
 */
export declare const checkOutBooking: (bookingId: string, userId: string) => Promise<Booking>;
/**
 * Get booking statistics for a listing
 */
export declare const getBookingStats: (listingId: string, hostId: string) => Promise<{
    totalBookings: number;
    confirmedBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    occupancyRate: number;
}>;
/**
 * Get upcoming bookings for a host
 */
export declare const getUpcomingBookings: (hostId: string, limit?: number) => Promise<Booking[]>;
/**
 * Update booking payment status
 */
export declare const updateBookingPayment: (bookingId: string, paymentStatus: "pending" | "completed" | "refunded" | "failed", paymentIntentId?: string) => Promise<Booking>;
//# sourceMappingURL=bookingService.d.ts.map