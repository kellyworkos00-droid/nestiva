/**
 * Payment Model
 * Database operations for payment transactions and host commissions
 */
import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../utils/errors.js';
/**
 * Create a payment transaction
 */
export async function createPaymentTransaction(data) {
    const id = uuidv4();
    // Generate unique transaction reference
    const refResult = await pool.query('SELECT generate_transaction_reference() as ref');
    const transaction_reference = refResult.rows[0].ref;
    const result = await pool.query(`INSERT INTO payment_transactions (
      id, booking_id, listing_id, host_id, guest_id,
      transaction_type, booking_total, commission_rate,
      commission_amount, net_amount, currency,
      transaction_reference, payment_due_date, description, metadata,
      status, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, [
        id,
        data.booking_id,
        data.listing_id,
        data.host_id,
        data.guest_id,
        data.transaction_type,
        data.booking_total,
        data.commission_rate,
        data.commission_amount,
        data.net_amount,
        data.currency || 'USD',
        transaction_reference,
        data.payment_due_date || null,
        data.description || null,
        data.metadata ? JSON.stringify(data.metadata) : '{}',
        'pending'
    ]);
    return result.rows[0];
}
/**
 * Find payment transaction by ID
 */
export async function findPaymentTransactionById(transactionId) {
    const result = await pool.query(`SELECT * FROM payment_transactions WHERE id = $1`, [transactionId]);
    return result.rows[0] || null;
}
/**
 * Find payment transactions by booking ID
 */
export async function findPaymentTransactionsByBookingId(bookingId) {
    const result = await pool.query(`SELECT * FROM payment_transactions 
     WHERE booking_id = $1
     ORDER BY created_at DESC`, [bookingId]);
    return result.rows;
}
/**
 * Find payment transactions by host ID
 */
export async function findPaymentTransactionsByHostId(hostId, options = {}) {
    const { transactionType, status, limit = 50, offset = 0 } = options;
    let whereClause = 'WHERE host_id = $1';
    const params = [hostId];
    if (transactionType) {
        params.push(transactionType);
        whereClause += ` AND transaction_type = $${params.length}`;
    }
    if (status) {
        params.push(status);
        whereClause += ` AND status = $${params.length}`;
    }
    // Get total count
    const countResult = await pool.query(`SELECT COUNT(*) FROM payment_transactions ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);
    // Get transactions
    const result = await pool.query(`SELECT pt.*, 
      b.check_in_date, b.check_out_date,
      l.title as listing_title,
      u.first_name as guest_first_name, u.last_name as guest_last_name
     FROM payment_transactions pt
     JOIN bookings b ON pt.booking_id = b.id
     JOIN listings l ON pt.listing_id = l.id
     JOIN users u ON pt.guest_id = u.id
     ${whereClause}
     ORDER BY pt.created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limit, offset]);
    return {
        transactions: result.rows,
        total
    };
}
/**
 * Update payment transaction status
 */
export async function updatePaymentTransactionStatus(transactionId, status, options = {}) {
    const completedAt = status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL';
    const result = await pool.query(`UPDATE payment_transactions 
     SET status = $1,
         payment_intent_id = COALESCE($2, payment_intent_id),
         payment_method = COALESCE($3, payment_method),
         payment_provider = COALESCE($4, payment_provider),
         failure_reason = $5,
         payment_completed_at = ${completedAt},
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`, [
        status,
        options.paymentIntentId || null,
        options.paymentMethod || null,
        options.paymentProvider || null,
        options.failureReason || null,
        transactionId
    ]);
    if (result.rows.length === 0) {
        throw new NotFoundError('Payment transaction not found');
    }
    return result.rows[0];
}
/**
 * Get host earnings summary
 */
export async function getHostEarningsSummary(hostId) {
    const result = await pool.query(`SELECT * FROM host_earnings_summary WHERE host_id = $1`, [hostId]);
    if (result.rows.length === 0) {
        return {
            total_bookings: 0,
            total_gross_earnings: 0,
            total_commission_paid: 0,
            total_net_earnings: 0,
            pending_commission: 0,
            total_payouts_received: 0
        };
    }
    return result.rows[0];
}
/**
 * Get pending commissions for host
 */
export async function getPendingCommissionsForHost(hostId) {
    const result = await pool.query(`SELECT pt.*, 
      b.check_in_date, b.check_out_date,
      l.title as listing_title
     FROM payment_transactions pt
     JOIN bookings b ON pt.booking_id = b.id
     JOIN listings l ON pt.listing_id = l.id
     WHERE pt.host_id = $1 
       AND pt.transaction_type = 'host_commission'
       AND pt.status = 'pending'
     ORDER BY pt.payment_due_date ASC NULLS LAST, pt.created_at ASC`, [hostId]);
    const total_amount = result.rows.reduce((sum, tx) => sum + parseFloat(tx.commission_amount), 0);
    return {
        transactions: result.rows,
        total_amount
    };
}
/**
 * Get platform revenue summary
 */
export async function getPlatformRevenueSummary(startDate, endDate) {
    let whereClause = "WHERE transaction_type = 'host_commission'";
    const params = [];
    if (startDate) {
        params.push(startDate);
        whereClause += ` AND created_at >= $${params.length}`;
    }
    if (endDate) {
        params.push(endDate);
        whereClause += ` AND created_at <= $${params.length}`;
    }
    const result = await pool.query(`SELECT 
      COUNT(*) as total_transactions,
      SUM(commission_amount) as total_commissions_earned,
      SUM(CASE WHEN status = 'completed' THEN commission_amount ELSE 0 END) as total_commissions_collected,
      SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END) as total_commissions_pending
     FROM payment_transactions
     ${whereClause}`, params);
    return result.rows[0];
}
/**
 * Mark commission as paid
 */
export async function markCommissionAsPaid(transactionId, paymentDetails) {
    return updatePaymentTransactionStatus(transactionId, 'completed', paymentDetails);
}
/**
 * Calculate commission for booking
 */
export async function calculateCommission(bookingTotal, commissionRate) {
    const result = await pool.query(`SELECT * FROM calculate_host_commission($1, $2)`, [bookingTotal, commissionRate]);
    return result.rows[0];
}
//# sourceMappingURL=paymentModel.js.map