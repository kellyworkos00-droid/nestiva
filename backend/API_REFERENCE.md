# Nestiva Backend API - Quick Reference

## Base URL
```
Development: http://localhost:3001/api/v1
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Auth Endpoints

### 1. Register User
**POST** `/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "guest" | "host" | "both"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "user_type": "guest",
      "is_superhost": false,
      "response_rate": 0,
      "trust_score": 50,
      "verification_status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

---

### 2. Login User
**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_access_token"
  }
}
```

---

### 3. Send Phone Verification Code
**POST** `/auth/send-verification-code`

Request:
```json
{
  "phone_number": "+1234567890"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "message": "Verification code sent",
    "code": "123456" // Only in development
  }
}
```

---

### 4. Verify Phone Code
**POST** `/auth/verify-phone`
*Protected*

Request:
```json
{
  "phone_number": "+1234567890",
  "code": "123456"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "message": "Phone number verified"
  }
}
```

---

### 5. Upload Verification Document
**POST** `/auth/upload-verification-document`
*Protected*

Request:
```json
{
  "document_url": "https://cdn.example.com/doc.pdf",
  "document_type": "passport" | "drivers_license" | "id_card"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "message": "Document uploaded for verification"
  }
}
```

---

### 6. Logout
**POST** `/auth/logout`
*Protected*

Response (200):
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## User Endpoints

### 1. Get Current User Profile
**GET** `/users/me`
*Protected*

Response (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "+1234567890",
      "bio": "Travel enthusiast",
      "profile_picture_url": "https://...",
      "is_superhost": true,
      "response_rate": 98,
      "trust_score": 95,
      "verification_status": "verified"
    }
  }
}
```

---

### 2. Get User by ID
**GET** `/users/{userId}`

Response (200):
```json
{
  "success": true,
  "data": {
    "user": { ... } // Public profile only
  }
}
```

---

### 3. Update Profile
**PUT** `/users/me`
*Protected*

Request:
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "bio": "Updated bio",
  "phone_number": "+1234567890",
  "response_time_hours": 2
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

---

### 4. Upload Profile Picture
**POST** `/users/me/profile-picture`
*Protected*

Request:
```json
{
  "profile_picture_url": "https://cdn.example.com/avatar.jpg"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

---

### 5. Get User Reputation
**GET** `/users/{userId}/reputation`

Response (200):
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "stats": {
      "trustScore": 95,
      "responseRate": 98,
      "isSuperhost": true,
      "reviewCount": 42,
      "averageRating": 4.8
    }
  }
}
```

---

### 6. Search Users
**GET** `/users/search?q=john&limit=20&offset=0`

Response (200):
```json
{
  "success": true,
  "data": {
    "users": [ ... ],
    "total": 5
  }
}
```

---

## Listing Endpoints

### 1. Create Listing
**POST** `/listings`
*Protected*

Request:
```json
{
  "title": "Cozy Studio in NYC",
  "description": "Beautiful studio apartment in Manhattan with modern amenities and great views...",
  "category": "apartments",
  "property_type": "studio",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "max_guests": 2,
  "bedrooms": 1,
  "beds": 1,
  "bathrooms": 1,
  "amenities": ["wifi", "kitchen", "air conditioning", "washer"],
  "house_rules": ["no smoking", "no pets"],
  "cancellation_policy": "moderate",
  "base_price": 150,
  "currency": "USD",
  "cleaning_fee": 25,
  "service_fee_percentage": 3
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "listing": {
      "id": "uuid",
      "host_id": "uuid",
      "title": "Cozy Studio in NYC",
      "is_published": false,
      "base_price": 150,
      "view_count": 0,
      "review_count": 0,
      "average_rating": 0,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

### 2. Get My Listings
**GET** `/listings/my-listings?limit=20&offset=0`
*Protected*

Response (200):
```json
{
  "success": true,
  "data": {
    "listings": [ ... ],
    "total": 5
  }
}
```

---

### 3. Get Listing by ID
**GET** `/listings/{listingId}`

Response (200):
```json
{
  "success": true,
  "data": {
    "listing": {
      "id": "uuid",
      "host_id": "uuid",
      "title": "Cozy Studio in NYC",
      "description": "...",
      "amenities": ["wifi", "kitchen", "ac"],
      "base_price": 150,
      "view_count": 42,
      "review_count": 5,
      "average_rating": 4.6
    }
  }
}
```

---

### 4. Update Listing
**PUT** `/listings/{listingId}`
*Protected*

Request: Same fields as Create Listing (partial)

Response (200):
```json
{
  "success": true,
  "data": {
    "listing": { ... }
  }
}
```

---

### 5. Publish Listing
**POST** `/listings/{listingId}/publish`
*Protected*

Response (200):
```json
{
  "success": true,
  "data": {
    "listing": {
      "id": "uuid",
      "is_published": true
    }
  }
}
```

---

### 6. Unpublish Listing
**POST** `/listings/{listingId}/unpublish`
*Protected*

Response (200):
```json
{
  "success": true,
  "data": {
    "listing": {
      "id": "uuid",
      "is_published": false
    }
  }
}
```

---

### 7. Search Listings
**GET** `/listings/search?city=New%20York&min_price=100&max_price=200&bedrooms=1&limit=20&offset=0`

Query Parameters:
- `city` (optional) - Filter by city
- `category` (optional) - Filter by category
- `min_price` (optional) - Minimum price
- `max_price` (optional) - Maximum price
- `bedrooms` (optional) - Minimum bedrooms
- `check_in_date` (optional) - ISO date string
- `check_out_date` (optional) - ISO date string
- `limit` (optional) - Results per page (default: 20, max: 100)
- `offset` (optional) - Pagination offset (default: 0)

Response (200):
```json
{
  "success": true,
  "data": {
    "listings": [ ... ],
    "total": 42
  }
}
```

---

### 8. Get Listing Stats
**GET** `/listings/{listingId}/stats`
*Protected*

Response (200):
```json
{
  "success": true,
  "data": {
    "viewCount": 42,
    "reviewCount": 5,
    "averageRating": 4.6,
    "inquiryCount": 3
  }
}
```

---

### 9. Delete Listing
**DELETE** `/listings/{listingId}`
*Protected*

Response (200):
```json
{
  "success": true,
  "data": {
    "message": "Listing deleted"
  }
}
```

---

## Error Responses

### 400 - Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password does not meet strength requirements",
    "details": {
      "errors": [
        "Password must contain at least one uppercase letter"
      ]
    }
  }
}
```

### 401 - Authentication Error
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid email or password"
  }
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

### 409 - Conflict
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "User with this email already exists"
  }
}
```

---

## Example cURL Requests

### Register
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "host"
  }'
```

### Login & Get Token
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }' | jq -r '.data.token'
```

### Create Listing (with token)
```bash
TOKEN="your_token_here"

curl -X POST http://localhost:3001/api/v1/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cozy Studio in NYC",
    "description": "Beautiful studio with modern amenities...",
    "category": "apartments",
    "property_type": "studio",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "max_guests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "amenities": ["wifi", "kitchen"],
    "house_rules": ["no smoking"],
    "cancellation_policy": "moderate",
    "base_price": 150,
    "currency": "USD",
    "cleaning_fee": 25,
    "service_fee_percentage": 3
  }'
```

### Search Listings
```bash
curl -X GET "http://localhost:3001/api/v1/listings/search?city=New%20York&min_price=100&max_price=200" \
  -H "Content-Type: application/json"
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Logic error |
| 500 | Internal Server Error |

---

## Booking Endpoints

### 1. Create Booking
**POST** `/bookings`  
*Protected - Guest*

Request:
```json
{
  "listing_id": "uuid",
  "check_in_date": "2026-03-01",
  "check_out_date": "2026-03-05",
  "number_of_guests": 2,
  "special_requests": "Late check-in needed",
  "guest_message": "Looking forward to staying!",
  "discount_code": "SUMMER2026"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "uuid",
      "listing_id": "uuid",
      "guest_id": "uuid",
      "host_id": "uuid",
      "check_in_date": "2026-03-01T00:00:00Z",
      "check_out_date": "2026-03-05T00:00:00Z",
      "number_of_guests": 2,
      "number_of_nights": 4,
      "status": "pending",
      "booking_stage": "awaiting_host",
      "base_price": 480.00,
      "cleaning_fee": 25.00,
      "service_fee": 14.40,
      "discount_amount": 0,
      "total_price": 519.40,
      "currency": "USD",
      "payment_status": "pending",
      "created_at": "2026-02-04T12:00:00Z"
    }
  }
}
```

### 2. Get Booking Details
**GET** `/bookings/:bookingId`  
*Protected - Guest or Host*

### 3. Get My Bookings
**GET** `/bookings/my-bookings?status=confirmed&limit=20&offset=0`  
*Protected - Guest*

Query Parameters:
- `status` (optional): pending, confirmed, cancelled, completed
- `limit` (optional): Default 20
- `offset` (optional): Default 0

### 4. Get Host Bookings
**GET** `/bookings/host-bookings?status=pending&limit=20&offset=0`  
*Protected - Host*

### 5. Get Upcoming Bookings
**GET** `/bookings/upcoming?limit=10`  
*Protected - Host*

### 6. Confirm Booking
**POST** `/bookings/:bookingId/confirm`  
*Protected - Host*

Request:
```json
{
  "host_response": "Welcome! Looking forward to hosting you."
}
```

### 7. Reject Booking
**POST** `/bookings/:bookingId/reject`  
*Protected - Host*

### 8. Cancel Booking
**POST** `/bookings/:bookingId/cancel`  
*Protected - Guest or Host*

Request:
```json
{
  "cancellation_reason": "Plans changed"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "booking": { ... },
    "refund_amount": 519.40
  }
}
```

**Cancellation Policies:**
- **Flexible**: 100% refund if ≥24hrs before check-in
- **Moderate**: 100% if ≥5 days, 50% if ≥1 day
- **Strict**: 100% if ≥7 days, 50% if ≥1 day
- **Super Strict**: 50% if ≥30 days

### 9. Check-in Booking
**POST** `/bookings/:bookingId/check-in`  
*Protected - Guest or Host*

### 10. Check-out Booking
**POST** `/bookings/:bookingId/check-out`  
*Protected - Guest or Host*

### 11. Get Listing Bookings
**GET** `/bookings/listing/:listingId?limit=20&offset=0`  
*Protected - Host*

### 12. Get Listing Stats
**GET** `/bookings/listing/:listingId/stats`  
*Protected - Host*

Response:
```json
{
  "success": true,
  "data": {
    "totalBookings": 15,
    "confirmedBookings": 12,
    "totalRevenue": 6250.50,
    "averageBookingValue": 520.88,
    "occupancyRate": 68.5
  }
}
```

---

## Review Endpoints

### 1. Create Review
**POST** `/reviews`  
*Protected - Guest or Host*

Request:
```json
{
  "booking_id": "uuid",
  "overall_rating": 5.0,
  "cleanliness_rating": 5.0,
  "accuracy_rating": 4.5,
  "communication_rating": 5.0,
  "location_rating": 4.5,
  "value_rating": 5.0,
  "check_in_rating": 5.0,
  "review_text": "Amazing stay! The host was very responsive and the place was exactly as described."
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "review": {
      "id": "uuid",
      "booking_id": "uuid",
      "listing_id": "uuid",
      "reviewer_id": "uuid",
      "reviewee_id": "uuid",
      "review_type": "guest_to_host",
      "overall_rating": 5.0,
      "cleanliness_rating": 5.0,
      "review_text": "Amazing stay!...",
      "is_published": true,
      "created_at": "2026-02-04T12:00:00Z"
    }
  }
}
```

**Note**: Category ratings (cleanliness, accuracy, etc.) only available for guest-to-host reviews.

### 2. Get Review
**GET** `/reviews/:reviewId`  
*Public*

### 3. Get Listing Reviews
**GET** `/reviews/listing/:listingId?limit=20&offset=0`  
*Public*

Response:
```json
{
  "success": true,
  "data": {
    "reviews": [ ... ],
    "total": 47
  }
}
```

### 4. Get Listing Ratings
**GET** `/reviews/listing/:listingId/ratings`  
*Public*

Response:
```json
{
  "success": true,
  "data": {
    "ratings": {
      "overall_rating": 4.85,
      "cleanliness_rating": 4.9,
      "accuracy_rating": 4.8,
      "communication_rating": 4.95,
      "location_rating": 4.7,
      "value_rating": 4.8,
      "check_in_rating": 4.9,
      "total_reviews": 47
    }
  }
}
```

### 5. Get My Reviews
**GET** `/reviews/my-reviews?limit=20&offset=0`  
*Protected - Any User*

Get reviews written by authenticated user.

### 6. Get User Reviews Received
**GET** `/reviews/user/:userId/received?reviewType=guest_to_host&limit=20&offset=0`  
*Public*

Query Parameters:
- `reviewType` (optional): guest_to_host or host_to_guest

### 7. Get Host Rating
**GET** `/reviews/host/:hostId/rating`  
*Public*

Response:
```json
{
  "success": true,
  "data": {
    "rating": {
      "average_rating": 4.85,
      "total_reviews": 47
    }
  }
}
```

### 8. Respond to Review
**POST** `/reviews/:reviewId/respond`  
*Protected - Reviewee*

Request:
```json
{
  "response_text": "Thank you for the wonderful review! It was a pleasure hosting you."
}
```

### 9. Flag Review
**POST** `/reviews/:reviewId/flag`  
*Protected - Any User*

Request:
```json
{
  "reason": "Contains inappropriate language or personal attacks"
}
```

### 10. Check Can Review
**GET** `/reviews/booking/:bookingId/can-review`  
*Protected - Guest or Host*

Response:
```json
{
  "success": true,
  "data": {
    "canReview": true
  }
}
```

Or:
```json
{
  "success": true,
  "data": {
    "canReview": false,
    "reason": "You have already reviewed this booking"
  }
}
```

### 11. Get Pending Reviews
**GET** `/reviews/pending`  
*Protected - Any User*

Get list of completed bookings that user hasn't reviewed yet.

Response:
```json
{
  "success": true,
  "data": {
    "pending_reviews": [
      {
        "booking_id": "uuid",
        "listing_id": "uuid",
        "check_in_date": "2026-01-15",
        "check_out_date": "2026-01-20",
        "is_guest": true,
        "is_host": false
      }
    ],
    "count": 1
  }
}
```

---

## Message & Conversation Endpoints

### 1. Start or Get Conversation
**POST** `/messages/conversations`  
*Protected*

Start a new conversation or retrieve existing one for a listing.

Request:
```json
{
  "listing_id": "uuid",
  "booking_id": "uuid (optional)"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "uuid",
      "listing_id": "uuid",
      "host_id": "uuid",
      "guest_id": "uuid",
      "booking_id": "uuid",
      "status": "active",
      "last_message_at": null,
      "last_message_preview": null,
      "host_archived": false,
      "guest_archived": false,
      "created_at": "2026-02-04T12:00:00Z"
    }
  },
  "message": "Conversation started"
}
```

### 2. Get User Conversations
**GET** `/messages/conversations?include_archived=false&limit=50&offset=0`  
*Protected*

Get list of user's conversations with summary data.

Query Parameters:
- `include_archived` (boolean): Include archived conversations (default: false)
- `limit` (number): Results per page (default: 50, max: 100)
- `offset` (number): Pagination offset (default: 0)

Response:
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "listing_id": "uuid",
        "host_id": "uuid",
        "guest_id": "uuid",
        "status": "active",
        "last_message_at": "2026-02-04T15:30:00Z",
        "last_message_preview": "Hi, I'm interested in booking your place for...",
        "host_archived": false,
        "guest_archived": false,
        "listing_title": "Beach Villa with Ocean View",
        "listing_photos": ["url1", "url2"],
        "host_first_name": "John",
        "host_last_name": "Doe",
        "host_profile_picture": "url",
        "guest_first_name": "Jane",
        "guest_last_name": "Smith",
        "guest_profile_picture": "url",
        "host_unread_count": 0,
        "guest_unread_count": 2
      }
    ],
    "total": 15
  }
}
```

### 3. Get Conversation Details
**GET** `/messages/conversations/:conversationId`  
*Protected*

Get specific conversation details. User must be participant.

Response:
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "uuid",
      "listing_id": "uuid",
      "host_id": "uuid",
      "guest_id": "uuid",
      "booking_id": "uuid",
      "status": "active",
      "last_message_at": "2026-02-04T15:30:00Z",
      "created_at": "2026-02-01T10:00:00Z"
    }
  }
}
```

### 4. Get Conversation Messages
**GET** `/messages/conversations/:conversationId/messages?limit=50&offset=0&before=messageId`  
*Protected*

Get messages in a conversation. Returns in chronological order.

Query Parameters:
- `limit` (number): Results per page (default: 50, max: 100)
- `offset` (number): Pagination offset (default: 0)
- `before` (string): Get messages before this message ID (for infinite scroll)

Response:
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "conversation_id": "uuid",
        "sender_id": "uuid",
        "receiver_id": "uuid",
        "content": "Hi! I'm interested in booking your place for next weekend.",
        "message_type": "text",
        "is_read": true,
        "read_at": "2026-02-04T15:35:00Z",
        "attachments": [],
        "metadata": {},
        "created_at": "2026-02-04T15:30:00Z"
      }
    ],
    "total": 8
  }
}
```

### 5. Send Message
**POST** `/messages/conversations/:conversationId/messages`  
*Protected*

Send a message in a conversation. Max 5000 characters.

Request:
```json
{
  "content": "Thanks for your interest! The place is available for those dates.",
  "message_type": "text",
  "attachments": ["url1", "url2"],
  "metadata": {}
}
```

Response:
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "uuid",
      "conversation_id": "uuid",
      "sender_id": "uuid",
      "receiver_id": "uuid",
      "content": "Thanks for your interest! The place is available for those dates.",
      "message_type": "text",
      "is_read": false,
      "attachments": [],
      "created_at": "2026-02-04T15:32:00Z"
    }
  },
  "message": "Message sent successfully"
}
```

### 6. Mark Message as Read
**PATCH** `/messages/:messageId/read`  
*Protected*

Mark a single message as read. Only receiver can mark as read.

Response:
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "uuid",
      "is_read": true,
      "read_at": "2026-02-04T15:35:00Z"
    }
  },
  "message": "Message marked as read"
}
```

### 7. Mark Conversation as Read
**PATCH** `/messages/conversations/:conversationId/read`  
*Protected*

Mark all unread messages in conversation as read for current user.

Response:
```json
{
  "success": true,
  "data": {
    "markedCount": 3
  },
  "message": "3 messages marked as read"
}
```

### 8. Delete Message
**DELETE** `/messages/:messageId`  
*Protected*

Soft delete a message. Only sender can delete their own messages.

Response:
```json
{
  "success": true,
  "data": null,
  "message": "Message deleted successfully"
}
```

### 9. Archive Conversation
**PATCH** `/messages/conversations/:conversationId/archive`  
*Protected*

Archive conversation for current user. Doesn't affect other participant.

Response:
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "uuid",
      "host_archived": true,
      "guest_archived": false
    }
  },
  "message": "Conversation archived"
}
```

### 10. Unarchive Conversation
**PATCH** `/messages/conversations/:conversationId/unarchive`  
*Protected*

Unarchive a previously archived conversation.

Response:
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "uuid",
      "host_archived": false
    }
  },
  "message": "Conversation unarchived"
}
```

### 11. Get Unread Message Count
**GET** `/messages/unread-count`  
*Protected*

Get total unread message count for current user.

Response:
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

---

## Payment & Commission Endpoints

### 1. Get Commission Rate
**GET** `/payments/commission/rate`  
*Public*

Get current platform commission rate.

Response:
```json
{
  "success": true,
  "data": {
    "commission_rate": 15,
    "description": "Platform charges 15% commission on confirmed bookings"
  }
}
```

### 2. Calculate Commission Preview
**POST** `/payments/commission/calculate`  
*Public*

Calculate commission for a booking amount before confirming.

Request:
```json
{
  "booking_amount": 1000.00
}
```

Response:
```json
{
  "success": true,
  "data": {
    "calculation": {
      "booking_amount": 1000.00,
      "commission_rate": 15,
      "commission_amount": 150.00,
      "host_net_amount": 850.00,
      "currency": "USD"
    }
  }
}
```

### 3. Create Commission for Booking
**POST** `/payments/commission/booking/:bookingId`  
*Protected - Auto-triggered on booking confirmation*

Create commission transaction when host confirms booking.

Response:
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "uuid",
      "booking_id": "uuid",
      "transaction_type": "host_commission",
      "booking_total": 1000.00,
      "commission_rate": 15,
      "commission_amount": 150.00,
      "net_amount": 850.00,
      "status": "pending",
      "payment_due_date": "2026-03-12",
      "transaction_reference": "TXN-20260304-A1B2C3D4",
      "created_at": "2026-03-05T12:00:00Z"
    }
  }
}
```

### 4. Get Host Earnings Summary
**GET** `/payments/host/earnings`  
*Protected - Host*

Get complete financial overview for authenticated host.

Response:
```json
{
  "success": true,
  "data": {
    "earnings": {
      "total_bookings": 25,
      "total_gross_earnings": 12500.00,
      "total_commission_paid": 1875.00,
      "total_net_earnings": 10625.00,
      "pending_commission": 450.00,
      "total_payouts_received": 10175.00,
      "commission_rate": 15
    }
  }
}
```

### 5. Get Pending Commissions
**GET** `/payments/host/pending-commissions`  
*Protected - Host*

Get all unpaid commission transactions for authenticated host.

Response:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "booking_id": "uuid",
        "listing_title": "Beach Villa with Ocean View",
        "booking_total": 1000.00,
        "commission_amount": 150.00,
        "net_amount": 850.00,
        "payment_due_date": "2026-03-12",
        "check_in_date": "2026-03-01",
        "check_out_date": "2026-03-05",
        "status": "pending"
      }
    ],
    "total_amount": 450.00,
    "currency": "USD"
  }
}
```

### 6. Get Host Transactions
**GET** `/payments/host/transactions`  
*Protected - Host*

Get paginated list of payment transactions for authenticated host.

Query Parameters:
- `type` (optional): Filter by transaction_type (host_commission, host_payout, etc.)
- `status` (optional): Filter by status (pending, completed, failed, etc.)
- `limit` (optional): Results per page (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

Response:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "booking_id": "uuid",
        "transaction_type": "host_commission",
        "booking_total": 1000.00,
        "commission_amount": 150.00,
        "net_amount": 850.00,
        "status": "completed",
        "payment_due_date": "2026-03-12",
        "payment_completed_at": "2026-03-10T14:30:00Z",
        "transaction_reference": "TXN-20260304-A1B2C3D4",
        "listing": {
          "id": "uuid",
          "title": "Beach Villa"
        },
        "booking": {
          "check_in_date": "2026-03-01",
          "check_out_date": "2026-03-05"
        }
      }
    ],
    "total": 25,
    "limit": 50,
    "offset": 0
  }
}
```

### 7. Pay Commission
**POST** `/payments/commission/:transactionId/pay`  
*Protected - Host*

Mark commission as paid by host. Only the host who owns the transaction can process payment.

Request:
```json
{
  "payment_method": "card",
  "payment_intent_id": "pi_stripe_123abc",
  "payment_provider": "stripe"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "uuid",
      "status": "completed",
      "payment_method": "card",
      "payment_provider": "stripe",
      "payment_intent_id": "pi_stripe_123abc",
      "payment_completed_at": "2026-03-10T14:30:00Z",
      "transaction_reference": "TXN-20260304-A1B2C3D4"
    },
    "message": "Commission payment processed successfully"
  }
}
```

### 8. Get Transaction Details
**GET** `/payments/transactions/:transactionId`  
*Protected - Host or Guest*

Get details of a specific payment transaction. User must be either the host or guest associated with the transaction.

Response:
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "uuid",
      "booking_id": "uuid",
      "listing_id": "uuid",
      "host_id": "uuid",
      "guest_id": "uuid",
      "transaction_type": "host_commission",
      "booking_total": 1000.00,
      "commission_rate": 15,
      "commission_amount": 150.00,
      "net_amount": 850.00,
      "currency": "USD",
      "status": "completed",
      "payment_method": "card",
      "payment_provider": "stripe",
      "payment_intent_id": "pi_stripe_123abc",
      "transaction_reference": "TXN-20260304-A1B2C3D4",
      "payment_due_date": "2026-03-12",
      "payment_completed_at": "2026-03-10T14:30:00Z",
      "created_at": "2026-03-05T12:00:00Z",
      "metadata": {
        "listing_title": "Beach Villa",
        "check_in_date": "2026-03-01",
        "check_out_date": "2026-03-05"
      }
    }
  }
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination limit max is 100 items per page
- Soft-deleted resources are excluded from queries
- User passwords are never returned in responses
- Profile pictures and documents must be pre-uploaded to S3/CDN
- Price values must be between 0.01 and 10,000
- Coordinates must be valid latitude/longitude values
- Booking prices automatically calculated (base × nights + cleaning + 3% service fee)
- Availability is checked in real-time to prevent double-booking
- **Platform commission: 15% charged to hosts on confirmed bookings**
- **Commission payment due: 7 days after guest check-out**
- **Transaction references: Unique format TXN-YYYYMMDD-XXXXXXXX**
