/**
 * Message Routes
 * API endpoints for messaging system
 */

import express from 'express';
import { requireAuthMiddleware } from '../middleware/auth.js';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

// All message routes require authentication
router.use(requireAuthMiddleware);

// Conversation routes
router.post('/conversations', messageController.startConversation);
router.get('/conversations', messageController.getUserConversations);
router.get('/conversations/:conversationId', messageController.getConversation);
router.get('/conversations/:conversationId/messages', messageController.getConversationMessages);
router.post('/conversations/:conversationId/messages', messageController.sendMessage);
router.patch('/conversations/:conversationId/read', messageController.markConversationAsRead);
router.patch('/conversations/:conversationId/archive', messageController.archiveConversation);
router.patch('/conversations/:conversationId/unarchive', messageController.unarchiveConversation);

// Message routes
router.patch('/:messageId/read', messageController.markMessageAsRead);
router.delete('/:messageId', messageController.deleteMessage);

// Unread count
router.get('/unread-count', messageController.getUnreadCount);

export default router;
