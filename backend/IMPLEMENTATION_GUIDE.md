# Backend Implementation Guide

## Overview
This document provides guidance on the backend implementation completed so far and next steps for completing the full Nestiva platform backend.

---

## ✅ Completed: Phase 1 - Core Infrastructure

### 1. Utility Functions (4 files)
- **jwt.ts** - JWT token generation, verification, and decoding
  - `generateAccessToken()` - Creates 15-minute access tokens
  - `generateRefreshToken()` - Creates 7-day refresh tokens
  - `verifyAccessToken()` - Validates and extracts JWT payload
  - `verifyRefreshToken()` - Validates refresh tokens

- **password.ts** - Password security functions
  - `hashPassword()` - Bcrypt password hashing with salt rounds
  - `comparePassword()` - Verify password against hash
  - `validatePasswordStrength()` - Enforce security requirements (8+ chars, uppercase, lowercase, number, special char)

- **validators.ts** - Input validation functions
  - `isValidEmail()` - Email format validation
  - `isValidPhoneNumber()` - International phone validation
  - `isValidUUID()` - UUID format validation
  - `isValidPrice()` - Price range validation ($0-$10,000)
  - `isValidCoordinates()` - Latitude/longitude validation
  - `isValidDateRange()` - Check-in/check-out validation
  - `validatePagination()` - Enforce pagination limits (max 100 per page)

- **errors.ts** - Centralized error handling
  - Custom error classes: `ApiError`, `ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `ConflictError`, `UnprocessableEntityError`, `InternalServerError`
  - `createSuccessResponse()` - Standardized success response format
  - `createErrorResponse()` - Standardized error response format

### 2. Database Models (2 files)
- **userModel.ts** - User-related database operations
  - CRUD operations: `findUserByEmail()`, `findUserById()`, `createUser()`, `updateUserProfile()`, `softDeleteUser()`
  - Verification: `updateVerificationStatus()`, `updateVerificationDocument()`
  - Metrics: `updateResponseMetrics()`, `getUserTrustStats()`
  - Search: `searchUsers()` with full-text search

- **listingModel.ts** - Listing-related database operations
  - CRUD operations: `findListingById()`, `findListingsByHostId()`, `createListing()`, `updateListing()`, `softDeleteListing()`
  - Publishing: `togglePublishListing()`
  - Engagement: `incrementViewCount()`, `getStats()`
  - Search: `searchListings()` with multi-field filtering, date availability checking, price ranges

### 3. Services (3 files)
- **authService.ts** - Authentication business logic
  - `registerUser()` - User registration with validation and password hashing
  - `loginUser()` - Login with email/password verification
  - `sendPhoneVerificationCode()` - SMS verification code generation
  - `verifyPhoneCode()` - Phone number verification
  - `uploadVerificationDocument()` - ID document handling
  - `verifyTokenAndGetUser()` - JWT token verification

- **userService.ts** - User profile management
  - `getUserProfile()` - Get user private profile
  - `getUserPublicProfile()` - Get user public profile (excludes sensitive data)
  - `updateProfile()` - Profile field updates
  - `updateProfilePicture()` - Profile picture management
  - `getUserReputation()` - Trust score and review stats
  - `searchUsers()` - Full-text user search
  - Placeholder functions: `getUserListingCount()`, `getUserBookingCount()`, `getUserFollowersCount()`

- **listingService.ts** - Listing management
  - `createNewListing()` - Create listing with validation
  - `getListing()` - Retrieve single listing
  - `getHostListings()` - List host's properties with pagination
  - `updateListingDetails()` - Update listing fields
  - `publishListing()` - Publish listing for public visibility
  - `unpublishListing()` - Unpublish listing
  - `searchAndFilterListings()` - Advanced search with filters
  - `deleteListing()` - Soft delete listing
  - `getListingStats()` - View count, review count, rating stats

### 4. Controllers (3 files)
- **authController.ts** - Auth endpoint handlers
  - `register()` - POST /auth/register
  - `login()` - POST /auth/login
  - `sendPhoneCode()` - POST /auth/send-verification-code
  - `verifyPhone()` - POST /auth/verify-phone
  - `uploadDocument()` - POST /auth/upload-verification-document
  - `logout()` - POST /auth/logout

- **userController.ts** - User endpoint handlers
  - `getMe()` - GET /users/me
  - `getUser()` - GET /users/{userId}
  - `updateMe()` - PUT /users/me
  - `uploadProfilePicture()` - POST /users/me/profile-picture
  - `getReputation()` - GET /users/{userId}/reputation
  - `getUserReviews()` - GET /users/{userId}/reviews (placeholder)
  - `searchUsers()` - GET /users/search

- **listingController.ts** - Listing endpoint handlers
  - `createListing()` - POST /listings
  - `getListing_()` - GET /listings/{listingId}
  - `getMyListings()` - GET /listings/my-listings
  - `updateListing()` - PUT /listings/{listingId}
  - `publishListing_()` - POST /listings/{listingId}/publish
  - `unpublishListing_()` - POST /listings/{listingId}/unpublish
  - `searchListings()` - GET /listings/search
  - `deleteListing_()` - DELETE /listings/{listingId}
  - `getStats()` - GET /listings/{listingId}/stats

### 5. Routes (3 files)
- **authRoutes.ts** - Auth endpoints
- **userRoutes.ts** - User endpoints
- **listingRoutes.ts** - Listing endpoints

### 6. Middleware (1 file)
- **auth.ts** - Authentication middleware
  - `requireAuthMiddleware()` - Enforce authentication (401 if missing)
  - `optionalAuthMiddleware()` - Allow unauthenticated access

---

## 📊 API Endpoints Implemented

### Auth (6 endpoints)
- ✅ POST /api/v1/auth/register
- ✅ POST /api/v1/auth/login
- ✅ POST /api/v1/auth/send-verification-code
- ✅ POST /api/v1/auth/verify-phone
- ✅ POST /api/v1/auth/upload-verification-document
- ✅ POST /api/v1/auth/logout

### Users (6 endpoints)
- ✅ GET /api/v1/users/me
- ✅ PUT /api/v1/users/me
- ✅ POST /api/v1/users/me/profile-picture
- ✅ GET /api/v1/users/{userId}
- ✅ GET /api/v1/users/{userId}/reputation
- ✅ GET /api/v1/users/search

### Listings (9 endpoints)
- ✅ POST /api/v1/listings
- ✅ GET /api/v1/listings/my-listings
- ✅ GET /api/v1/listings/search
- ✅ GET /api/v1/listings/{listingId}
- ✅ PUT /api/v1/listings/{listingId}
- ✅ POST /api/v1/listings/{listingId}/publish
- ✅ POST /api/v1/listings/{listingId}/unpublish
- ✅ GET /api/v1/listings/{listingId}/stats
- ✅ DELETE /api/v1/listings/{listingId}

### Total: 21 endpoints implemented

---

## 🔄 Next Steps: Phase 2 - Remaining Services

### Priority 1: Booking Management (Weeks 1-2)
- Create `bookingModel.ts`:
  - CRUD operations
  - Status transitions (pending → confirmed → checked-in → completed)
  - Availability checking
  - Price calculation with discounts

- Create `bookingService.ts`:
  - `createBooking()` - Create booking with availability check
  - `confirmBooking()` - Host confirmation
  - `rejectBooking()` - Host rejection
  - `cancelBooking()` - Cancellation with refund logic
  - `checkInBooking()` - Mark as checked-in
  - `checkOutBooking()` - Mark as completed
  - `getBookingDetails()` - Retrieve single booking
  - `getGuestBookings()` - Guest's booking history
  - `getHostBookings()` - Host's bookings to manage

- Create `bookingController.ts` with 10 endpoints
- Create `bookingRoutes.ts`

### Priority 2: Reviews & Ratings (Weeks 2-3)
- Create `reviewModel.ts`:
  - CRUD operations
  - Rating aggregations
  - AI-summary fields (highlights, concerns)
  - Helpful vote tracking

- Create `reviewService.ts`:
  - `createReview()` - Post review after checkout
  - `getListingReviews()` - Get all reviews for listing
  - `getUserReviews()` - Get all reviews about user
  - `replyToReview()` - Host/guest reply
  - `markHelpful()` - Helpful vote tracking
  - `calculateAverageRating()` - Aggregate ratings

- Create `reviewController.ts` with 5 endpoints
- Create `reviewRoutes.ts`

### Priority 3: Messaging (Weeks 3-4)
- Create `messageModel.ts`:
  - CRUD operations
  - Conversation threading
  - Read status tracking

- Create `messageService.ts`:
  - `sendMessage()` - Send message to user
  - `getConversation()` - Get message thread
  - `markAsRead()` - Update read status
  - `getInbox()` - Get all conversations
  - Integrate Socket.io for real-time messaging

- Create `messageController.ts` with 4 endpoints
- Create `messageRoutes.ts`

### Priority 4: Payments (Weeks 4-5)
- Create `paymentModel.ts`:
  - Transaction records
  - Payout tracking

- Create `paymentService.ts`:
  - Integrate with Stripe API
  - `createPaymentIntent()` - Initiate payment
  - `confirmPayment()` - Process payment
  - `createPayout()` - Host payouts
  - Webhook handling for payment events

- Create `paymentController.ts` with 3 endpoints
- Create `paymentRoutes.ts`

### Priority 5: Additional Features (Weeks 5-6)
- Calendar availability management
- Coupon/discount system
- Notifications system
- Analytics tracking
- Favorites/saved listings

---

## 🗂️ Current File Structure

```
backend/src/
├── utils/
│   ├── jwt.ts ✅
│   ├── password.ts ✅
│   ├── validators.ts ✅
│   └── errors.ts ✅
├── models/
│   ├── userModel.ts ✅
│   ├── listingModel.ts ✅
│   ├── bookingModel.ts ⏳ (TODO)
│   ├── reviewModel.ts ⏳ (TODO)
│   ├── messageModel.ts ⏳ (TODO)
│   └── paymentModel.ts ⏳ (TODO)
├── services/
│   ├── authService.ts ✅
│   ├── userService.ts ✅
│   ├── listingService.ts ✅
│   ├── bookingService.ts ⏳ (TODO)
│   ├── reviewService.ts ⏳ (TODO)
│   ├── messageService.ts ⏳ (TODO)
│   └── paymentService.ts ⏳ (TODO)
├── controllers/
│   ├── authController.ts ✅
│   ├── userController.ts ✅
│   ├── listingController.ts ✅
│   ├── bookingController.ts ⏳ (TODO)
│   ├── reviewController.ts ⏳ (TODO)
│   ├── messageController.ts ⏳ (TODO)
│   └── paymentController.ts ⏳ (TODO)
├── routes/
│   ├── authRoutes.ts ✅
│   ├── userRoutes.ts ✅
│   ├── listingRoutes.ts ✅
│   ├── bookingRoutes.ts ⏳ (TODO)
│   ├── reviewRoutes.ts ⏳ (TODO)
│   ├── messageRoutes.ts ⏳ (TODO)
│   └── paymentRoutes.ts ⏳ (TODO)
├── middleware/
│   └── auth.ts ✅
├── config/
│   └── database.ts ✅
├── types/
│   └── index.ts ✅
└── server.ts ✅
```

---

## 🧪 Testing the Implementation

### 1. Start the server
```bash
npm run dev
# or
NODE_ENV=development node -r ts-node/register src/server.ts
```

### 2. Test Auth Endpoints
```bash
# Register
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "guest"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Test Protected Endpoints
```bash
# Use token from login response
TOKEN="your_jwt_token"

# Get user profile
curl -X GET http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"

# Update profile
curl -X PUT http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "bio": "Travel enthusiast"
  }'
```

### 4. Test Listing Endpoints
```bash
# Create listing
curl -X POST http://localhost:3001/api/v1/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cozy Studio in NYC",
    "description": "Beautiful studio apartment in Manhattan with modern amenities...",
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
    "amenities": ["wifi", "kitchen", "ac"],
    "house_rules": ["no smoking"],
    "cancellation_policy": "moderate",
    "base_price": 150,
    "currency": "USD",
    "cleaning_fee": 25,
    "service_fee_percentage": 3
  }'

# Search listings
curl -X GET "http://localhost:3001/api/v1/listings/search?city=New%20York&min_price=100&max_price=200"
```

---

## 📝 Key Architecture Decisions

1. **Service Layer Pattern** - Business logic separated from HTTP handling
2. **Model Layer** - All database queries encapsulated in model files
3. **Error Handling** - Custom error classes with consistent response format
4. **Input Validation** - Validation at service layer before database operations
5. **Soft Deletes** - Data retention via `deleted_at` timestamp
6. **JWT Authentication** - Stateless auth with 15m access + 7d refresh tokens
7. **Pagination** - Limit 100 items max per request
8. **Response Format** - Consistent `{ success, data, error, meta }` structure

---

## 🔐 Security Considerations

✅ **Implemented:**
- Password hashing with bcrypt (10 salt rounds)
- JWT token verification on protected routes
- Rate limiting (100 req per 15 min)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Soft delete protection (deleted_at checks)

⏳ **TODO:**
- Rate limiting per user (not just IP)
- Request ID tracking for auditing
- SQL injection prevention testing
- XSS attack prevention
- CSRF token implementation
- API key management for external services

---

## 🚀 Performance Optimization

✅ **Implemented:**
- Database connection pooling
- Pagination to prevent large result sets
- JSONB indexing ready for PostgreSQL

⏳ **TODO:**
- Query result caching with Redis
- N+1 query prevention (batch loading)
- Database query optimization
- CDN for static assets
- API response compression

---

## 📚 Database Integration Notes

All models interact with PostgreSQL through the connection pool in `config/database.ts`.

Key database functions patterns:
- All queries use parameterized queries ($1, $2, etc.) for SQL injection prevention
- Soft deletes via `deleted_at IS NULL` checks
- JSONB fields for flexible data (amenities, house_rules)
- Foreign key constraints for referential integrity
- Timestamps (created_at, updated_at) on all tables

---

## Next Command to Run

To implement Priority 1 (Booking Management), request:
"Continue backend implementation - create booking service, model, and controller"

This will generate ~1500 lines of production-ready booking management code following the same patterns established in Phase 1.
