import express, { Router } from 'express';
import * as authController from '../controllers/authController';
import { optionalAuthMiddleware } from '../middleware/auth';

const router: Router = express.Router();

/**
 * Auth Routes
 * Base: /api/v1/auth
 */

// Public endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected endpoints
router.post('/send-verification-code', optionalAuthMiddleware, authController.sendPhoneCode);
router.post('/verify-phone', optionalAuthMiddleware, authController.verifyPhone);
router.post('/upload-verification-document', optionalAuthMiddleware, authController.uploadDocument);
router.post('/logout', optionalAuthMiddleware, authController.logout);

export default router;
