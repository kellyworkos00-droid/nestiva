-- Seed Data: Sample bookings
-- Description: Test bookings for development (past, current, and future)
-- Created: 2026-02-04

INSERT INTO bookings (
  id,
  listing_id,
  guest_id,
  host_id,
  check_in_date,
  check_out_date,
  number_of_guests,
  number_of_nights,
  status,
  booking_stage,
  base_price,
  cleaning_fee,
  service_fee,
  discount_amount,
  total_price,
  payment_status,
  guest_message,
  host_response,
  host_response_at
) VALUES
  -- Booking 1: Completed booking (Beach Villa)
  (
    'f1111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    '2026-01-15',
    '2026-01-20',
    4,
    5,
    'completed',
    'checked_out',
    2250.00,
    75.00,
    67.50,
    0,
    2392.50,
    'completed',
    'Looking forward to our family vacation!',
    'Welcome! You will love the beach house.',
    '2025-12-20 14:30:00'
  ),
  
  -- Booking 2: Current booking (Mountain Cabin)
  (
    'f2222222-2222-2222-2222-222222222222',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    '2026-02-02',
    '2026-02-06',
    2,
    4,
    'confirmed',
    'checked_in',
    880.00,
    50.00,
    26.40,
    0,
    956.40,
    'completed',
    'Excited for a mountain retreat!',
    'Enjoy the cabin! Let me know if you need anything.',
    '2026-01-25 10:15:00'
  ),
  
  -- Booking 3: Upcoming confirmed booking (Beach Villa)
  (
    'f3333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '55555555-5555-5555-5555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    '2026-03-10',
    '2026-03-15',
    6,
    5,
    'confirmed',
    'confirmed',
    2250.00,
    75.00,
    67.50,
    0,
    2392.50,
    'completed',
    'Cannot wait for spring break at the beach!',
    'You are going to love it! See you soon.',
    '2026-02-01 16:45:00'
  ),
  
  -- Booking 4: Pending booking (City Loft)
  (
    'f4444444-4444-4444-4444-444444444444',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    '2026-02-20',
    '2026-02-23',
    2,
    3,
    'pending',
    'awaiting_host',
    555.00,
    40.00,
    16.65,
    0,
    611.65,
    'pending',
    'Need a place for a business trip. Love the location!',
    NULL,
    NULL
  ),
  
  -- Booking 5: Cancelled booking (Luxury Penthouse)
  (
    'f5555555-5555-5555-5555-555555555555',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    '2026-02-25',
    '2026-02-28',
    2,
    3,
    'cancelled',
    'awaiting_host',
    1650.00,
    100.00,
    49.50,
    0,
    1799.50,
    'refunded',
    'Planning an anniversary celebration!',
    NULL,
    NULL
  ),
  
  -- Booking 6: Future booking (Private Room)
  (
    'f6666666-6666-6666-6666-666666666666',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '22222222-2222-2222-2222-222222222222',
    '55555555-5555-5555-5555-555555555555',
    '2026-04-01',
    '2026-04-05',
    1,
    4,
    'confirmed',
    'confirmed',
    260.00,
    15.00,
    7.80,
    0,
    282.80,
    'completed',
    'First time in San Diego, excited to meet locals!',
    'Welcome! I will show you around when you arrive.',
    '2026-02-03 09:20:00'
  );

-- Add cancellation details to cancelled booking
UPDATE bookings
SET 
  cancellation_reason = 'Plans changed, need to postpone trip',
  cancellation_requested_by = 'guest',
  cancelled_at = '2026-02-15 14:25:00',
  refund_amount = 1799.50
WHERE id = 'f5555555-5555-5555-5555-555555555555';

COMMENT ON TABLE bookings IS 'Sample bookings loaded: 1 completed, 1 current, 2 upcoming, 1 pending, 1 cancelled';
