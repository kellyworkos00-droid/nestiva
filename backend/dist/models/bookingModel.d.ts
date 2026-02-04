import { Booking } from '../types/index';
/**
 * Booking model - Database query functions
 */
/**
 * Find booking by ID
 */
export declare const findBookingById: (bookingId: string) => Promise<Booking | null>;
/**
 * Find bookings by guest ID
 */
export declare const findBookingsByGuestId: (guestId: string, status?: string, limit?: number, offset?: number) => Promise<{
    bookings: Booking[];
    total: number;
}>;
/**
 * Find bookings by host ID
 */
export declare const findBookingsByHostId: (hostId: string, status?: string, limit?: number, offset?: number) => Promise<{
    bookings: Booking[];
    total: number;
}>;
/**
 * Find bookings by listing ID
 */
export declare const findBookingsByListingId: (listingId: string, limit?: number, offset?: number) => Promise<{
    bookings: Booking[];
    total: number;
}>;
/**
 * Check availability for a listing between dates
 */
export declare const checkAvailability: (listingId: string, checkInDate: Date, checkOutDate: Date, excludeBookingId?: string) => Promise<boolean>;
/**
 * Create new booking
 */
export declare const createBooking: (bookingData: {
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
}) => Promise<Booking>;
/**
 * Update booking status
 */
export declare const updateBookingStatus: (bookingId: string, status: "pending" | "confirmed" | "cancelled" | "completed" | "dispute", bookingStage?: "awaiting_host" | "awaiting_guest" | "confirmed" | "checked_in" | "checked_out") => Promise<Booking>;
/**
 * Confirm booking (host accepts)
 */
export declare const confirmBooking: (bookingId: string, hostResponse?: string) => Promise<Booking>;
/**
 * Reject booking (host declines)
 */
export declare const rejectBooking: (bookingId: string, hostResponse?: string) => Promise<Booking>;
/**
 * Cancel booking
 */
export declare const cancelBooking: (bookingId: string, cancelledBy: "guest" | "host" | "admin", cancellationReason?: string) => Promise<Booking>;
/**
 * Check-in booking
 */
export declare const checkInBooking: (bookingId: string) => Promise<Booking>;
/**
 * Check-out booking
 */
export declare const checkOutBooking: (bookingId: string) => Promise<Booking>;
/**
 * Update payment status
 */
export declare const updatePaymentStatus: (bookingId: string, paymentStatus: "pending" | "completed" | "refunded" | "failed", paymentIntentId?: string) => Promise<Booking>;
/**
 * Get booking statistics for a listing
 */
export declare const getListingBookingStats: (listingId: string) => Promise<{
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
//# sourceMappingURL=bookingModel.d.ts.map