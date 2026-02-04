# Nestiva Backend - Testing Guide

**Status**: All 76 endpoints ready for testing  
**Backend Location**: `d:\nestiva\backend`  
**Git Commits**: 4 complete phases committed

---

## Quick Start Testing

### Prerequisites
1. Supabase PostgreSQL setup with connection string
2. `.env` file with JWT_SECRET and DATABASE_URL
3. Dependencies installed: `npm install`

### Setup Commands
```bash
cd d:\nestiva\backend

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed test data
npm run db:seed

# Start development server
npm run dev
```

### Verify Server Running
```bash
# Should return { "status": "ok" }
curl http://localhost:3000/health
```

---

## Testing by Feature

### 1. Currency Endpoints (Public - No Auth)

**Get currency for country**
```bash
curl http://localhost:3000/api/v1/currencies/country/US
curl http://localhost:3000/api/v1/currencies/country/GB
curl http://localhost:3000/api/v1/currencies/country/JP
```

**Get currency symbol**
```bash
curl http://localhost:3000/api/v1/currencies/USD/symbol
curl http://localhost:3000/api/v1/currencies/EUR/symbol
```

**Convert currency**
```bash
curl -X POST http://localhost:3000/api/v1/currencies/convert \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "from": "USD", "to": "EUR"}'
```

**Get exchange rate**
```bash
curl "http://localhost:3000/api/v1/currencies/exchange-rate?from=USD&to=GBP"
```

---

### 2. Location Search Endpoints (Public - No Auth)

**Find nearby listings**
```bash
curl "http://localhost:3000/api/v1/listings/search/nearby?latitude=40.7128&longitude=-74.0060&radius=10&limit=20"
```

**Map viewport search**
```bash
# South, West, North, East bounds
curl "http://localhost:3000/api/v1/listings/search/map?bounds=40.7,−74.1,40.8,−73.9&limit=20"
```

**Search by city**
```bash
curl "http://localhost:3000/api/v1/listings/search/city/New%20York?country=US"
```

**Calculate distance**
```bash
curl -X POST http://localhost:3000/api/v1/listings/search/distance \
  -H "Content-Type: application/json" \
  -d '{
    "lat1": 40.7128,
    "lon1": -74.0060,
    "lat2": 34.0522,
    "lon2": -118.2437
  }'
```

---

### 3. Authentication Endpoints (Public)

**Register user**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "guest",
    "country": "US"
  }'
```

**Login user**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "test@example.com",
      "first_name": "John",
      "user_type": "guest"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400
  }
}
```

---

### 4. Protected Endpoints (Require JWT Token)

**Get user profile**
```bash
# Replace TOKEN with actual JWT from login response
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/v1/users/profile
```

**Update profile**
```bash
curl -X PUT http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "bio": "Travel enthusiast",
    "phone": "+1234567890"
  }'
```

---

### 5. Listing Endpoints

**Create listing (host)**
```bash
curl -X POST http://localhost:3000/api/v1/listings \
  -H "Authorization: Bearer HOST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cozy NYC Apartment",
    "description": "Beautiful 2-bedroom in Manhattan",
    "property_type": "apartment",
    "bedrooms": 2,
    "bathrooms": 1,
    "max_guests": 4,
    "price_per_night": 150,
    "address": "123 Main St",
    "city": "New York",
    "country": "US",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "amenities": ["WiFi", "Kitchen", "Laundry"],
    "rules": ["No smoking", "No pets"]
  }'
```

**Get all listings**
```bash
curl "http://localhost:3000/api/v1/listings?page=1&limit=20"
```

**Get listing details**
```bash
curl http://localhost:3000/api/v1/listings/LISTING_ID
```

---

### 6. Booking Endpoints

**Create booking (guest)**
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Authorization: Bearer GUEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listing_id": "LISTING_ID",
    "check_in_date": "2026-02-15",
    "check_out_date": "2026-02-20",
    "number_of_guests": 2,
    "guest_notes": "Excited to visit!"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "booking-uuid",
    "listing_id": "listing-uuid",
    "guest_id": "guest-uuid",
    "check_in_date": "2026-02-15",
    "check_out_date": "2026-02-20",
    "number_of_guests": 2,
    "total_price": 750,
    "status": "pending",
    "created_at": "2026-02-04T10:00:00Z"
  }
}
```

**Confirm booking (guest)**
```bash
curl -X POST http://localhost:3000/api/v1/bookings/BOOKING_ID/confirm \
  -H "Authorization: Bearer GUEST_TOKEN"
```

**Accept booking (host)**
```bash
curl -X POST http://localhost:3000/api/v1/bookings/BOOKING_ID/accept \
  -H "Authorization: Bearer HOST_TOKEN"
```

---

### 7. Payment Commission Endpoints

**Get host earnings**
```bash
curl -H "Authorization: Bearer HOST_TOKEN" \
  http://localhost:3000/api/v1/payments/earnings
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "gross_earnings": 5000.00,
    "total_commissions": 750.00,
    "net_earnings": 4250.00,
    "pending_commissions": 225.00,
    "commission_rate": 0.15,
    "transaction_count": 10,
    "pending_count": 3
  }
}
```

**Get pending commissions**
```bash
curl -H "Authorization: Bearer HOST_TOKEN" \
  http://localhost:3000/api/v1/payments/earnings/pending
```

**Calculate commission preview**
```bash
curl -X POST http://localhost:3000/api/v1/payments/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000}'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "original_amount": 1000,
    "commission_rate": 0.15,
    "commission_amount": 150,
    "net_amount": 850
  }
}
```

---

### 8. Messaging Endpoints

**Start/get conversation**
```bash
curl -X POST http://localhost:3000/api/v1/messages/conversations \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "other_user_id": "OTHER_USER_ID",
    "listing_id": "LISTING_ID"
  }'
```

**Send message**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "CONVERSATION_ID",
    "content": "Hi! Is the apartment still available?",
    "message_type": "text"
  }'
```

**Get conversation messages**
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/messages/conversations/CONVERSATION_ID/messages?limit=20"
```

**Mark message as read**
```bash
curl -X PATCH http://localhost:3000/api/v1/messages/MESSAGE_ID/read \
  -H "Authorization: Bearer TOKEN"
```

**Get unread count**
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/v1/messages/unread-count
```

---

### 9. Review Endpoints

**Create review (after booking complete)**
```bash
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": "BOOKING_ID",
    "rating": 5,
    "comment": "Amazing place! Very clean and welcoming.",
    "is_anonymous": false
  }'
```

**Get reviews for listing**
```bash
curl http://localhost:3000/api/v1/reviews/listing/LISTING_ID
```

**Get reviews about user**
```bash
curl http://localhost:3000/api/v1/reviews/user/USER_ID
```

---

## Testing Workflow

### 1. Test Public Endpoints First
- [ ] Currency endpoints
- [ ] Location search endpoints
- [ ] Auth endpoints (register/login)

### 2. Create Test Data
- [ ] Register guest account
- [ ] Register host account
- [ ] Create listing as host
- [ ] Get listings and verify currency is auto-set

### 3. Test Location Features
- [ ] Search nearby listings
- [ ] Search by city
- [ ] Verify distance calculations

### 4. Test Bookings
- [ ] Create booking as guest
- [ ] Verify commission auto-created
- [ ] Confirm booking
- [ ] Accept booking as host
- [ ] Check commission in earnings

### 5. Test Messaging
- [ ] Start conversation
- [ ] Send message
- [ ] Mark as read
- [ ] Verify unread count

### 6. Test Payments
- [ ] Check host earnings
- [ ] Verify commission amount (15% of booking)
- [ ] Get pending commissions

---

## Troubleshooting

### Database Connection Error
```
Error: ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Check DATABASE_URL in .env, verify Supabase connection

### JWT Token Invalid
```
Error: Invalid token
```
**Solution**: Ensure JWT_SECRET matches in .env

### 404 Endpoints Not Found
```
Error: Cannot POST /api/v1/listings
```
**Solution**: Verify routes are registered in server.ts

### Disk Space Error
```
npm ERR! ENOSPC: no space left on device
```
**Solution**: Clear disk space or use `npm cache clean --force`

---

## Expected Response Format

All endpoints follow this format:

```json
{
  "success": true,
  "data": {
    // endpoint-specific data
  },
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "error": "error_code",
  "message": "Human readable error message",
  "details": {}
}
```

---

## Performance Testing

### Load test currency conversion
```bash
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/v1/currencies/convert \
    -H "Content-Type: application/json" \
    -d '{"amount": 100, "from": "USD", "to": "EUR"}' &
done
```

### Load test location search
```bash
for i in {1..100}; do
  curl "http://localhost:3000/api/v1/listings/search/nearby?latitude=40.7128&longitude=-74.0060&radius=10" &
done
```

---

## Success Criteria ✅

All endpoints should:
- [ ] Return 200-201 status for successful requests
- [ ] Return 400-401-403-404 for appropriate errors
- [ ] Include proper CORS headers
- [ ] Include rate limiting headers
- [ ] Support pagination where applicable
- [ ] Include timestamps in responses
- [ ] Properly validate request data

---

**Next Step**: Once system has sufficient disk space, run `npm install` and follow the Setup Commands above to test all features.

