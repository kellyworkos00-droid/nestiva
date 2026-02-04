-- Migration: Create payment_transactions table
-- Description: Track host commission payments and platform fees
-- Created: 2026-02-04

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Transaction type
  transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN (
    'host_commission',      -- Platform fee charged to host
    'guest_service_fee',    -- Service fee from guest
    'host_payout',          -- Payment sent to host
    'refund_to_guest',      -- Refund issued to guest
    'refund_from_host'      -- Refund collected from host
  )),
  
  -- Amounts
  booking_total DECIMAL(10,2) NOT NULL,           -- Total booking amount
  commission_rate DECIMAL(5,2) NOT NULL,          -- Commission % (e.g., 15.00 for 15%)
  commission_amount DECIMAL(10,2) NOT NULL,       -- Calculated commission
  net_amount DECIMAL(10,2) NOT NULL,              -- Amount after commission
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  
  -- Payment status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',              -- Awaiting payment
    'processing',           -- Payment in progress
    'completed',            -- Successfully processed
    'failed',               -- Payment failed
    'refunded',             -- Refunded
    'cancelled'             -- Cancelled
  )),
  
  -- Payment method and details
  payment_method VARCHAR(30),                     -- card, bank_transfer, wallet, etc.
  payment_provider VARCHAR(50),                   -- stripe, paypal, etc.
  payment_intent_id VARCHAR(255),                 -- External payment ID
  transaction_reference VARCHAR(255),             -- Unique transaction reference
  
  -- Payment dates
  payment_due_date DATE,                          -- When payment is due
  payment_completed_at TIMESTAMP,                 -- When payment was completed
  
  -- Additional information
  description TEXT,
  failure_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_payment_transactions_booking_id ON payment_transactions(booking_id);
CREATE INDEX idx_payment_transactions_host_id ON payment_transactions(host_id);
CREATE INDEX idx_payment_transactions_guest_id ON payment_transactions(guest_id);
CREATE INDEX idx_payment_transactions_listing_id ON payment_transactions(listing_id);
CREATE INDEX idx_payment_transactions_type ON payment_transactions(transaction_type);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_payment_due_date ON payment_transactions(payment_due_date);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at DESC);

-- Create composite indexes for common queries
CREATE INDEX idx_payment_transactions_host_status ON payment_transactions(host_id, status);
CREATE INDEX idx_payment_transactions_type_status ON payment_transactions(transaction_type, status);

-- Create trigger for payment_transactions table
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate unique transaction reference
CREATE OR REPLACE FUNCTION generate_transaction_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
BEGIN
  ref := 'TXN-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8));
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate host commission
CREATE OR REPLACE FUNCTION calculate_host_commission(
  p_booking_total DECIMAL,
  p_commission_rate DECIMAL
)
RETURNS TABLE (
  commission_amount DECIMAL,
  net_amount DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(p_booking_total * (p_commission_rate / 100), 2) as commission_amount,
    ROUND(p_booking_total - (p_booking_total * (p_commission_rate / 100)), 2) as net_amount;
END;
$$ LANGUAGE plpgsql;

-- Create view for host earnings summary
CREATE OR REPLACE VIEW host_earnings_summary AS
SELECT 
  host_id,
  COUNT(DISTINCT booking_id) as total_bookings,
  SUM(CASE WHEN transaction_type = 'host_commission' AND status = 'completed' 
      THEN booking_total ELSE 0 END) as total_gross_earnings,
  SUM(CASE WHEN transaction_type = 'host_commission' AND status = 'completed' 
      THEN commission_amount ELSE 0 END) as total_commission_paid,
  SUM(CASE WHEN transaction_type = 'host_commission' AND status = 'completed' 
      THEN net_amount ELSE 0 END) as total_net_earnings,
  SUM(CASE WHEN transaction_type = 'host_commission' AND status = 'pending' 
      THEN commission_amount ELSE 0 END) as pending_commission,
  SUM(CASE WHEN transaction_type = 'host_payout' AND status = 'completed' 
      THEN net_amount ELSE 0 END) as total_payouts_received
FROM payment_transactions
GROUP BY host_id;

-- Add comments for documentation
COMMENT ON TABLE payment_transactions IS 'Payment transactions including host commissions, fees, and payouts';
COMMENT ON COLUMN payment_transactions.transaction_type IS 'Type: host_commission, guest_service_fee, host_payout, refund_to_guest, refund_from_host';
COMMENT ON COLUMN payment_transactions.commission_rate IS 'Commission percentage (e.g., 15.00 = 15%)';
COMMENT ON COLUMN payment_transactions.commission_amount IS 'Calculated commission amount in currency';
COMMENT ON COLUMN payment_transactions.net_amount IS 'Amount after deducting commission';
COMMENT ON FUNCTION calculate_host_commission IS 'Calculate commission and net amount for a booking total';
COMMENT ON VIEW host_earnings_summary IS 'Aggregated earnings and commission data per host';
