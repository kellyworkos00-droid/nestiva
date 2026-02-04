/**
 * Message Model
 * Handles database operations for conversations and messages
 */

import { pool } from '../config/database.js';
import type { 
  Conversation, 
  Message, 
  CreateConversationData,
  CreateMessageData,
  ConversationSummary 
} from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../utils/errors.js';

// ============================================
// CONVERSATION OPERATIONS
// ============================================

/**
 * Find or create a conversation between host and guest for a listing
 */
export async function findOrCreateConversation(
  listingId: string,
  hostId: string,
  guestId: string,
  bookingId?: string
): Promise<Conversation> {
  const result = await pool.query<Conversation>(
    `SELECT * FROM conversations 
     WHERE listing_id = $1 AND guest_id = $2
     LIMIT 1`,
    [listingId, guestId]
  );

  if (result.rows[0]) {
    // Update booking_id if provided and not set
    if (bookingId && !result.rows[0].booking_id) {
      await pool.query(
        `UPDATE conversations SET booking_id = $1 WHERE id = $2`,
        [bookingId, result.rows[0].id]
      );
      result.rows[0].booking_id = bookingId;
    }
    return result.rows[0];
  }

  // Create new conversation
  const newConversation = await pool.query<Conversation>(
    `INSERT INTO conversations (id, listing_id, host_id, guest_id, booking_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [uuidv4(), listingId, hostId, guestId, bookingId || null]
  );

  return newConversation.rows[0];
}

/**
 * Get conversation by ID
 */
export async function findConversationById(conversationId: string): Promise<Conversation> {
  const result = await pool.query<Conversation>(
    `SELECT * FROM conversations WHERE id = $1`,
    [conversationId]
  );

  if (!result.rows[0]) {
    throw new NotFoundError('Conversation not found');
  }

  return result.rows[0];
}

/**
 * Get all conversations for a user with summary data
 */
export async function findUserConversations(
  userId: string,
  options: {
    includeArchived?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ conversations: ConversationSummary[]; total: number }> {
  const { includeArchived = false, limit = 50, offset = 0 } = options;

  let query = `
    SELECT * FROM conversation_summaries
    WHERE (host_id = $1 OR guest_id = $1)
  `;

  const params: any[] = [userId];
  let paramIndex = 2;

  if (!includeArchived) {
    query += ` AND (
      (host_id = $1 AND host_archived = FALSE) OR
      (guest_id = $1 AND guest_archived = FALSE)
    )`;
  }

  query += ` ORDER BY last_message_at DESC NULLS LAST`;
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const [conversationsResult, countResult] = await Promise.all([
    pool.query<ConversationSummary>(query, params),
    pool.query<{ count: string }>(
      `SELECT COUNT(*) FROM conversations 
       WHERE (host_id = $1 OR guest_id = $1)
       ${!includeArchived ? 
         `AND ((host_id = $1 AND host_archived = FALSE) OR (guest_id = $1 AND guest_archived = FALSE))` 
         : ''
       }`,
      [userId]
    )
  ]);

  return {
    conversations: conversationsResult.rows,
    total: parseInt(countResult.rows[0].count)
  };
}

/**
 * Archive conversation for a user
 */
export async function archiveConversation(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  const conversation = await findConversationById(conversationId);

  const archiveField = conversation.host_id === userId ? 'host_archived' : 'guest_archived';

  const result = await pool.query<Conversation>(
    `UPDATE conversations 
     SET ${archiveField} = TRUE
     WHERE id = $1
     RETURNING *`,
    [conversationId]
  );

  return result.rows[0];
}

/**
 * Unarchive conversation for a user
 */
export async function unarchiveConversation(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  const conversation = await findConversationById(conversationId);

  const archiveField = conversation.host_id === userId ? 'host_archived' : 'guest_archived';

  const result = await pool.query<Conversation>(
    `UPDATE conversations 
     SET ${archiveField} = FALSE
     WHERE id = $1
     RETURNING *`,
    [conversationId]
  );

  return result.rows[0];
}

/**
 * Get unread message count for user
 */
export async function getUnreadMessageCount(userId: string): Promise<number> {
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*) FROM messages 
     WHERE receiver_id = $1 AND is_read = FALSE AND is_deleted = FALSE`,
    [userId]
  );

  return parseInt(result.rows[0].count);
}

// ============================================
// MESSAGE OPERATIONS
// ============================================

/**
 * Create a new message
 */
export async function createMessage(data: CreateMessageData): Promise<Message> {
  const {
    conversationId,
    senderId,
    receiverId,
    content,
    messageType = 'text',
    attachments = [],
    metadata = {}
  } = data;

  const result = await pool.query<Message>(
    `INSERT INTO messages (
      id, conversation_id, sender_id, receiver_id, content, 
      message_type, attachments, metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      uuidv4(),
      conversationId,
      senderId,
      receiverId,
      content,
      messageType,
      JSON.stringify(attachments),
      JSON.stringify(metadata)
    ]
  );

  return result.rows[0];
}

/**
 * Get messages for a conversation
 */
export async function findMessagesByConversationId(
  conversationId: string,
  options: {
    limit?: number;
    offset?: number;
    beforeMessageId?: string;
  } = {}
): Promise<{ messages: Message[]; total: number }> {
  const { limit = 50, offset = 0, beforeMessageId } = options;

  let query = `
    SELECT * FROM messages 
    WHERE conversation_id = $1 AND is_deleted = FALSE
  `;
  const params: any[] = [conversationId];
  let paramIndex = 2;

  if (beforeMessageId) {
    const beforeMessage = await pool.query<Message>(
      `SELECT created_at FROM messages WHERE id = $1`,
      [beforeMessageId]
    );
    if (beforeMessage.rows[0]) {
      query += ` AND created_at < $${paramIndex}`;
      params.push(beforeMessage.rows[0].created_at);
      paramIndex++;
    }
  }

  query += ` ORDER BY created_at DESC`;
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const [messagesResult, countResult] = await Promise.all([
    pool.query<Message>(query, params),
    pool.query<{ count: string }>(
      `SELECT COUNT(*) FROM messages 
       WHERE conversation_id = $1 AND is_deleted = FALSE`,
      [conversationId]
    )
  ]);

  return {
    messages: messagesResult.rows.reverse(), // Return in chronological order
    total: parseInt(countResult.rows[0].count)
  };
}

/**
 * Get message by ID
 */
export async function findMessageById(messageId: string): Promise<Message> {
  const result = await pool.query<Message>(
    `SELECT * FROM messages WHERE id = $1 AND is_deleted = FALSE`,
    [messageId]
  );

  if (!result.rows[0]) {
    throw new NotFoundError('Message not found');
  }

  return result.rows[0];
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string): Promise<Message> {
  const result = await pool.query<Message>(
    `UPDATE messages 
     SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [messageId]
  );

  if (!result.rows[0]) {
    throw new NotFoundError('Message not found');
  }

  return result.rows[0];
}

/**
 * Mark all messages in conversation as read for a user
 */
export async function markConversationAsRead(
  conversationId: string,
  userId: string
): Promise<number> {
  const result = await pool.query(
    `UPDATE messages 
     SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
     WHERE conversation_id = $1 
       AND receiver_id = $2 
       AND is_read = FALSE
       AND is_deleted = FALSE`,
    [conversationId, userId]
  );

  return result.rowCount || 0;
}

/**
 * Soft delete a message
 */
export async function deleteMessage(messageId: string): Promise<Message> {
  const result = await pool.query<Message>(
    `UPDATE messages 
     SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [messageId]
  );

  if (!result.rows[0]) {
    throw new NotFoundError('Message not found');
  }

  return result.rows[0];
}

/**
 * Get conversation participant IDs
 */
export async function getConversationParticipants(conversationId: string): Promise<{
  hostId: string;
  guestId: string;
}> {
  const result = await pool.query<{ host_id: string; guest_id: string }>(
    `SELECT host_id, guest_id FROM conversations WHERE id = $1`,
    [conversationId]
  );

  if (!result.rows[0]) {
    throw new NotFoundError('Conversation not found');
  }

  return {
    hostId: result.rows[0].host_id,
    guestId: result.rows[0].guest_id
  };
}
