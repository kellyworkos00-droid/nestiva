/**
 * Payment Controller
 * HTTP handlers for payment and commission endpoints
 */
import { Request, Response } from 'express';
/**
 * Create commission transaction for a booking
 * POST /payments/commission/booking/:bookingId
 */
export declare function createCommissionForBooking(req: Request, res: Response): Promise<void>;
/**
 * Get payment transaction details
 * GET /payments/transactions/:transactionId
 */
export declare function getTransaction(req: Request, res: Response): Promise<void>;
/**
 * Get host's payment transactions
 * GET /payments/host/transactions?type=host_commission&status=pending&limit=50&offset=0
 */
export declare function getHostTransactions(req: Request, res: Response): Promise<void>;
/**
 * Get host earnings summary
 * GET /payments/host/earnings
 */
export declare function getHostEarnings(req: Request, res: Response): Promise<void>;
/**
 * Get pending commissions for host
 * GET /payments/host/pending-commissions
 */
export declare function getPendingCommissions(req: Request, res: Response): Promise<void>;
/**
 * Process commission payment
 * POST /payments/commission/:transactionId/pay
 */
export declare function payCommission(req: Request, res: Response): Promise<void>;
/**
 * Calculate commission preview
 * POST /payments/commission/calculate
 */
export declare function calculateCommission(req: Request, res: Response): Promise<void>;
/**
 * Get commission rate
 * GET /payments/commission/rate
 */
export declare function getCommissionRate(req: Request, res: Response): Promise<void>;
/**
 * Get platform revenue (admin only - simplified for now)
 * GET /payments/platform/revenue
 */
export declare function getPlatformRevenue(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=paymentController.d.ts.map