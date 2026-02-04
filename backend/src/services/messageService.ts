/**
 * Message Service
 * Business logic for messaging system
 */

import * as messageModel from '../models/messageModel.js';
import * as listingModel from '../models/listingModel.js';
import * as userModel from '../models/userModel.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import type { 
  Conversation, 
  Message,
  CreateMessageData,
  ConversationSummary 
} from '../types/index.js';

/**
 * Start or get existing conversation
 */
export async function startConversation(
  listingId: string,
  guestId: string,
  bookingId?: string
): Promise<Conversation> {
  // Verify listing exists
  const listing = await listingModel.findListingById(listingId);
  
  // Verify guest exists
  await userModel.findUserById(guestId);

  // Create or get existing conversation
  return messageModel.findOrCreateConversation(
    listingId,
    listing.host_id,
    guestId,
    bookingId
  );
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  options: {
    messageType?: 'text' | 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'system';
    attachments?: string[];
    metadata?: Record<string, any>;
  } = {}
): Promise<Message> {
  // Verify conversation exists
  const conversation = await messageModel.findConversationById(conversationId);

  // Verify sender is participant
  if (conversation.host_id !== senderId && conversation.guest_id !== senderId) {
    throw new ForbiddenError('You are not a participant in this conversation');
  }

  // Determine receiver
  const receiverId = conversation.host_id === senderId 
    ? conversation.guest_id 
    : conversation.host_id;

  // Validate content
  if (!content || content.trim().length === 0) {
    throw new BadRequestError('Message content cannot be empty');
  }

  if (content.length > 5000) {
    throw new BadRequestError('Message content exceeds maximum length of 5000 characters');
  }

  // Create message
  const messageData: CreateMessageData = {
    conversationId,
    senderId,
    receiverId,
    content: content.trim(),
    messageType: options.messageType || 'text',
    attachments: options.attachments || [],
    metadata: options.metadata || {}
  };

  return messageModel.createMessage(messageData);
}

/**
 * Get user's conversations
 */
export async function getUserConversations(
  userId: string,
  options: {
    includeArchived?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ conversations: ConversationSummary[]; total: number }> {
  return messageModel.findUserConversations(userId, options);
}

/**
 * Get conversation details with authorization check
 */
export async function getConversation(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  const conversation = await messageModel.findConversationById(conversationId);

  // Verify user is participant
  if (conversation.host_id !== userId && conversation.guest_id !== userId) {
    throw new ForbiddenError('You do not have access to this conversation');
  }

  return conversation;
}

/**
 * Get messages in a conversation
 */
export async function getConversationMessages(
  conversationId: string,
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    beforeMessageId?: string;
  } = {}
): Promise<{ messages: Message[]; total: number }> {
  // Verify user is participant
  const conversation = await messageModel.findConversationById(conversationId);
  if (conversation.host_id !== userId && conversation.guest_id !== userId) {
    throw new ForbiddenError('You do not have access to this conversation');
  }

  // Get messages
  return messageModel.findMessagesByConversationId(conversationId, options);
}

/**
 * Mark message as read
 */
export async function markAsRead(
  messageId: string,
  userId: string
): Promise<Message> {
  const message = await messageModel.findMessageById(messageId);

  // Verify user is receiver
  if (message.receiver_id !== userId) {
    throw new ForbiddenError('You can only mark messages sent to you as read');
  }

  // Already read
  if (message.is_read) {
    return message;
  }

  return messageModel.markMessageAsRead(messageId);
}

/**
 * Mark all messages in conversation as read
 */
export async function markConversationAsRead(
  conversationId: string,
  userId: string
): Promise<{ markedCount: number }> {
  // Verify user is participant
  const conversation = await messageModel.findConversationById(conversationId);
  if (conversation.host_id !== userId && conversation.guest_id !== userId) {
    throw new ForbiddenError('You do not have access to this conversation');
  }

  const markedCount = await messageModel.markConversationAsRead(conversationId, userId);

  return { markedCount };
}

/**
 * Delete a message
 */
export async function deleteMessage(
  messageId: string,
  userId: string
): Promise<Message> {
  const message = await messageModel.findMessageById(messageId);

  // Verify user is sender
  if (message.sender_id !== userId) {
    throw new ForbiddenError('You can only delete messages you sent');
  }

  return messageModel.deleteMessage(messageId);
}

/**
 * Archive conversation
 */
export async function archiveConversation(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  // Verify user is participant
  await getConversation(conversationId, userId);

  return messageModel.archiveConversation(conversationId, userId);
}

/**
 * Unarchive conversation
 */
export async function unarchiveConversation(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  // Verify user is participant
  await getConversation(conversationId, userId);

  return messageModel.unarchiveConversation(conversationId, userId);
}

/**
 * Get unread message count for user
 */
export async function getUnreadCount(userId: string): Promise<{ unreadCount: number }> {
  const unreadCount = await messageModel.getUnreadMessageCount(userId);

  return { unreadCount };
}

/**
 * Send system message (booking confirmation, cancellation, etc.)
 */
export async function sendSystemMessage(
  conversationId: string,
  content: string,
  metadata: Record<string, any> = {}
): Promise<Message> {
  const conversation = await messageModel.findConversationById(conversationId);

  // System messages are sent from host to guest
  const messageData: CreateMessageData = {
    conversationId,
    senderId: conversation.host_id,
    receiverId: conversation.guest_id,
    content,
    messageType: 'system',
    attachments: [],
    metadata
  };

  return messageModel.createMessage(messageData);
}

/**
 * Get conversation by listing and guest (helper for booking integration)
 */
export async function getOrCreateConversationForBooking(
  listingId: string,
  guestId: string,
  bookingId: string
): Promise<Conversation> {
  const listing = await listingModel.findListingById(listingId);

  return messageModel.findOrCreateConversation(
    listingId,
    listing.host_id,
    guestId,
    bookingId
  );
}
