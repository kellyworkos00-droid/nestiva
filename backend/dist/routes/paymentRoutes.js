/**
 * Payment Routes
 * API endpoints for payments and host commissions
 */
import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { requireAuthMiddleware } from '../middleware/auth.js';
const router = express.Router();
// Get commission rate (public)
router.get('/commission/rate', paymentController.getCommissionRate);
// Calculate commission preview (public)
router.post('/commission/calculate', paymentController.calculateCommission);
// Create commission for booking (protected - typically called internally)
router.post('/commission/booking/:bookingId', requireAuthMiddleware, paymentController.createCommissionForBooking);
// Get host earnings summary (protected)
router.get('/host/earnings', requireAuthMiddleware, paymentController.getHostEarnings);
// Get host pending commissions (protected)
router.get('/host/pending-commissions', requireAuthMiddleware, paymentController.getPendingCommissions);
// Get host transactions (protected)
router.get('/host/transactions', requireAuthMiddleware, paymentController.getHostTransactions);
// Pay commission (protected)
router.post('/commission/:transactionId/pay', requireAuthMiddleware, paymentController.payCommission);
// Get transaction details (protected)
router.get('/transactions/:transactionId', requireAuthMiddleware, paymentController.getTransaction);
// Get platform revenue (protected - admin)
router.get('/platform/revenue', requireAuthMiddleware, paymentController.getPlatformRevenue);
export default router;
//# sourceMappingURL=paymentRoutes.js.map