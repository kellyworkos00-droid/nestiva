/**
 * Payment Model
 * Database operations for payment transactions and host commissions
 */
export interface PaymentTransaction {
    id: string;
    booking_id: string;
    listing_id: string;
    host_id: string;
    guest_id: string;
    transaction_type: 'host_commission' | 'guest_service_fee' | 'host_payout' | 'refund_to_guest' | 'refund_from_host';
    booking_total: number;
    commission_rate: number;
    commission_amount: number;
    net_amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
    payment_method?: string;
    payment_provider?: string;
    payment_intent_id?: string;
    transaction_reference: string;
    payment_due_date?: Date;
    payment_completed_at?: Date;
    description?: string;
    failure_reason?: string;
    metadata?: any;
    created_at: Date;
    updated_at: Date;
}
export interface CreatePaymentTransactionData {
    booking_id: string;
    listing_id: string;
    host_id: string;
    guest_id: string;
    transaction_type: PaymentTransaction['transaction_type'];
    booking_total: number;
    commission_rate: number;
    commission_amount: number;
    net_amount: number;
    currency?: string;
    payment_due_date?: Date;
    description?: string;
    metadata?: any;
}
/**
 * Create a payment transaction
 */
export declare function createPaymentTransaction(data: CreatePaymentTransactionData): Promise<PaymentTransaction>;
/**
 * Find payment transaction by ID
 */
export declare function findPaymentTransactionById(transactionId: string): Promise<PaymentTransaction | null>;
/**
 * Find payment transactions by booking ID
 */
export declare function findPaymentTransactionsByBookingId(bookingId: string): Promise<PaymentTransaction[]>;
/**
 * Find payment transactions by host ID
 */
export declare function findPaymentTransactionsByHostId(hostId: string, options?: {
    transactionType?: PaymentTransaction['transaction_type'];
    status?: PaymentTransaction['status'];
    limit?: number;
    offset?: number;
}): Promise<{
    transactions: PaymentTransaction[];
    total: number;
}>;
/**
 * Update payment transaction status
 */
export declare function updatePaymentTransactionStatus(transactionId: string, status: PaymentTransaction['status'], options?: {
    paymentIntentId?: string;
    paymentMethod?: string;
    paymentProvider?: string;
    failureReason?: string;
}): Promise<PaymentTransaction>;
/**
 * Get host earnings summary
 */
export declare function getHostEarningsSummary(hostId: string): Promise<{
    total_bookings: number;
    total_gross_earnings: number;
    total_commission_paid: number;
    total_net_earnings: number;
    pending_commission: number;
    total_payouts_received: number;
}>;
/**
 * Get pending commissions for host
 */
export declare function getPendingCommissionsForHost(hostId: string): Promise<{
    transactions: PaymentTransaction[];
    total_amount: number;
}>;
/**
 * Get platform revenue summary
 */
export declare function getPlatformRevenueSummary(startDate?: Date, endDate?: Date): Promise<{
    total_commissions_earned: number;
    total_commissions_collected: number;
    total_commissions_pending: number;
    total_transactions: number;
}>;
/**
 * Mark commission as paid
 */
export declare function markCommissionAsPaid(transactionId: string, paymentDetails: {
    payment_method: string;
    payment_intent_id?: string;
    payment_provider?: string;
}): Promise<PaymentTransaction>;
/**
 * Calculate commission for booking
 */
export declare function calculateCommission(bookingTotal: number, commissionRate: number): Promise<{
    commission_amount: number;
    net_amount: number;
}>;
//# sourceMappingURL=paymentModel.d.ts.map