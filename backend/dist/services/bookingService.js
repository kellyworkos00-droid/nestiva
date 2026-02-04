import { findBookingById, findBookingsByGuestId, findBookingsByHostId, findBookingsByListingId, checkAvailability, createBooking, confirmBooking as confirmBookingModel, rejectBooking as rejectBookingModel, cancelBooking as cancelBookingModel, checkInBooking as checkInBookingModel, checkOutBooking as checkOutBookingModel, updatePaymentStatus, getListingBookingStats, getUpcomingBookings as getUpcomingBookingsModel, } from '../models/bookingModel';
import { findListingById } from '../models/listingModel';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { isValidDateRange } from '../utils/validators';
/**
 * Booking Service - Handles booking operations
 */
/**
 * Calculate booking pricing
 */
const calculateBookingPrice = (basePrice, cleaningFee, numberOfNights, discountAmount = 0) => {
    const basePriceTotal = basePrice * numberOfNights;
    const serviceFee = basePriceTotal * 0.03; // 3% service fee
    const total = basePriceTotal + cleaningFee + serviceFee - discountAmount;
    return {
        base: basePriceTotal,
        cleaning: cleaningFee,
        service: serviceFee,
        discount: discountAmount,
        total: Math.max(total, 0),
    };
};
/**
 * Calculate number of nights between dates
 */
const calculateNights = (checkIn, checkOut) => {
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
/**
 * Create a new booking
 */
export const createNewBooking = async (guestId, bookingData) => {
    // Validate dates
    if (!isValidDateRange(bookingData.check_in_date, bookingData.check_out_date)) {
        throw new ValidationError('Invalid date range. Check-in must be before check-out and both must be in the future.');
    }
    // Get listing details
    const listing = await findListingById(bookingData.listing_id);
    if (!listing) {
        throw new NotFoundError('Listing');
    }
    if (!listing.is_published) {
        throw new ValidationError('This listing is not available for booking.');
    }
    // Validate guest count
    if (bookingData.number_of_guests < 1 || bookingData.number_of_guests > listing.max_guests) {
        throw new ValidationError(`Guest count must be between 1 and ${listing.max_guests}`);
    }
    // Check availability
    const isAvailable = await checkAvailability(bookingData.listing_id, bookingData.check_in_date, bookingData.check_out_date);
    if (!isAvailable) {
        throw new ConflictError('This listing is not available for the selected dates.');
    }
    // Calculate nights and pricing
    const numberOfNights = calculateNights(bookingData.check_in_date, bookingData.check_out_date);
    // TODO: Apply discount code if provided
    const discountAmount = 0;
    const pricing = calculateBookingPrice(listing.base_price, listing.cleaning_fee, numberOfNights, discountAmount);
    // Create booking
    const booking = await createBooking({
        listing_id: bookingData.listing_id,
        guest_id: guestId,
        host_id: listing.host_id,
        check_in_date: bookingData.check_in_date,
        check_out_date: bookingData.check_out_date,
        number_of_guests: bookingData.number_of_guests,
        number_of_nights: numberOfNights,
        base_price: pricing.base,
        cleaning_fee: pricing.cleaning,
        service_fee: pricing.service,
        discount_amount: pricing.discount,
        discount_code: bookingData.discount_code,
        total_price: pricing.total,
        currency: listing.currency,
        special_requests: bookingData.special_requests,
        guest_message: bookingData.guest_message,
    });
    return booking;
};
/**
 * Get booking details
 */
export const getBookingDetails = async (bookingId, userId) => {
    const booking = await findBookingById(bookingId);
    if (!booking) {
        throw new NotFoundError('Booking');
    }
    // Verify user has access to this booking
    if (booking.guest_id !== userId && booking.host_id !== userId) {
        throw new Error('Unauthorized: You do not have access to this booking');
    }
    return booking;
};
/**
 * Get guest bookings
 */
export const getGuestBookings = async (guestId, status, limit = 20, offset = 0) => {
    return await findBookingsByGuestId(guestId, status, limit, offset);
};
/**
 * Get host bookings
 */
export const getHostBookings = async (hostId, status, limit = 20, offset = 0) => {
    return await findBookingsByHostId(hostId, status, limit, offset);
};
/**
 * Get bookings for a listing
 */
export const getListingBookings = async (listingId, hostId, limit = 20, offset = 0) => {
    // Verify host owns the listing
    const listing = await findListingById(listingId);
    if (!listing) {
        throw new NotFoundError('Listing');
    }
    if (listing.host_id !== hostId) {
        throw new Error('Unauthorized: You do not own this listing');
    }
    return await findBookingsByListingId(listingId, limit, offset);
};
/**
 * Confirm booking (host accepts)
 */
export const confirmBooking = async (bookingId, hostId, hostResponse) => {
    const booking = await findBookingById(bookingId);
    if (!booking) {
        throw new NotFoundError('Booking');
    }
    // Verify host owns this booking
    if (booking.host_id !== hostId) {
        throw new Error('Unauthorized: You cannot confirm this booking');
    }
    // Verify booking is pending
    if (booking.status !== 'pending') {
        throw new ValidationError('Only pending bookings can be confirmed');
    }
    // Double-check availability
    const isAvailable = await checkAvailability(booking.listing_id, booking.check_in_date, booking.check_out_date, bookingId);
    if (!isAvailable) {
        throw new ConflictError('This listing is no longer available for the selected dates.');
    }
    return await confirmBookingModel(bookingId, hostResponse);
};
/**
 * Reject booking (host declines)
 */
export const rejectBooking = async (bookingId, hostId, hostResponse) => {
    const booking = await findBookingById(bookingId);
    if (!booking) {
        throw new NotFoundError('Booking');
    }
    // Verify host owns this booking
    if (booking.host_id !== hostId) {
        throw new Error('Unauthorized: You cannot reject this booking');
    }
    // Verify booking is pending
    if (booking.status !== 'pending') {
        throw new ValidationError('Only pending bookings can be rejected');
    }
    return await rejectBookingModel(bookingId, hostResponse);
};
/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId, userId, cancellationReason) => {
    const booking = await findBookingById(bookingId);
    if (!booking) {
        throw new NotFoundError('Booking');
    }
    // Verify user is guest or host
    const isGuest = booking.guest_id === userId;
    const isHost = booking.host_id === userId;
    if (!isGuest && !isHost) {
        throw new Error('Unauthorized: You cannot cancel this booking');
    }
    // Verify booking can be cancelled
    if (booking.status === 'cancelled' || booking.status === 'completed') {
        throw new ValidationError('This booking cannot be cancelled');
    }
    const cancelledBy = isGuest ? 'guest' : 'host';
    // Calculate refund based on cancellation policy and timing
    let refundAmount = 0;
    const now = new Date();
    const checkInDate = new Date(booking.check_in_date);
    const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    // Get listing to check cancellation policy
    const listing = await findListingById(booking.listing_id);
    if (listing) {
        switch (listing.cancellation_policy) {
            case 'flexible':
                // Full refund if cancelled 24 hours before check-in
                if (daysUntilCheckIn >= 1) {
                    refundAmount = booking.total_price;
                }
                break;
            case 'moderate':
                // Full refund if cancelled 5 days before check-in
                if (daysUntilCheckIn >= 5) {
                    refundAmount = booking.total_price;
                }
                else if (daysUntilCheckIn >= 1) {
                    refundAmount = booking.total_price * 0.5;
                }
                break;
            case 'strict':
                // Full refund if cancelled 7 days before check-in
                if (daysUntilCheckIn >= 7) {
                    refundAmount = booking.total_price;
                }
                else if (daysUntilCheckIn >= 1) {
                    refundAmount = booking.total_price * 0.5;
                }
                break;
            case 'super_strict':
                // 50% refund if cancelled 30 days before, no refund after
                if (daysUntilCheckIn >= 30) {
                    refundAmount = booking.total_price * 0.5;
                }
                break;
        }
    }
    const cancelledBooking = await cancelBookingModel(bookingId, cancelledBy, cancellationReason);
    // TODO: Process refund through payment provider
    if (refundAmount > 0 && booking.payment_status === 'completed') {
        // await processRefund(booking.payment_intent_id, refundAmount);
    }
    return {
        booking: cancelledBooking,
        refundAmount,
    };
};
/**
 * Check-in booking
 */
export const checkInBooking = async (bookingId, userId) => {
    const booking = await findBookingById(bookingId);
    if (!booking) {
        throw new NotFoundError('Booking');
    }
    // Verify user is guest or host
    if (booking.guest_id !== userId && booking.host_id !== userId) {
        throw new Error('Unauthorized: You cannot check-in this booking');
    }
    // Verify booking is confirmed
    if (booking.status !== 'confirmed') {
        throw new ValidationError('Only confirmed bookings can be checked in');
    }
    // Verify check-in date is today or past
    const now = new Date();
    const checkInDate = new Date(booking.check_in_date);
    checkInDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    if (checkInDate > now) {
        throw new ValidationError('Cannot check-in before check-in date');
    }
    return await checkInBookingModel(bookingId);
};
/**
 * Check-out booking
 */
export const checkOutBooking = async (bookingId, userId) => {
    const booking = await findBookingById(bookingId);
    if (!booking) {
        throw new NotFoundError('Booking');
    }
    // Verify user is guest or host
    if (booking.guest_id !== userId && booking.host_id !== userId) {
        throw new Error('Unauthorized: You cannot check-out this booking');
    }
    // Verify booking is checked-in
    if (booking.booking_stage !== 'checked_in') {
        throw new ValidationError('Booking must be checked-in before checking out');
    }
    return await checkOutBookingModel(bookingId);
};
/**
 * Get booking statistics for a listing
 */
export const getBookingStats = async (listingId, hostId) => {
    // Verify host owns the listing
    const listing = await findListingById(listingId);
    if (!listing) {
        throw new NotFoundError('Listing');
    }
    if (listing.host_id !== hostId) {
        throw new Error('Unauthorized: You do not own this listing');
    }
    return await getListingBookingStats(listingId);
};
/**
 * Get upcoming bookings for a host
 */
export const getUpcomingBookings = async (hostId, limit = 10) => {
    return await getUpcomingBookingsModel(hostId, limit);
};
/**
 * Update booking payment status
 */
export const updateBookingPayment = async (bookingId, paymentStatus, paymentIntentId) => {
    const booking = await findBookingById(bookingId);
    if (!booking) {
        throw new NotFoundError('Booking');
    }
    return await updatePaymentStatus(bookingId, paymentStatus, paymentIntentId);
};
//# sourceMappingURL=bookingService.js.map