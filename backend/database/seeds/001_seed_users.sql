-- Seed Data: Sample users
-- Description: Test users for development (guest, host, and admin)
-- Created: 2026-02-04
-- NOTE: Use bcrypt hashed passwords in production!

-- Password for all test users: "Test123!"
-- Hash: $2b$10$rKZE7P5bqLVYZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ

INSERT INTO users (
  id,
  email,
  password_hash,
  first_name,
  last_name,
  user_type,
  phone_number,
  bio,
  is_email_verified,
  is_phone_verified,
  is_identity_verified,
  verification_status,
  trust_score,
  account_status
) VALUES
  -- Guest User 1
  (
    '11111111-1111-1111-1111-111111111111',
    'guest1@example.com',
    '$2b$10$rKZE7P5bqLVYZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ',
    'Sarah',
    'Johnson',
    'guest',
    '+1234567890',
    'Love to travel and explore new places!',
    true,
    true,
    true,
    'verified',
    85,
    'active'
  ),
  
  -- Guest User 2
  (
    '22222222-2222-2222-2222-222222222222',
    'guest2@example.com',
    '$2b$10$rKZE7P5bqLVYZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ',
    'Michael',
    'Chen',
    'guest',
    '+1234567891',
    'Digital nomad exploring the world.',
    true,
    false,
    false,
    'pending',
    60,
    'active'
  ),
  
  -- Host User 1 (Superhost)
  (
    '33333333-3333-3333-3333-333333333333',
    'host1@example.com',
    '$2b$10$rKZE7P5bqLVYZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ',
    'Emily',
    'Rodriguez',
    'host',
    '+1234567892',
    'Experienced host with 5+ years. Love meeting people from around the world!',
    true,
    true,
    true,
    'verified',
    95,
    'active'
  ),
  
  -- Host User 2
  (
    '44444444-4444-4444-4444-444444444444',
    'host2@example.com',
    '$2b$10$rKZE7P5bqLVYZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ',
    'James',
    'Wilson',
    'host',
    '+1234567893',
    'Property owner with beautiful coastal homes.',
    true,
    true,
    true,
    'verified',
    78,
    'active'
  ),
  
  -- User with both roles
  (
    '55555555-5555-5555-5555-555555555555',
    'both@example.com',
    '$2b$10$rKZE7P5bqLVYZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ8xJZ',
    'Alex',
    'Martinez',
    'both',
    '+1234567894',
    'Host and avid traveler. Best of both worlds!',
    true,
    true,
    true,
    'verified',
    90,
    'active'
  );

-- Update host-specific fields for hosts
UPDATE users
SET 
  is_superhost = true,
  response_rate = 98.5,
  average_response_time_hours = 2
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE users
SET 
  response_rate = 87.3,
  average_response_time_hours = 6
WHERE id = '44444444-4444-4444-4444-444444444444';

UPDATE users
SET 
  is_superhost = false,
  response_rate = 92.1,
  average_response_time_hours = 4
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Add comments
COMMENT ON TABLE users IS 'Sample users loaded: 2 guests, 2 hosts, 1 both. Password for all: Test123!';
