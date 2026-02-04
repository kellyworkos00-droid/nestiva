-- Migration: Create conversations and messages tables
-- Description: Enable direct messaging between hosts and guests
-- Created: 2026-02-04

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- Conversation status
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN (
    'active',        -- Ongoing conversation
    'archived',      -- Archived by one or both parties
    'blocked'        -- One party blocked the other
  )),
  
  -- Last activity tracking
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_preview TEXT,
  
  -- Participant management
  host_archived BOOLEAN DEFAULT FALSE,
  guest_archived BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure unique conversation per listing + guest (one conversation per guest per listing)
  UNIQUE(listing_id, guest_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Message content
  content TEXT NOT NULL CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 5000),
  
  -- Message type
  message_type VARCHAR(30) NOT NULL DEFAULT 'text' CHECK (message_type IN (
    'text',              -- Regular text message
    'booking_request',   -- Booking inquiry
    'booking_confirmed', -- Booking confirmation
    'booking_cancelled', -- Cancellation notice
    'system'             -- System-generated message
  )),
  
  -- Message status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Attachments (stored as JSON array of URLs)
  attachments JSONB DEFAULT '[]',
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Soft delete
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for conversations
CREATE INDEX IF NOT EXISTS idx_conversations_listing_id ON conversations(listing_id);
CREATE INDEX IF NOT EXISTS idx_conversations_host_id ON conversations(host_id);
CREATE INDEX IF NOT EXISTS idx_conversations_guest_id ON conversations(guest_id);
CREATE INDEX IF NOT EXISTS idx_conversations_booking_id ON conversations(booking_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- Create indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_deleted ON messages(is_deleted);

-- Create trigger to update updated_at timestamp for conversations
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversations_updated_at_trigger
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_conversations_updated_at();

-- Create trigger to update updated_at timestamp for messages
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_messages_updated_at_trigger
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_messages_updated_at();

-- Create trigger to update conversation last_message_at when new message is sent
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_last_message_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- Create view for unread message counts
CREATE OR REPLACE VIEW unread_message_counts AS
SELECT 
  receiver_id as user_id,
  conversation_id,
  COUNT(*) as unread_count
FROM messages
WHERE is_read = FALSE AND is_deleted = FALSE
GROUP BY receiver_id, conversation_id;

-- Create view for conversation summaries
CREATE OR REPLACE VIEW conversation_summaries AS
SELECT 
  c.id,
  c.listing_id,
  c.host_id,
  c.guest_id,
  c.booking_id,
  c.status,
  c.last_message_at,
  c.last_message_preview,
  c.host_archived,
  c.guest_archived,
  c.created_at,
  l.title as listing_title,
  l.photos as listing_photos,
  h.first_name as host_first_name,
  h.last_name as host_last_name,
  h.profile_picture as host_profile_picture,
  g.first_name as guest_first_name,
  g.last_name as guest_last_name,
  g.profile_picture as guest_profile_picture,
  COALESCE(umc_host.unread_count, 0) as host_unread_count,
  COALESCE(umc_guest.unread_count, 0) as guest_unread_count
FROM conversations c
JOIN listings l ON c.listing_id = l.id
JOIN users h ON c.host_id = h.id
JOIN users g ON c.guest_id = g.id
LEFT JOIN unread_message_counts umc_host ON c.id = umc_host.conversation_id AND umc_host.user_id = c.host_id
LEFT JOIN unread_message_counts umc_guest ON c.id = umc_guest.conversation_id AND umc_guest.user_id = c.guest_id;
