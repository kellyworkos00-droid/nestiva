-- Migration: Create bookings table
-- Description: Booking/reservation management with pricing and status tracking
-- Created: 2026-02-04

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Booking dates
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
  number_of_nights INTEGER NOT NULL CHECK (number_of_nights > 0),
  
  -- Booking status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'cancelled', 'completed', 'dispute'
  )),
  booking_stage VARCHAR(20) NOT NULL DEFAULT 'awaiting_host' CHECK (booking_stage IN (
    'awaiting_host', 'awaiting_guest', 'confirmed', 'checked_in', 'checked_out'
  )),
  
  -- Pricing breakdown
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
  cleaning_fee DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (cleaning_fee >= 0),
  service_fee DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (service_fee >= 0),
  discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  discount_code VARCHAR(50),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  
  -- Payment information
  payment_intent_id VARCHAR(255),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'processing', 'completed', 'refunded', 'partially_refunded', 'failed'
  )),
  
  -- Communication
  special_requests TEXT,
  guest_message TEXT,
  host_response TEXT,
  host_response_at TIMESTAMP,
  
  -- Cancellation
  cancellation_reason TEXT,
  cancellation_requested_by VARCHAR(10) CHECK (cancellation_requested_by IN ('guest', 'host', 'admin')),
  cancelled_at TIMESTAMP,
  refund_amount DECIMAL(10,2) CHECK (refund_amount >= 0),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_bookings_host_id ON bookings(host_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_stage ON bookings(booking_stage);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- Create composite indexes for common queries
CREATE INDEX idx_bookings_listing_status ON bookings(listing_id, status) WHERE status IN ('pending', 'confirmed');
CREATE INDEX idx_bookings_guest_status ON bookings(guest_id, status);
CREATE INDEX idx_bookings_host_status ON bookings(host_id, status);

-- Create trigger for bookings table
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate booking dates
CREATE OR REPLACE FUNCTION validate_booking_dates()
RETURNS TRIGGER AS $$
BEGIN
  -- Check-out must be after check-in
  IF NEW.check_out_date <= NEW.check_in_date THEN
    RAISE EXCEPTION 'Check-out date must be after check-in date';
  END IF;
  
  -- Calculate number of nights (should match the provided value)
  IF NEW.number_of_nights != (NEW.check_out_date - NEW.check_in_date) THEN
    RAISE EXCEPTION 'Number of nights does not match date range';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate dates
CREATE TRIGGER validate_bookings_dates
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_dates();

-- Create function to check booking availability (no overlaps)
CREATE OR REPLACE FUNCTION check_booking_availability(
  p_listing_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM bookings
  WHERE listing_id = p_listing_id
    AND status IN ('pending', 'confirmed')
    AND id != COALESCE(p_exclude_booking_id, '00000000-0000-0000-0000-000000000000'::UUID)
    AND (
      -- Overlapping date ranges
      (check_in_date < p_check_out AND check_out_date > p_check_in)
      OR (check_in_date >= p_check_in AND check_in_date < p_check_out)
      OR (check_out_date > p_check_in AND check_out_date <= p_check_out)
    );
  
  RETURN v_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Create constraint to prevent date conflicts (optional - can impact performance)
-- This would require checking availability before insert/update
-- Uncomment if you want database-level enforcement:
-- ALTER TABLE bookings ADD CONSTRAINT check_no_booking_conflicts
--   CHECK (check_booking_availability(listing_id, check_in_date, check_out_date, id));

-- Add comments for documentation
COMMENT ON TABLE bookings IS 'Booking/reservation records with status tracking and pricing';
COMMENT ON COLUMN bookings.status IS 'Overall status: pending, confirmed, cancelled, completed, dispute';
COMMENT ON COLUMN bookings.booking_stage IS 'Workflow stage: awaiting_host, awaiting_guest, confirmed, checked_in, checked_out';
COMMENT ON COLUMN bookings.payment_status IS 'Payment state: pending, processing, completed, refunded, partially_refunded, failed';
COMMENT ON COLUMN bookings.service_fee IS 'Platform service fee (typically 3% of base price)';
COMMENT ON FUNCTION check_booking_availability IS 'Check if listing is available for given date range (returns true if available)';
