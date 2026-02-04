# Nestiva API Endpoints

## Base URL
```
Production: https://api.nestiva.com/v1
Development: http://localhost:3001/api/v1
```

## Authentication
All endpoints (except public ones) require:
```
Authorization: Bearer {jwt_token}
```

---

## 🔐 AUTH ENDPOINTS

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePass123",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "guest" | "host" | "both"
}

Response:
{
  "success": true,
  "user": { id, email, first_name, last_name },
  "token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

### Login
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "securePass123"
}

Response:
{
  "success": true,
  "user": { id, email, user_type },
  "token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

### Phone Verification
```
POST /auth/send-verification-code
{
  "phone_number": "+1234567890"
}

POST /auth/verify-phone
{
  "phone_number": "+1234567890",
  "code": "123456"
}
```

### ID Verification
```
POST /auth/upload-verification-document
Content-Type: multipart/form-data
{
  "document": <file>,
  "document_type": "passport" | "drivers_license" | "id_card"
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer {token}
```

---

## 👤 USER ENDPOINTS

### Get Current User Profile
```
GET /users/me
Authorization: Bearer {token}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "profile_picture_url": "https://...",
  "bio": "Travel enthusiast",
  "verification_status": "verified",
  "user_type": "host",
  "is_superhost": true,
  "response_rate": 98.5,
  "response_time_hours": 2,
  "trust_score": 95,
  "created_at": "2025-01-15T10:00:00Z"
}
```

### Update User Profile
```
PUT /users/me
Authorization: Bearer {token}
{
  "first_name": "Jane",
  "last_name": "Smith",
  "bio": "New bio",
  "phone_number": "+1234567890"
}
```

### Upload Profile Picture
```
POST /users/me/profile-picture
Authorization: Bearer {token}
Content-Type: multipart/form-data
{
  "profile_picture": <file>
}
```

### Get User by ID
```
GET /users/{user_id}

Response: { user data }
```

### Get User Reviews
```
GET /users/{user_id}/reviews?limit=10&offset=0&type=host|guest|all

Response:
{
  "reviews": [...],
  "total_count": 42,
  "average_rating": 4.8
}
```

### Follow User
```
POST /users/{user_id}/follow
Authorization: Bearer {token}

Response: { success: true }
```

### Unfollow User
```
DELETE /users/{user_id}/follow
Authorization: Bearer {token}

Response: { success: true }
```

### Get Followers
```
GET /users/{user_id}/followers?limit=20&offset=0

Response:
{
  "followers": [...],
  "total_count": 150
}
```

---

## 🏠 LISTINGS ENDPOINTS

### Create Listing
```
POST /listings
Authorization: Bearer {token}
{
  "title": "Beautiful Beachfront Villa",
  "description": "Stunning villa with ocean views...",
  "category": "villa",
  "property_type": "entire home",
  "address": "123 Beach Road",
  "city": "Malibu",
  "country": "USA",
  "latitude": 34.0259,
  "longitude": -118.7798,
  "max_guests": 8,
  "bedrooms": 4,
  "beds": 6,
  "bathrooms": 3.5,
  "amenities": ["wifi", "pool", "parking", "kitchen"],
  "house_rules": ["No smoking", "Quiet hours after 10pm"],
  "cancellation_policy": "moderate",
  "base_price": 250.00,
  "currency": "USD",
  "cleaning_fee": 75.00,
  "instant_book_enabled": false
}

Response: { listing with id }
```

### Get Listing Details
```
GET /listings/{listing_id}

Response:
{
  "id": "uuid",
  "title": "Beautiful Beachfront Villa",
  "description": "...",
  "host": { user data },
  "images": [...],
  "amenities": [...],
  "pricing": { base_price, cleaning_fee, service_fee },
  "availability": [...],
  "reviews": { average_rating, count, recent_reviews },
  "view_count": 542
}
```

### Search Listings
```
GET /listings/search?city=Malibu&check_in=2025-02-10&check_out=2025-02-15&guests=4&max_price=500&min_rating=4.5&sort=popularity

Response:
{
  "listings": [
    {
      "id": "uuid",
      "title": "...",
      "images": [...],
      "price": 250,
      "rating": 4.8,
      "reviews": 42,
      "availability_status": "available"
    }
  ],
  "total_count": 156,
  "filters_applied": { ... }
}
```

### Map Search
```
GET /listings/map?bounds=south,west,north,east&zoom=12&check_in=2025-02-10&check_out=2025-02-15

Response:
{
  "listings": [
    {
      "id": "uuid",
      "title": "...",
      "latitude": 34.0259,
      "longitude": -118.7798,
      "price": 250,
      "thumbnail": "image_url",
      "rating": 4.8
    }
  ]
}
```

### Update Listing
```
PUT /listings/{listing_id}
Authorization: Bearer {token}
{
  "title": "Updated title",
  "description": "Updated description",
  "base_price": 300.00
}
```

### Publish/Unpublish Listing
```
PUT /listings/{listing_id}/publish
Authorization: Bearer {token}
{
  "is_published": true
}
```

### Upload Listing Images
```
POST /listings/{listing_id}/images
Authorization: Bearer {token}
Content-Type: multipart/form-data
{
  "images": [<file1>, <file2>],
  "display_order": 1
}

Response:
{
  "images": [
    {
      "id": "uuid",
      "image_url": "https://...",
      "display_order": 1,
      "is_cover": false
    }
  ]
}
```

### Set Cover Image
```
PUT /listings/{listing_id}/images/{image_id}/cover
Authorization: Bearer {token}

Response: { success: true }
```

### Get Listing Calendar
```
GET /listings/{listing_id}/calendar?month=2&year=2025

Response:
{
  "dates": [
    {
      "date": "2025-02-01",
      "is_available": true,
      "is_blocked": false,
      "price": 250
    }
  ]
}
```

### Update Calendar Availability
```
PUT /listings/{listing_id}/calendar
Authorization: Bearer {token}
{
  "dates": [
    {
      "date": "2025-02-15",
      "is_available": false,
      "is_blocked": true,
      "blocked_reason": "Personal use"
    }
  ]
}
```

### Auto-Pricing
```
POST /listings/{listing_id}/auto-pricing
Authorization: Bearer {token}
{
  "strategy": "demand_based",
  "min_price": 200,
  "max_price": 500,
  "enable_seasonal_pricing": true,
  "enable_event_pricing": true
}

Response:
{
  "predicted_prices": [
    {
      "date": "2025-02-15",
      "suggested_price": 350,
      "reason": "High demand - Valentine's Day"
    }
  ]
}
```

### Delete Listing
```
DELETE /listings/{listing_id}
Authorization: Bearer {token}

Response: { success: true }
```

---

## 📅 BOOKINGS ENDPOINTS

### Create Booking Request
```
POST /bookings
Authorization: Bearer {token}
{
  "listing_id": "uuid",
  "check_in_date": "2025-02-10",
  "check_out_date": "2025-02-15",
  "number_of_guests": 4,
  "special_requests": "High chair needed for baby",
  "guest_message": "We're excited to stay at your property!"
}

Response:
{
  "booking": {
    "id": "uuid",
    "listing_id": "uuid",
    "status": "pending",
    "total_price": 1500,
    "base_price": 1250,
    "cleaning_fee": 75,
    "service_fee": 175,
    "currency": "USD"
  },
  "payment_intent": "pi_..."
}
```

### Get Booking Details
```
GET /bookings/{booking_id}
Authorization: Bearer {token}

Response:
{
  "id": "uuid",
  "listing": { listing data },
  "guest": { user data },
  "host": { user data },
  "check_in_date": "2025-02-10",
  "check_out_date": "2025-02-15",
  "number_of_nights": 5,
  "total_price": 1500,
  "status": "pending",
  "booking_stage": "awaiting_host",
  "payment_status": "completed"
}
```

### Get My Bookings (Guest/Host)
```
GET /bookings?role=guest&status=all|completed|upcoming|cancelled&limit=20&offset=0
Authorization: Bearer {token}

Response:
{
  "bookings": [...],
  "total_count": 42
}
```

### Confirm Booking (Host)
```
PUT /bookings/{booking_id}/confirm
Authorization: Bearer {token}
{
  "check_in_time": "16:00",
  "check_out_time": "11:00",
  "host_message": "Looking forward to your stay!"
}

Response: { success: true, booking }
```

### Reject Booking (Host)
```
PUT /bookings/{booking_id}/reject
Authorization: Bearer {token}
{
  "reason": "Already booked for those dates"
}

Response: { success: true }
```

### Cancel Booking
```
PUT /bookings/{booking_id}/cancel
Authorization: Bearer {token}
{
  "reason": "Change of plans",
  "cancellation_reason_code": "guest_requested"
}

Response:
{
  "success": true,
  "refund_amount": 1350
}
```

### Check In
```
PUT /bookings/{booking_id}/check-in
Authorization: Bearer {token}
{
  "arrival_time": "2025-02-10T16:30:00Z"
}

Response: { success: true }
```

### Check Out
```
PUT /bookings/{booking_id}/check-out
Authorization: Bearer {token}
{
  "departure_time": "2025-02-15T10:30:00Z"
}

Response: { success: true }
```

---

## ⭐ REVIEWS ENDPOINTS

### Create Review
```
POST /bookings/{booking_id}/review
Authorization: Bearer {token}
{
  "rating": 5,
  "cleanliness_rating": 5,
  "communication_rating": 4,
  "location_rating": 5,
  "accuracy_rating": 5,
  "title": "Amazing experience!",
  "comment": "The villa exceeded all expectations...",
  "photos": [<file1>, <file2>]
}

Response:
{
  "review": {
    "id": "uuid",
    "rating": 5,
    "ai_summary": "Guests loved the cleanliness and location...",
    "highlights": ["Clean", "Great location", "Responsive host"],
    "concerns": []
  }
}
```

### Get Listing Reviews
```
GET /listings/{listing_id}/reviews?limit=10&offset=0&sort=recent|helpful

Response:
{
  "reviews": [
    {
      "id": "uuid",
      "reviewer": { user data },
      "rating": 5,
      "comment": "...",
      "highlights": [...],
      "concerns": [],
      "helpful_count": 42,
      "created_at": "2025-02-10T10:00:00Z"
    }
  ],
  "average_rating": 4.8,
  "rating_distribution": {
    "5": 120,
    "4": 15,
    "3": 2,
    "2": 1,
    "1": 0
  }
}
```

### Reply to Review (Host)
```
PUT /reviews/{review_id}/reply
Authorization: Bearer {token}
{
  "response": "Thank you so much for the kind words!"
}

Response: { success: true }
```

### Mark Review as Helpful
```
PUT /reviews/{review_id}/helpful
Authorization: Bearer {token}

Response: { success: true }
```

---

## ❤️ FAVORITES ENDPOINTS

### Save Listing
```
POST /favorites
Authorization: Bearer {token}
{
  "listing_id": "uuid",
  "collection_name": "Dream Homes"
}

Response: { success: true }
```

### Get Saved Listings
```
GET /favorites?collection_name=Dream%20Homes&limit=20&offset=0
Authorization: Bearer {token}

Response:
{
  "favorites": [...],
  "total_count": 15
}
```

### Remove from Favorites
```
DELETE /favorites/{listing_id}
Authorization: Bearer {token}

Response: { success: true }
```

---

## 💬 MESSAGES ENDPOINTS

### Send Message
```
POST /messages
Authorization: Bearer {token}
{
  "recipient_id": "uuid",
  "booking_id": "uuid", // optional
  "subject": "Question about your listing",
  "content": "Is there parking available?"
}

Response: { message_id, created_at }
```

### Get Conversation
```
GET /messages/conversation/{user_id}?limit=20&offset=0
Authorization: Bearer {token}

Response:
{
  "messages": [...],
  "unread_count": 3
}
```

### Mark Message as Read
```
PUT /messages/{message_id}/read
Authorization: Bearer {token}

Response: { success: true }
```

### Get Inbox
```
GET /messages/inbox?limit=20&offset=0&unread=false
Authorization: Bearer {token}

Response:
{
  "conversations": [
    {
      "user": { user_data },
      "last_message": "...",
      "unread_count": 2,
      "last_message_time": "2025-02-10T15:30:00Z"
    }
  ]
}
```

---

## 💳 PAYMENTS ENDPOINTS

### Create Payment Intent
```
POST /payments/create-intent
Authorization: Bearer {token}
{
  "booking_id": "uuid",
  "amount": 1500,
  "currency": "USD",
  "payment_method": "stripe"
}

Response:
{
  "client_secret": "pi_secret",
  "amount": 1500,
  "currency": "USD"
}
```

### Confirm Payment
```
POST /payments/confirm
Authorization: Bearer {token}
{
  "payment_intent_id": "pi_...",
  "booking_id": "uuid"
}

Response: { success: true, booking }
```

### Get Transaction History
```
GET /payments/transactions?limit=20&offset=0&type=all|booking|refund|payout
Authorization: Bearer {token}

Response:
{
  "transactions": [...],
  "total_count": 42
}
```

---

## 📊 ANALYTICS ENDPOINTS

### Track Event
```
POST /analytics/event
{
  "event_type": "listing_viewed",
  "event_data": {
    "listing_id": "uuid",
    "time_spent": 30,
    "device": "mobile"
  }
}
```

### Get Host Dashboard
```
GET /analytics/dashboard?date_range=last_30_days
Authorization: Bearer {token}

Response:
{
  "total_earnings": 2500,
  "earnings_trend": [...],
  "bookings_count": 5,
  "occupancy_rate": 0.75,
  "reviews_summary": { average_rating: 4.8 },
  "recent_bookings": [...],
  "top_performing_listings": [...]
}
```

---

## 🎟️ COUPONS ENDPOINTS

### Apply Coupon
```
POST /bookings/{booking_id}/apply-coupon
Authorization: Bearer {token}
{
  "coupon_code": "SAVE20"
}

Response:
{
  "discount_amount": 300,
  "new_total": 1200
}
```

### Validate Coupon
```
GET /coupons/{code}/validate?booking_amount=1500
Authorization: Bearer {token}

Response:
{
  "valid": true,
  "discount_type": "percentage",
  "discount_value": 20
}
```

---

## 🔔 NOTIFICATIONS ENDPOINTS

### Get Notifications
```
GET /notifications?limit=20&offset=0&read=false
Authorization: Bearer {token}

Response:
{
  "notifications": [...],
  "unread_count": 5
}
```

### Mark as Read
```
PUT /notifications/{notification_id}/read
Authorization: Bearer {token}

Response: { success: true }
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "User-friendly error message",
    "details": { ... }
  }
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Unprocessable Entity
- 429: Rate Limited
- 500: Server Error

