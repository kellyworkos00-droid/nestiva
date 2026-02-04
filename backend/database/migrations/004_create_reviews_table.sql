-- Migration: Create reviews table
-- Description: Guest reviews and ratings for listings and hosts
-- Created: 2026-02-04
-- Note: Ready for Phase 3 implementation

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  review_type VARCHAR(20) NOT NULL CHECK (review_type IN ('guest_to_host', 'host_to_guest')),
  
  -- Ratings (1-5 scale)
  overall_rating DECIMAL(2,1) NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  cleanliness_rating DECIMAL(2,1) CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  accuracy_rating DECIMAL(2,1) CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  communication_rating DECIMAL(2,1) CHECK (communication_rating >= 1 AND communication_rating <= 5),
  location_rating DECIMAL(2,1) CHECK (location_rating >= 1 AND location_rating <= 5),
  value_rating DECIMAL(2,1) CHECK (value_rating >= 1 AND value_rating <= 5),
  check_in_rating DECIMAL(2,1) CHECK (check_in_rating >= 1 AND check_in_rating <= 5),
  
  -- Review content
  review_text TEXT NOT NULL,
  
  -- Review response
  response_text TEXT,
  response_at TIMESTAMP,
  
  -- Visibility
  is_published BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_review_type ON reviews(review_type);
CREATE INDEX idx_reviews_overall_rating ON reviews(overall_rating);
CREATE INDEX idx_reviews_is_published ON reviews(is_published) WHERE is_published = true;
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Create trigger for reviews table
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update listing average rating
CREATE OR REPLACE FUNCTION update_listing_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update listing's average rating and review count
  UPDATE listings
  SET 
    average_rating = (
      SELECT COALESCE(AVG(overall_rating), 0)
      FROM reviews
      WHERE listing_id = NEW.listing_id
        AND review_type = 'guest_to_host'
        AND is_published = true
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE listing_id = NEW.listing_id
        AND review_type = 'guest_to_host'
        AND is_published = true
    )
  WHERE id = NEW.listing_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update listing rating when review is added
CREATE TRIGGER update_listing_rating_on_review
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  WHEN (NEW.review_type = 'guest_to_host' AND NEW.is_published = true)
  EXECUTE FUNCTION update_listing_average_rating();

-- Ensure only one review per booking per reviewer
CREATE UNIQUE INDEX idx_reviews_unique_booking_reviewer
  ON reviews(booking_id, reviewer_id);

-- Add comments for documentation
COMMENT ON TABLE reviews IS 'Reviews and ratings for completed bookings (bidirectional: guest↔host)';
COMMENT ON COLUMN reviews.review_type IS 'Direction: guest_to_host or host_to_guest';
COMMENT ON COLUMN reviews.overall_rating IS 'Overall rating on 1-5 scale (required)';
COMMENT ON COLUMN reviews.cleanliness_rating IS 'Cleanliness rating (optional, for guest_to_host)';
