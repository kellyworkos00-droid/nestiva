/**
 * Payment Service
 * Business logic for payment transactions and host commissions
 */
import * as paymentModel from '../models/paymentModel.js';
/**
 * Create host commission transaction when booking is confirmed
 */
export declare function createHostCommissionForBooking(bookingId: string): Promise<paymentModel.PaymentTransaction>;
/**
 * Get payment transaction details
 */
export declare function getPaymentTransaction(transactionId: string, userId: string): Promise<paymentModel.PaymentTransaction>;
/**
 * Get host's payment transactions
 */
export declare function getHostPaymentTransactions(hostId: string, options?: {
    transactionType?: paymentModel.PaymentTransaction['transaction_type'];
    status?: paymentModel.PaymentTransaction['status'];
    limit?: number;
    offset?: number;
}): Promise<{
    transactions: paymentModel.PaymentTransaction[];
    total: number;
}>;
/**
 * Get host earnings summary
 */
export declare function getHostEarnings(hostId: string): Promise<{
    total_bookings: number;
    total_gross_earnings: number;
    total_commission_paid: number;
    total_net_earnings: number;
    pending_commission: number;
    total_payouts_received: number;
    commission_rate: number;
}>;
/**
 * Get pending commissions for host
 */
export declare function getPendingCommissions(hostId: string): Promise<{
    transactions: paymentModel.PaymentTransaction[];
    total_amount: number;
    currency: string;
}>;
/**
 * Process commission payment (mark as paid)
 */
export declare function processCommissionPayment(transactionId: string, hostId: string, paymentDetails: {
    payment_method: string;
    payment_intent_id?: string;
    payment_provider?: string;
}): Promise<paymentModel.PaymentTransaction>;
/**
 * Get platform revenue summary (admin only)
 */
export declare function getPlatformRevenue(adminId: string, options?: {
    startDate?: Date;
    endDate?: Date;
}): Promise<{
    total_commissions_earned: number;
    total_commissions_collected: number;
    total_commissions_pending: number;
    total_transactions: number;
    commission_rate: number;
}>;
/**
 * Calculate commission for a booking amount
 */
export declare function calculateCommissionPreview(bookingAmount: number): Promise<{
    booking_amount: number;
    commission_rate: number;
    commission_amount: number;
    host_net_amount: number;
    currency: string;
}>;
/**
 * Fail a commission payment
 */
export declare function failCommissionPayment(transactionId: string, reason: string): Promise<paymentModel.PaymentTransaction>;
/**
 * Get commission rate
 */
export declare function getCommissionRate(): number;
/**
 * Update transaction status (internal use)
 */
export declare function updateTransactionStatus(transactionId: string, status: paymentModel.PaymentTransaction['status'], options?: {
    paymentIntentId?: string;
    paymentMethod?: string;
    paymentProvider?: string;
    failureReason?: string;
}): Promise<paymentModel.PaymentTransaction>;
//# sourceMappingURL=paymentService.d.ts.map