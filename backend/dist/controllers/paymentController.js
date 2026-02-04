/**
 * Payment Controller
 * HTTP handlers for payment and commission endpoints
 */
import * as paymentService from '../services/paymentService.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { ApiError } from '../utils/errors.js';
/**
 * Create commission transaction for a booking
 * POST /payments/commission/booking/:bookingId
 */
export async function createCommissionForBooking(req, res) {
    try {
        const { bookingId } = req.params;
        const transaction = await paymentService.createHostCommissionForBooking(bookingId);
        res.status(201).json(createSuccessResponse({
            transaction,
            message: 'Commission transaction created successfully'
        }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error creating commission:', error);
            res.status(500).json(createErrorResponse('Failed to create commission'));
        }
    }
}
/**
 * Get payment transaction details
 * GET /payments/transactions/:transactionId
 */
export async function getTransaction(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const { transactionId } = req.params;
        const transaction = await paymentService.getPaymentTransaction(transactionId, userId);
        res.json(createSuccessResponse({ transaction }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching transaction:', error);
            res.status(500).json(createErrorResponse('Failed to fetch transaction'));
        }
    }
}
/**
 * Get host's payment transactions
 * GET /payments/host/transactions?type=host_commission&status=pending&limit=50&offset=0
 */
export async function getHostTransactions(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const transactionType = req.query.type;
        const status = req.query.status;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const result = await paymentService.getHostPaymentTransactions(userId, {
            transactionType,
            status,
            limit,
            offset
        });
        res.json(createSuccessResponse(result));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching host transactions:', error);
            res.status(500).json(createErrorResponse('Failed to fetch transactions'));
        }
    }
}
/**
 * Get host earnings summary
 * GET /payments/host/earnings
 */
export async function getHostEarnings(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const earnings = await paymentService.getHostEarnings(userId);
        res.json(createSuccessResponse({ earnings }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching earnings:', error);
            res.status(500).json(createErrorResponse('Failed to fetch earnings'));
        }
    }
}
/**
 * Get pending commissions for host
 * GET /payments/host/pending-commissions
 */
export async function getPendingCommissions(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const result = await paymentService.getPendingCommissions(userId);
        res.json(createSuccessResponse(result));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching pending commissions:', error);
            res.status(500).json(createErrorResponse('Failed to fetch pending commissions'));
        }
    }
}
/**
 * Process commission payment
 * POST /payments/commission/:transactionId/pay
 */
export async function payCommission(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const { transactionId } = req.params;
        const { payment_method, payment_intent_id, payment_provider } = req.body;
        if (!payment_method) {
            res.status(400).json(createErrorResponse('Payment method is required'));
            return;
        }
        const transaction = await paymentService.processCommissionPayment(transactionId, userId, {
            payment_method,
            payment_intent_id,
            payment_provider
        });
        res.json(createSuccessResponse({
            transaction,
            message: 'Commission payment processed successfully'
        }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error processing commission payment:', error);
            res.status(500).json(createErrorResponse('Failed to process payment'));
        }
    }
}
/**
 * Calculate commission preview
 * POST /payments/commission/calculate
 */
export async function calculateCommission(req, res) {
    try {
        const { booking_amount } = req.body;
        if (!booking_amount || booking_amount <= 0) {
            res.status(400).json(createErrorResponse('Valid booking amount is required'));
            return;
        }
        const calculation = await paymentService.calculateCommissionPreview(parseFloat(booking_amount));
        res.json(createSuccessResponse({ calculation }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error calculating commission:', error);
            res.status(500).json(createErrorResponse('Failed to calculate commission'));
        }
    }
}
/**
 * Get commission rate
 * GET /payments/commission/rate
 */
export async function getCommissionRate(req, res) {
    try {
        const rate = paymentService.getCommissionRate();
        res.json(createSuccessResponse({
            commission_rate: rate,
            description: `Platform charges ${rate}% commission on confirmed bookings`
        }));
    }
    catch (error) {
        console.error('Error fetching commission rate:', error);
        res.status(500).json(createErrorResponse('Failed to fetch commission rate'));
    }
}
/**
 * Get platform revenue (admin only - simplified for now)
 * GET /payments/platform/revenue
 */
export async function getPlatformRevenue(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json(createErrorResponse('Unauthorized'));
            return;
        }
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const revenue = await paymentService.getPlatformRevenue(userId, {
            startDate,
            endDate
        });
        res.json(createSuccessResponse({ revenue }));
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(createErrorResponse(error.message));
        }
        else {
            console.error('Error fetching platform revenue:', error);
            res.status(500).json(createErrorResponse('Failed to fetch platform revenue'));
        }
    }
}
//# sourceMappingURL=paymentController.js.map