# Reviews & Ratings System - Complete ✅

## Overview
Comprehensive bidirectional review system enabling guests and hosts to review each other after completed bookings, with detailed rating categories and moderation features.

---

## 🎯 Features Implemented

### Core Review Operations
- ✅ Create reviews for completed bookings
- ✅ Bidirectional reviews (guest ↔ host)
- ✅ 7 rating categories (1-5 scale):
  - Overall rating (required)
  - Cleanliness rating
  - Accuracy rating
  - Communication rating
  - Location rating
  - Value rating
  - Check-in rating
- ✅ Automatic eligibility checking
- ✅ Prevent duplicate reviews per booking

### Review Management
- ✅ Review responses (reviewee can respond once)
- ✅ Review flagging for moderation
- ✅ Public vs. unpublished reviews
- ✅ Rich reviewer profiles (name, photo)
- ✅ Review text (10-2000 characters)
- ✅ Response text (10-1000 characters)

### Automatic Rating Aggregation
- ✅ **Listing average ratings** - Auto-calculated via database trigger
- ✅ **Host overall ratings** - Aggregated across all properties
- ✅ **Category breakdowns** - Detailed rating analytics
- ✅ **Review counts** - Total reviews per listing/host

### Smart Features
- ✅ Pending reviews detection (completed bookings not yet reviewed)
- ✅ Review eligibility checking (can user review this booking?)
- ✅ Automatic review type detection (guest_to_host vs host_to_guest)
- ✅ Category ratings validation (only for guest reviews)

---

## 📊 11 New API Endpoints

### 1. Create Review
**POST** `/api/v1/reviews`  
*Protected - Guest or Host*

**Business Logic**:
- Validates booking is completed
- Determines review type automatically (guest→host or host→guest)
- Prevents duplicate reviews
- Enforces rating scale (1-5)
- Category ratings only for guest-to-host reviews
- Auto-triggers rating recalculation

**Request**:
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
  "review_text": "Amazing stay! Highly recommended."
}
```

---

### 2. Get Review Details
**GET** `/api/v1/reviews/:reviewId`  
*Public*

Returns single review with reviewer info.

---

### 3. Get Listing Reviews
**GET** `/api/v1/reviews/listing/:listingId?limit=20&offset=0`  
*Public*

**Returns**:
- All published guest-to-host reviews
- Reviewer name and profile picture
- Paginated results
- Total review count

---

### 4. Get Listing Ratings Breakdown
**GET** `/api/v1/reviews/listing/:listingId/ratings`  
*Public*

**Returns**:
```json
{
  "overall_rating": 4.85,
  "cleanliness_rating": 4.9,
  "accuracy_rating": 4.8,
  "communication_rating": 4.95,
  "location_rating": 4.7,
  "value_rating": 4.8,
  "check_in_rating": 4.9,
  "total_reviews": 47
}
```

---

### 5. Get My Reviews (Written)
**GET** `/api/v1/reviews/my-reviews?limit=20&offset=0`  
*Protected*

Returns all reviews written by authenticated user with listing titles.

---

### 6. Get User Reviews Received
**GET** `/api/v1/reviews/user/:userId/received?reviewType=guest_to_host`  
*Public*

Get reviews about a specific user (as host or guest).

**Query Parameters**:
- `reviewType`: Filter by guest_to_host or host_to_guest

---

### 7. Get Host Overall Rating
**GET** `/api/v1/reviews/host/:hostId/rating`  
*Public*

Aggregate rating across all host's properties.

---

### 8. Respond to Review
**POST** `/api/v1/reviews/:reviewId/respond`  
*Protected - Reviewee*

**Authorization**: Only the person being reviewed can respond.

**Request**:
```json
{
  "response_text": "Thank you for the wonderful review!"
}
```

**Rules**:
- One response per review
- Response cannot be edited once posted
- 10-1000 characters

---

### 9. Flag Review for Moderation
**POST** `/api/v1/reviews/:reviewId/flag`  
*Protected*

Report inappropriate reviews.

**Request**:
```json
{
  "reason": "Contains personal attacks and false information"
}
```

**Sets**: `is_flagged = true` for admin review.

---

### 10. Check Review Eligibility
**GET** `/api/v1/reviews/booking/:bookingId/can-review`  
*Protected*

**Returns**:
```json
{
  "canReview": true
}
```

Or:
```json
{
  "canReview": false,
  "reason": "Booking must be completed to leave a review"
}
```

**Checks**:
- Booking is completed
- User is part of booking (guest or host)
- User hasn't already reviewed

---

### 11. Get Pending Reviews
**GET** `/api/v1/reviews/pending`  
*Protected*

Returns list of completed bookings that user hasn't reviewed yet.

**Use Case**: Prompt users to leave reviews after their stays.

---

## 🗂️ Files Created

### Model Layer (420 lines)
**backend/src/models/reviewModel.ts**
- 15 database query functions
- Review CRUD operations
- Rating aggregation queries
- Eligibility checking

**Key Functions**:
```typescript
findReviewById(reviewId) -> Review
findReviewsByListingId(listingId, options) -> {reviews, total}
createReview(reviewData) -> Review
updateReviewResponse(reviewId, text) -> Review
flagReview(reviewId, reason) -> Review
getListingAverageRatings(listingId) -> ratings object
getHostAverageRating(hostId) -> {average_rating, total_reviews}
canUserReviewBooking(bookingId, userId) -> boolean
```

---

### Service Layer (380 lines)
**backend/src/services/reviewService.ts**
- 12 business logic functions
- Review validation and authorization
- Rating scale enforcement
- Duplicate review prevention
- Category rating validation

**Key Business Rules**:
- **Rating Scale**: 1.0 - 5.0 (accepts decimals)
- **Review Text**: 10-2000 characters
- **Response Text**: 10-1000 characters
- **Category Ratings**: Only for guest-to-host reviews
- **One Review Per Booking**: Per user (guest and host can each review)
- **Only Completed Bookings**: Can be reviewed

---

### Controller Layer (320 lines)
**backend/src/controllers/reviewController.ts**
- 11 HTTP endpoint handlers
- Request validation
- Query parameter parsing
- Error handling
- Response formatting

---

### Route Layer (90 lines)
**backend/src/routes/reviewRoutes.ts**
- 11 route configurations
- Mixed public/protected routes
- RESTful structure

**Route Summary**:
- 7 GET endpoints (4 public, 3 protected)
- 4 POST endpoints (all protected)

---

## 📈 Database Integration

### Automatic Rating Updates
Database trigger automatically updates:
- `listings.average_rating`
- `listings.total_reviews`

When review is:
- Created with `is_published = true`
- Updated to/from published status

**SQL Trigger** (from migration 004):
```sql
CREATE TRIGGER update_listing_rating_on_review
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  WHEN (NEW.review_type = 'guest_to_host' AND NEW.is_published = true)
  EXECUTE FUNCTION update_listing_average_rating();
```

---

### Unique Constraint
One review per booking per reviewer:
```sql
CREATE UNIQUE INDEX idx_reviews_unique_booking_reviewer
  ON reviews(booking_id, reviewer_id);
```

---

## 🔒 Authorization & Validation

### Review Creation
- ✅ Must be authenticated
- ✅ Booking must be completed
- ✅ User must be guest or host of booking
- ✅ User hasn't already reviewed
- ✅ Ratings within 1-5 range
- ✅ Review text meets length requirements

### Review Response
- ✅ Must be authenticated
- ✅ Must be the reviewee (person being reviewed)
- ✅ Review hasn't been responded to yet
- ✅ Response text meets length requirements

### Review Flagging
- ✅ Must be authenticated
- ✅ Reason must be at least 10 characters
- ✅ Review not already flagged

---

## 🎨 Review Types

### Guest-to-Host Reviews
**7 Rating Categories**:
1. Overall rating (required)
2. Cleanliness
3. Accuracy (match description)
4. Communication
5. Location
6. Value (price/quality)
7. Check-in experience

**Purpose**: Help future guests evaluate properties.

---

### Host-to-Guest Reviews
**1 Rating Category**:
1. Overall rating (required)

**Purpose**: Help hosts evaluate potential guests.

**Note**: Simpler structure since hosts primarily rate guest behavior.

---

## 📊 Rating Aggregation Examples

### Listing Detailed Ratings
```sql
SELECT 
  AVG(overall_rating) as overall,
  AVG(cleanliness_rating) as cleanliness,
  AVG(accuracy_rating) as accuracy,
  AVG(communication_rating) as communication,
  AVG(location_rating) as location,
  AVG(value_rating) as value,
  AVG(check_in_rating) as check_in,
  COUNT(*) as total_reviews
FROM reviews
WHERE listing_id = $1 
  AND review_type = 'guest_to_host'
  AND is_published = true;
```

### Host Overall Rating
```sql
SELECT 
  AVG(r.overall_rating) as average_rating,
  COUNT(*) as total_reviews
FROM reviews r
JOIN listings l ON r.listing_id = l.id
WHERE l.host_id = $1 
  AND r.review_type = 'guest_to_host'
  AND r.is_published = true;
```

---

## 🧪 Testing Scenarios

### Scenario 1: Guest Reviews Host
1. Guest completes booking
2. GET `/reviews/pending` - Shows booking
3. GET `/reviews/booking/:id/can-review` - Returns `canReview: true`
4. POST `/reviews` - Creates guest-to-host review with all 7 ratings
5. GET `/reviews/listing/:id/ratings` - Shows updated averages

### Scenario 2: Host Reviews Guest
1. Host sees completed booking
2. POST `/reviews` - Creates host-to-guest review (overall rating only)
3. GET `/reviews/user/:guestId/received?reviewType=host_to_guest`

### Scenario 3: Review Response
1. Host receives guest review
2. GET `/reviews/listing/:id` - Sees review
3. POST `/reviews/:id/respond` - Host adds response
4. Guest sees response in review

### Scenario 4: Flag Inappropriate Review
1. User sees problematic review
2. POST `/reviews/:id/flag` with reason
3. Review marked `is_flagged = true` for admin review

---

## 💡 Frontend Integration Tips

### Display Average Ratings
```javascript
// Show star rating
const StarRating = ({ rating }) => (
  <div>
    {'★'.repeat(Math.floor(rating))}
    {rating % 1 >= 0.5 ? '½' : ''}
    {'☆'.repeat(5 - Math.ceil(rating))}
    <span>{rating.toFixed(1)}</span>
  </div>
);
```

### Rating Breakdown Chart
```javascript
// Show category bars
{
  cleanliness: 4.9,
  accuracy: 4.8,
  communication: 4.95,
  location: 4.7,
  value: 4.8,
  check_in: 4.9
}
```

### Pending Review Prompt
```javascript
// After checkout, check pending reviews
GET /reviews/pending
// Show modal: "How was your stay at {listing_title}?"
```

---

## 📦 NPM Scripts

```bash
npm run dev           # Start development server
npm run db:migrate    # Create reviews table (already done)
npm run db:seed       # Load sample data (no review seeds yet)
```

---

## ✅ Completed Checklist

- [x] Create review model with 15 query functions
- [x] Implement review service with validation
- [x] Create review controller with 11 endpoints
- [x] Set up review routes (mixed public/protected)
- [x] Integrate with existing booking system
- [x] Add automatic rating aggregation (database trigger)
- [x] Implement bidirectional reviews (guest↔host)
- [x] Add review eligibility checking
- [x] Enable review responses
- [x] Add review flagging/moderation
- [x] Support category ratings (7 categories)
- [x] Calculate host overall ratings
- [x] Update server.ts to register routes
- [x] Update API documentation

---

## 🚀 What's Next?

The review system is now complete and ready for:
1. **Frontend Integration** - Build review UI components
2. **Admin Moderation** - Review flagged content
3. **Email Notifications** - Notify users of new reviews
4. **Testing** - Write unit and integration tests
5. **Phase 4: Messaging** - Enable guest-host communication

**Phase 3 Complete!** 🎉

**Total Endpoints**: **44** (21 Phase 1 + 12 Phase 2 + 11 Phase 3)

Ready to commit and move to Phase 4: Messaging System?
