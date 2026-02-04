/**
 * Message Controller
 * HTTP request handlers for messaging endpoints
 */

import { Request, Response } from 'express';
import * as messageService from '../services/messageService.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { ApiError } from '../utils/errors.js';

/**
 * Start new conversation or get existing one
 * POST /messages/conversations
 */
export async function startConversation(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { listing_id, booking_id } = req.body;

    if (!listing_id) {
      res.status(400).json(createErrorResponse('listing_id is required'));
      return;
    }

    const conversation = await messageService.startConversation(
      listing_id,
      userId,
      booking_id
    );

    res.status(201).json(createSuccessResponse(
      { conversation },
      'Conversation started'
    ));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to start conversation'));
    }
  }
}

/**
 * Get user's conversations
 * GET /messages/conversations
 */
export async function getUserConversations(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const includeArchived = req.query.include_archived === 'true';
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await messageService.getUserConversations(userId, {
      includeArchived,
      limit: Math.min(limit, 100),
      offset
    });

    res.json(createSuccessResponse(result));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to get conversations'));
    }
  }
}

/**
 * Get conversation details
 * GET /messages/conversations/:conversationId
 */
export async function getConversation(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { conversationId } = req.params;

    const conversation = await messageService.getConversation(conversationId, userId);

    res.json(createSuccessResponse({ conversation }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to get conversation'));
    }
  }
}

/**
 * Get messages in conversation
 * GET /messages/conversations/:conversationId/messages
 */
export async function getConversationMessages(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { conversationId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const beforeMessageId = req.query.before as string;

    const result = await messageService.getConversationMessages(
      conversationId,
      userId,
      {
        limit: Math.min(limit, 100),
        offset,
        beforeMessageId
      }
    );

    res.json(createSuccessResponse(result));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to get messages'));
    }
  }
}

/**
 * Send message in conversation
 * POST /messages/conversations/:conversationId/messages
 */
export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { conversationId } = req.params;
    const { content, message_type, attachments, metadata } = req.body;

    if (!content || content.trim().length === 0) {
      res.status(400).json(createErrorResponse('Message content is required'));
      return;
    }

    const message = await messageService.sendMessage(
      conversationId,
      userId,
      content,
      {
        messageType: message_type,
        attachments,
        metadata
      }
    );

    res.status(201).json(createSuccessResponse(
      { message },
      'Message sent successfully'
    ));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to send message'));
    }
  }
}

/**
 * Mark message as read
 * PATCH /messages/:messageId/read
 */
export async function markMessageAsRead(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { messageId } = req.params;

    const message = await messageService.markAsRead(messageId, userId);

    res.json(createSuccessResponse(
      { message },
      'Message marked as read'
    ));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to mark message as read'));
    }
  }
}

/**
 * Mark all messages in conversation as read
 * PATCH /messages/conversations/:conversationId/read
 */
export async function markConversationAsRead(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { conversationId } = req.params;

    const result = await messageService.markConversationAsRead(conversationId, userId);

    res.json(createSuccessResponse(
      result,
      `${result.markedCount} messages marked as read`
    ));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to mark conversation as read'));
    }
  }
}

/**
 * Delete message
 * DELETE /messages/:messageId
 */
export async function deleteMessage(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { messageId } = req.params;

    await messageService.deleteMessage(messageId, userId);

    res.json(createSuccessResponse(
      null,
      'Message deleted successfully'
    ));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to delete message'));
    }
  }
}

/**
 * Archive conversation
 * PATCH /messages/conversations/:conversationId/archive
 */
export async function archiveConversation(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { conversationId } = req.params;

    const conversation = await messageService.archiveConversation(conversationId, userId);

    res.json(createSuccessResponse(
      { conversation },
      'Conversation archived'
    ));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to archive conversation'));
    }
  }
}

/**
 * Unarchive conversation
 * PATCH /messages/conversations/:conversationId/unarchive
 */
export async function unarchiveConversation(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;
    const { conversationId } = req.params;

    const conversation = await messageService.unarchiveConversation(conversationId, userId);

    res.json(createSuccessResponse(
      { conversation },
      'Conversation unarchived'
    ));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to unarchive conversation'));
    }
  }
}

/**
 * Get unread message count
 * GET /messages/unread-count
 */
export async function getUnreadCount(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;

    const result = await messageService.getUnreadCount(userId);

    res.json(createSuccessResponse(result));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else {
      res.status(500).json(createErrorResponse('Failed to get unread count'));
    }
  }
}
