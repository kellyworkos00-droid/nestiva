# Nestiva Database Schema

## Core Tables

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_picture_url VARCHAR(500),
  bio TEXT,
  verification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
  verification_document_url VARCHAR(500),
  user_type VARCHAR(50) DEFAULT 'guest', -- guest, host, both
  is_superhost BOOLEAN DEFAULT FALSE,
  response_rate DECIMAL(5, 2) DEFAULT 0,
  response_time_hours INTEGER,
  trust_score DECIMAL(5, 2) DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_is_superhost ON users(is_superhost);
```

### 2. Listings Table
```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- apartment, house, villa, cabin, etc.
  property_type VARCHAR(100), -- entire home, private room, shared room
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  max_guests INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  beds INTEGER NOT NULL,
  bathrooms DECIMAL(3, 1) NOT NULL,
  amenities JSONB, -- ["wifi", "pool", "parking", ...]
  house_rules JSONB,
  cancellation_policy VARCHAR(50), -- flexible, moderate, strict, super_strict
  base_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,
  service_fee_percentage DECIMAL(5, 2) DEFAULT 3,
  availability_status VARCHAR(50) DEFAULT 'available', -- available, blocked, maintenance
  instant_book_enabled BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_listings_host_id ON listings(host_id);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_location ON listings USING GIST(
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_listings_is_published ON listings(is_published);
CREATE INDEX idx_listings_average_rating ON listings(average_rating DESC);
```

### 3. Listing Images Table
```sql
CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  image_key VARCHAR(255) NOT NULL, -- S3 key
  display_order INTEGER NOT NULL,
  is_cover BOOLEAN DEFAULT FALSE,
  alt_text VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX idx_listing_images_cover ON listing_images(listing_id, is_cover);
```

### 4. Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  guest_id UUID NOT NULL REFERENCES users(id),
  host_id UUID NOT NULL REFERENCES users(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INTEGER NOT NULL,
  number_of_nights INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed, dispute
  booking_stage VARCHAR(50) DEFAULT 'awaiting_host', -- awaiting_host, awaiting_guest, confirmed, checked_in, checked_out
  base_price DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,
  service_fee DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  discount_code VARCHAR(100),
  total_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_intent_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, refunded, failed
  special_requests TEXT,
  guest_message TEXT,
  host_response TEXT,
  host_response_at TIMESTAMP,
  cancellation_reason VARCHAR(500),
  cancellation_requested_by VARCHAR(50), -- guest, host, admin
  cancelled_at TIMESTAMP,
  check_in_time VARCHAR(50), -- flexible, 16:00, etc.
  check_out_time VARCHAR(50), -- 11:00, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_bookings_host_id ON bookings(host_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_check_in_date ON bookings(check_in_date);
```

### 5. Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  review_type VARCHAR(50) DEFAULT 'listing', -- listing, host, guest
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
  accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  highlights JSONB, -- extracted positive aspects via AI
  concerns JSONB, -- extracted negative aspects via AI
  photos JSONB, -- array of image URLs
  ai_summary TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  response TEXT,
  response_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
```

### 6. Calendar Availability Table
```sql
CREATE TABLE calendar_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_blocked BOOLEAN DEFAULT FALSE,
  price_override DECIMAL(10, 2), -- optional override for specific dates
  min_nights_override INTEGER,
  blocked_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(listing_id, date)
);

CREATE INDEX idx_calendar_availability_listing_id ON calendar_availability(listing_id);
CREATE INDEX idx_calendar_availability_date ON calendar_availability(date);
```

### 7. Favorites Table
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  collection_name VARCHAR(255) DEFAULT 'Saved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, listing_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON favorites(listing_id);
```

### 8. Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
```

### 9. Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  payer_id UUID NOT NULL REFERENCES users(id),
  payee_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  transaction_type VARCHAR(50), -- booking, refund, payout, fee
  payment_method VARCHAR(50), -- stripe, apple_pay, google_pay, wire_transfer
  payment_intent_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
  failure_reason VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX idx_transactions_payer_id ON transactions(payer_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

### 10. Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100), -- booking_request, review_posted, message, price_drop, host_response
  title VARCHAR(255) NOT NULL,
  content TEXT,
  data JSONB, -- contextual data (booking_id, etc)
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

### 11. Follow Relationships Table
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, followee_id)
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_followee_id ON follows(followee_id);
```

### 12. Coupons & Discounts Table
```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(50), -- percentage, fixed_amount
  discount_value DECIMAL(10, 2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expiry_date DATE,
  min_booking_amount DECIMAL(10, 2) DEFAULT 0,
  applicable_listings JSONB, -- null = all listings
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_expiry_date ON coupons(expiry_date);
```

### 13. Analytics Events Table
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(100),
  event_data JSONB,
  listing_id UUID REFERENCES listings(id),
  device_type VARCHAR(50), -- web, mobile, tablet
  os VARCHAR(50),
  browser VARCHAR(50),
  ip_address INET,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_listing_id ON analytics_events(listing_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
```

## Materialized Views for Performance

```sql
CREATE MATERIALIZED VIEW top_listings AS
SELECT 
  l.id,
  l.title,
  l.city,
  l.average_rating,
  l.review_count,
  COUNT(b.id) as booking_count,
  l.base_price,
  (l.review_count * 0.4 + COUNT(b.id) * 0.3 + l.view_count * 0.3) as popularity_score
FROM listings l
LEFT JOIN bookings b ON l.id = b.listing_id AND b.status = 'completed'
WHERE l.is_published = TRUE
GROUP BY l.id
ORDER BY popularity_score DESC;

CREATE INDEX idx_top_listings_city ON top_listings(city);
CREATE INDEX idx_top_listings_rating ON top_listings(average_rating DESC);
```

## Key Design Decisions

1. **UUID Primary Keys**: Better for distributed systems and privacy
2. **JSONB Storage**: For flexible data like amenities, house rules
3. **Soft Deletes**: Using `deleted_at` for data recovery
4. **Decimal for Prices**: Ensures accuracy for financial transactions
5. **Geographic Queries**: PostGIS extension for location-based searches
6. **Event Logging**: For analytics and audit trails
7. **Normalized Structure**: Balancing between normalization and query efficiency

