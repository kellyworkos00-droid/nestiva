-- Migration: Create listings table
-- Description: Property listings with full details and amenities
-- Created: 2026-02-04

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic information
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  property_type VARCHAR(50) NOT NULL CHECK (property_type IN (
    'apartment', 'house', 'villa', 'condo', 'townhouse', 'guesthouse', 
    'hotel', 'cabin', 'bungalow', 'loft', 'cottage', 'chalet'
  )),
  room_type VARCHAR(20) NOT NULL CHECK (room_type IN ('entire_place', 'private_room', 'shared_room')),
  
  -- Location
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Capacity
  max_guests INTEGER NOT NULL CHECK (max_guests > 0),
  num_bedrooms INTEGER NOT NULL CHECK (num_bedrooms >= 0),
  num_beds INTEGER NOT NULL CHECK (num_beds >= 0),
  num_bathrooms DECIMAL(3,1) NOT NULL CHECK (num_bathrooms >= 0),
  
  -- Pricing
  price_per_night DECIMAL(10,2) NOT NULL CHECK (price_per_night > 0),
  cleaning_fee DECIMAL(10,2) DEFAULT 0 CHECK (cleaning_fee >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  
  -- Booking settings
  minimum_nights INTEGER DEFAULT 1 CHECK (minimum_nights > 0),
  maximum_nights INTEGER CHECK (maximum_nights IS NULL OR maximum_nights >= minimum_nights),
  instant_booking BOOLEAN DEFAULT false,
  cancellation_policy VARCHAR(20) DEFAULT 'moderate' CHECK (cancellation_policy IN (
    'flexible', 'moderate', 'strict', 'super_strict'
  )),
  
  -- Availability
  is_published BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  
  -- Amenities (stored as JSON array)
  amenities JSONB DEFAULT '[]'::jsonb,
  
  -- Media
  main_image_url TEXT,
  image_urls JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  
  -- House rules
  house_rules TEXT,
  check_in_time TIME DEFAULT '15:00:00',
  check_out_time TIME DEFAULT '11:00:00',
  
  -- Safety features
  has_smoke_alarm BOOLEAN DEFAULT false,
  has_carbon_monoxide_alarm BOOLEAN DEFAULT false,
  has_fire_extinguisher BOOLEAN DEFAULT false,
  has_first_aid_kit BOOLEAN DEFAULT false,
  
  -- Additional information
  additional_info TEXT,
  
  -- Statistics
  total_views INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_listings_host_id ON listings(host_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_country ON listings(country);
CREATE INDEX idx_listings_property_type ON listings(property_type);
CREATE INDEX idx_listings_room_type ON listings(room_type);
CREATE INDEX idx_listings_is_published ON listings(is_published) WHERE is_published = true;
CREATE INDEX idx_listings_price_per_night ON listings(price_per_night);
CREATE INDEX idx_listings_max_guests ON listings(max_guests);
CREATE INDEX idx_listings_average_rating ON listings(average_rating);
CREATE INDEX idx_listings_location ON listings USING gist (ll_to_earth(latitude, longitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Enable PostGIS for geolocation queries (if available)
-- CREATE EXTENSION IF NOT EXISTS postgis;
-- CREATE INDEX idx_listings_geolocation ON listings USING GIST (ST_MakePoint(longitude, latitude));

-- Create trigger for listings table
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate amenities JSON structure
CREATE OR REPLACE FUNCTION validate_amenities()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amenities IS NOT NULL AND jsonb_typeof(NEW.amenities) != 'array' THEN
    RAISE EXCEPTION 'amenities must be a JSON array';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate amenities
CREATE TRIGGER validate_listings_amenities
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION validate_amenities();

-- Add comments for documentation
COMMENT ON TABLE listings IS 'Property listings with full details, pricing, and amenities';
COMMENT ON COLUMN listings.room_type IS 'Type: entire_place (whole property), private_room, or shared_room';
COMMENT ON COLUMN listings.cancellation_policy IS 'Policy: flexible, moderate, strict, or super_strict';
COMMENT ON COLUMN listings.amenities IS 'JSON array of amenity strings';
COMMENT ON COLUMN listings.image_urls IS 'JSON array of image URL strings';
