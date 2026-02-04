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
