/**
 * Payment Service
 * Business logic for payment transactions and host commissions
 */
import * as paymentModel from '../models/paymentModel.js';
import * as bookingModel from '../models/bookingModel.js';
import * as listingModel from '../models/listingModel.js';
import * as userModel from '../models/userModel.js';
import { NotFoundError, UnauthorizedError, ValidationError, BadRequestError } from '../utils/errors.js';
// Platform commission rate (percentage)
const DEFAULT_COMMISSION_RATE = 15; // 15% commission from hosts
/**
 * Create host commission transaction when booking is confirmed
 */
export async function createHostCommissionForBooking(bookingId) {
    // Get booking details
    const booking = await bookingModel.findBookingById(bookingId);
    if (!booking) {
        throw new NotFoundError('Booking not found');
    }
    // Check if booking is confirmed
    if (booking.status !== 'confirmed') {
        throw new BadRequestError('Commission can only be created for confirmed bookings');
    }
    // Check if commission already exists
    const existingTransactions = await paymentModel.findPaymentTransactionsByBookingId(bookingId);
    const existingCommission = existingTransactions.find(tx => tx.transaction_type === 'host_commission');
    if (existingCommission) {
        throw new BadRequestError('Commission transaction already exists for this booking');
    }
    // Get listing to verify host
    const listing = await listingModel.findListingById(booking.listing_id);
    if (!listing) {
        throw new NotFoundError('Listing not found');
    }
    // Calculate commission
    const bookingTotal = parseFloat(booking.total_price.toString());
    const commissionCalc = await paymentModel.calculateCommission(bookingTotal, DEFAULT_COMMISSION_RATE);
    // Calculate payment due date (7 days after check-out)
    const checkOutDate = new Date(booking.check_out_date);
    const paymentDueDate = new Date(checkOutDate);
    paymentDueDate.setDate(paymentDueDate.getDate() + 7);
    // Create commission transaction
    const transaction = await paymentModel.createPaymentTransaction({
        booking_id: bookingId,
        listing_id: booking.listing_id,
        host_id: listing.host_id,
        guest_id: booking.guest_id,
        transaction_type: 'host_commission',
        booking_total: bookingTotal,
        commission_rate: DEFAULT_COMMISSION_RATE,
        commission_amount: commissionCalc.commission_amount,
        net_amount: commissionCalc.net_amount,
        currency: booking.currency || 'USD',
        payment_due_date: paymentDueDate,
        description: `Platform commission for booking ${bookingId}`,
        metadata: {
            listing_title: listing.title,
            check_in_date: booking.check_in_date,
            check_out_date: booking.check_out_date
        }
    });
    return transaction;
}
/**
 * Get payment transaction details
 */
export async function getPaymentTransaction(transactionId, userId) {
    const transaction = await paymentModel.findPaymentTransactionById(transactionId);
    if (!transaction) {
        throw new NotFoundError('Payment transaction not found');
    }
    // Verify user is authorized to view this transaction
    if (transaction.host_id !== userId && transaction.guest_id !== userId) {
        throw new UnauthorizedError('You are not authorized to view this transaction');
    }
    return transaction;
}
/**
 * Get host's payment transactions
 */
export async function getHostPaymentTransactions(hostId, options = {}) {
    // Verify user is a host
    const user = await userModel.findUserById(hostId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    if (user.user_type !== 'host' && user.user_type !== 'both') {
        throw new BadRequestError('User is not a host');
    }
    return paymentModel.findPaymentTransactionsByHostId(hostId, options);
}
/**
 * Get host earnings summary
 */
export async function getHostEarnings(hostId) {
    // Verify user is a host
    const user = await userModel.findUserById(hostId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    if (user.user_type !== 'host' && user.user_type !== 'both') {
        throw new BadRequestError('User is not a host');
    }
    const summary = await paymentModel.getHostEarningsSummary(hostId);
    return {
        ...summary,
        commission_rate: DEFAULT_COMMISSION_RATE
    };
}
/**
 * Get pending commissions for host
 */
export async function getPendingCommissions(hostId) {
    // Verify user is a host
    const user = await userModel.findUserById(hostId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    const result = await paymentModel.getPendingCommissionsForHost(hostId);
    return {
        ...result,
        currency: 'USD'
    };
}
/**
 * Process commission payment (mark as paid)
 */
export async function processCommissionPayment(transactionId, hostId, paymentDetails) {
    // Get transaction
    const transaction = await paymentModel.findPaymentTransactionById(transactionId);
    if (!transaction) {
        throw new NotFoundError('Payment transaction not found');
    }
    // Verify host owns this transaction
    if (transaction.host_id !== hostId) {
        throw new UnauthorizedError('You are not authorized to process this payment');
    }
    // Verify transaction is pending
    if (transaction.status !== 'pending') {
        throw new BadRequestError(`Transaction is already ${transaction.status}`);
    }
    // Verify it's a commission transaction
    if (transaction.transaction_type !== 'host_commission') {
        throw new BadRequestError('Only commission transactions can be processed through this endpoint');
    }
    // Mark as paid
    const updatedTransaction = await paymentModel.markCommissionAsPaid(transactionId, paymentDetails);
    return updatedTransaction;
}
/**
 * Get platform revenue summary (admin only)
 */
export async function getPlatformRevenue(adminId, options = {}) {
    // TODO: Verify admin role when admin system is implemented
    const summary = await paymentModel.getPlatformRevenueSummary(options.startDate, options.endDate);
    return {
        ...summary,
        commission_rate: DEFAULT_COMMISSION_RATE
    };
}
/**
 * Calculate commission for a booking amount
 */
export async function calculateCommissionPreview(bookingAmount) {
    if (bookingAmount <= 0) {
        throw new ValidationError('Booking amount must be greater than 0');
    }
    const calc = await paymentModel.calculateCommission(bookingAmount, DEFAULT_COMMISSION_RATE);
    return {
        booking_amount: bookingAmount,
        commission_rate: DEFAULT_COMMISSION_RATE,
        commission_amount: calc.commission_amount,
        host_net_amount: calc.net_amount,
        currency: 'USD'
    };
}
/**
 * Fail a commission payment
 */
export async function failCommissionPayment(transactionId, reason) {
    const transaction = await paymentModel.findPaymentTransactionById(transactionId);
    if (!transaction) {
        throw new NotFoundError('Payment transaction not found');
    }
    if (transaction.status !== 'pending' && transaction.status !== 'processing') {
        throw new BadRequestError('Can only fail pending or processing transactions');
    }
    return paymentModel.updatePaymentTransactionStatus(transactionId, 'failed', {
        failureReason: reason
    });
}
/**
 * Get commission rate
 */
export function getCommissionRate() {
    return DEFAULT_COMMISSION_RATE;
}
/**
 * Update transaction status (internal use)
 */
export async function updateTransactionStatus(transactionId, status, options = {}) {
    return paymentModel.updatePaymentTransactionStatus(transactionId, status, options);
}
//# sourceMappingURL=paymentService.js.map