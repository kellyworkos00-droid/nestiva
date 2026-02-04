-- Migration: Create users table
-- Description: User accounts with authentication and profile information
-- Created: 2026-02-04

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('guest', 'host', 'both')),
  phone_number VARCHAR(20),
  date_of_birth DATE,
  profile_picture_url TEXT,
  bio TEXT,
  preferred_language VARCHAR(10) DEFAULT 'en',
  preferred_currency VARCHAR(3) DEFAULT 'USD',
  
  -- Host-specific fields
  is_superhost BOOLEAN DEFAULT false,
  response_rate DECIMAL(5,2) DEFAULT 0 CHECK (response_rate >= 0 AND response_rate <= 100),
  average_response_time_hours INTEGER DEFAULT 0,
  
  -- Verification and trust
  is_email_verified BOOLEAN DEFAULT false,
  is_phone_verified BOOLEAN DEFAULT false,
  is_identity_verified BOOLEAN DEFAULT false,
  government_id_uploaded BOOLEAN DEFAULT false,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  
  -- Account status
  account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated', 'deleted')),
  last_login_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_account_status ON users(account_status);
CREATE INDEX idx_users_is_superhost ON users(is_superhost) WHERE is_superhost = true;
CREATE INDEX idx_users_verification_status ON users(verification_status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts with guest, host, or dual roles';
COMMENT ON COLUMN users.user_type IS 'Role: guest, host, or both';
COMMENT ON COLUMN users.trust_score IS 'Trust score from 0-100 based on verification and behavior';
COMMENT ON COLUMN users.response_rate IS 'Host response rate percentage (0-100)';
