# Nestiva - User Flows & Journeys

## 1. Guest User Flow: Discover & Book

### Phase 1: Discovery
```
Homepage
  ↓
Search Listings [City, Dates, Guests]
  ↓
Browse Results [Map view, List view, Filters]
  ├─ View Listing Details
  │  ├─ Gallery + 3D Preview
  │  ├─ Host Profile + Reviews
  │  ├─ Amenities & House Rules
  │  └─ Price Breakdown
  ├─ Save to Favorites
  └─ Compare with Similar Listings
```

### Phase 2: Booking
```
Click "Reserve"
  ↓
Login/Sign up [Email, Phone, ID verification]
  ↓
Review Booking Summary
  ├─ Nightly Rate
  ├─ Cleaning Fee
  ├─ Service Fee
  ├─ Discount Code
  └─ Total Price (transparent pricing)
  ↓
Payment [Stripe, Apple Pay, Google Pay]
  ↓
Send Message to Host (optional)
  ↓
Booking Confirmation
  ├─ Email confirmation
  ├─ Add to Calendar
  └─ Host response pending
```

### Phase 3: Trip Management
```
MyTrips Dashboard
  ├─ Upcoming Bookings
  ├─ Check-in Reminders
  ├─ Messages with Host
  ├─ Special Requests
  └─ Early Check-in/Late Checkout Requests
  ↓
Check-in Day
  ├─ Digital Key/Code
  ├─ House Rules Reminder
  └─ Chat with Host in Real-time
  ↓
During Stay
  ├─ Contact Host
  ├─ Request Maintenance
  └─ Rate Experience (optional)
  ↓
Check-out
  ├─ Photos of any issues
  ├─ Fill Maintenance Report
  └─ Automatic refund processing
  ↓
Post-Stay Review
  ├─ Rate Host (1-5 stars)
  ├─ Rating Breakdown [Cleanliness, Communication, Location, Accuracy]
  ├─ Add Photos
  ├─ AI Highlight Summary
  └─ Response to Host (optional)
```

### Phase 4: Community Features
```
Host Profile
  ├─ Follow Host
  ├─ View All Listings
  ├─ See Reviews & Ratings
  ├─ Response Rate & Time
  └─ Superhost Badge
  ↓
Discover Local Experiences
  ├─ Browse Local Guides
  ├─ Watch Host Video Tours
  └─ Join Travel Community
```

---

## 2. Host User Flow: List & Manage

### Phase 1: Listing Creation
```
Dashboard → "Create Listing"
  ↓
Basic Property Info
  ├─ Property Type [Entire home, Room, Shared space]
  ├─ Address [Auto-fill coordinates]
  ├─ Category [Villa, Apartment, Cabin, etc.]
  ├─ Max Guests
  ├─ Bedrooms, Beds, Bathrooms
  └─ Property Highlights
  ↓
Upload Photos
  ├─ Gallery [Multiple angles, rooms]
  ├─ Set Cover Image
  ├─ Organize Display Order
  └─ Add 3D Virtual Tour (optional)
  ↓
Description & Amenities
  ├─ Property Description
  ├─ House Rules [No smoking, Quiet hours, etc.]
  ├─ Amenities [WiFi, Pool, Kitchen, Parking, etc.]
  ├─ Check-in/Check-out Instructions
  └─ Emergency Contacts
  ↓
Pricing Setup
  ├─ Nightly Base Rate
  ├─ Cleaning Fee
  ├─ Service Fee (pre-set)
  ├─ Minimum Night Requirement
  ├─ Cancellation Policy [Flexible, Moderate, Strict]
  └─ Instant Book Enabled? (Yes/No)
  ↓
Calendar Setup
  ├─ Block Dates [Personal use, Maintenance]
  ├─ Seasonal Pricing
  └─ Auto-pricing Strategy
  ↓
Verification & Publishing
  ├─ ID Verification (if not done)
  ├─ Address Verification
  ├─ Insurance Confirmation
  └─ Publish Listing
```

### Phase 2: Booking Management
```
Host Dashboard
  ├─ Pending Bookings
  │  ├─ Guest Profile + Reviews
  │  ├─ Booking Details + Special Requests
  │  ├─ Message from Guest
  │  ├─ "Confirm" or "Decline" Button
  │  └─ Response Time: 24 hours
  │
  ├─ Upcoming Stays
  │  ├─ Check-in Reminders
  │  ├─ Send Digital Key/Code
  │  ├─ Send House Manual (PDF)
  │  └─ Check-in Confirmation
  │
  ├─ Active Stays
  │  ├─ Guest Check-in Status
  │  ├─ Real-time Messages
  │  ├─ Maintenance Requests
  │  └─ Guest Satisfaction Alerts
  │
  └─ Past Bookings
     ├─ Earnings Breakdown
     ├─ Guest Reviews
     ├─ Host Response to Review
     └─ Rebook Interest
```

### Phase 3: Financial Dashboard
```
Analytics & Earnings
  ├─ Total Earnings (MTD, YTD, All-time)
  ├─ Earnings Chart [Revenue Trend]
  ├─ Occupancy Rate
  ├─ Booking Count
  ├─ Average Nightly Rate
  ├─ Revenue Breakdown [Base, Fees, Discounts]
  │
  ├─ Predictive Analytics
  │  ├─ Projected Monthly Income
  │  ├─ Peak Season Insights
  │  ├─ Recommended Price Adjustments
  │  └─ Pricing Suggestions (AI)
  │
  └─ Payouts
     ├─ Available Balance
     ├─ Payout History
     ├─ Connect Bank Account
     └─ Automatic Payout Schedule
```

### Phase 4: Optimization Tools
```
Pricing Optimization
  ├─ Dynamic Pricing Based On:
  │  ├─ Demand & Occupancy
  │  ├─ Seasonality
  │  ├─ Local Events
  │  ├─ Competitor Pricing
  │  └─ Day of Week
  ├─ Set Price Floors/Ceilings
  └─ Apply Promotional Discounts

Calendar Management
  ├─ Sync with Google Calendar
  ├─ Sync with iCal
  ├─ Block Dates Automatically
  └─ Bulk Edit Availability

Reviews & Reputation
  ├─ Review Summary [Highlights & Concerns]
  ├─ Rating Breakdown [Cleanliness, Communication, etc.]
  ├─ AI-Powered Review Analysis
  ├─ Response to Reviews
  └─ Superhost Badge Tracking

Messages
  ├─ Inbox [Organized by Booking]
  ├─ Message Templates
  ├─ Response Time Tracking
  └─ Translation [For International Guests]
```

---

## 3. Guest Booking Decision Flow

```
Landing Page
  ↓
Search [Location, Dates, Guests]
  ↓
Filter Results [Price, Rating, Amenities]
  ↓
View Listing Card
  ├─ Price/Night
  ├─ Rating + Reviews Count
  ├─ Superhost Badge
  └─ "Instant Book" Badge (if enabled)
  ↓
Click Listing → Full Details Page
  ├─ High-Quality Image Gallery
  ├─ 3D Virtual Tour (rotate, zoom)
  ├─ Property Features [Bedrooms, Bathrooms, Amenities]
  ├─ House Rules [Check for compatibility]
  ├─ Host Profile [Reviews, Response Rate, Superhost?]
  ├─ Recent Reviews + Highlights
  ├─ Location Map + Nearby Attractions
  ├─ Cancellation Policy
  ├─ Price Breakdown
  │  ├─ Night × $150 = $1,200
  │  ├─ Cleaning Fee = $75
  │  ├─ Service Fee = $180
  │  ├─ Discount = -$100 (SUMMER20)
  │  └─ Total = $1,355
  └─ "Reserve" or "Message Host"
  ↓
Decision Point:
  ├─ IF Instant Book → Direct Checkout
  │  └─ Payment → Booking Confirmed
  │
  └─ IF Message Host First
     ├─ Ask Questions
     ├─ Wait for Response (24 hours)
     ├─ If Approved → Proceed to Checkout
     └─ If Rejected → Continue Browsing

Post-Booking:
  ├─ Confirmation Email
  ├─ Add to Calendar
  ├─ Save Itinerary
  ├─ Chat with Host
  ├─ Request Special Amenities (Baby Crib, etc.)
  └─ Check-in Instructions at Day-1
```

---

## 4. Map-First Discovery Flow

```
Homepage
  ↓
"Search on Map" Mode
  ├─ Interactive Map [Mapbox]
  ├─ Pins Show:
  │  ├─ Property Type Icon
  │  ├─ Price/Night
  │  ├─ Rating
  │  └─ Availability Status
  │
  ├─ Zoom & Pan Map
  │  └─ Prices Update in Real-time
  │
  ├─ Hover Pin → Property Preview
  │  ├─ Thumbnail Image
  │  ├─ Title
  │  ├─ Price
  │  └─ Rating
  │
  ├─ Click Pin → Quick View Modal
  │  ├─ Image Carousel
  │  ├─ Brief Description
  │  ├─ "View Details" Button
  │  └─ "Reserve" Button
  │
  └─ Filters in Sidebar
     ├─ Price Range Slider
     ├─ Property Type [Apartment, Villa, etc.]
     ├─ Amenities [Pool, WiFi, Parking]
     ├─ Rating Filter
     └─ Instant Book Only
```

---

## 5. AI Recommendation Flow

```
User Profile Built From:
  ├─ Previous Bookings
  ├─ Saved Favorites
  ├─ Search Behavior
  ├─ Reviews Given
  ├─ Travel Preferences (Survey)
  └─ Current Context [Budget, Dates, Group Size]

AI Recommendation Engine:
  ├─ Collaborative Filtering
  │  └─ Similar users → Similar preferences
  ├─ Content-Based Filtering
  │  └─ Property features matching past choices
  ├─ Contextual Filtering
  │  ├─ "Romantic getaway" → Villas with views
  │  ├─ "Family trip" → Properties with kids amenities
  │  └─ "Remote work" → Properties with high-speed WiFi
  ├─ Popularity Ranking
  │  └─ Trending properties in region
  └─ Price Optimization
     └─ Within user's budget with best value

Recommendation Display:
  ├─ Homepage "Recommended For You"
  ├─ Personalized Email Daily/Weekly
  ├─ Notification When Similar Property Listed
  ├─ "You Might Also Like" After Booking
  └─ Push Notification [If Price Drops on Saved Property]
```

---

## 6. Trust & Safety Verification Flow

### Guest Verification
```
Signup
  ↓
Email Verification
  ├─ Confirm email
  ├─ Check for disposable emails
  └─ Send verification link
  ↓
Phone Verification
  ├─ Enter phone number
  ├─ Receive SMS code
  └─ Enter code to confirm
  ↓
Photo ID Verification
  ├─ Capture/Upload ID
  ├─ AI validates:
  │  ├─ ID authenticity
  │  ├─ Document quality
  │  └─ Matches profile name
  ├─ Manual review if flagged
  └─ Approval within 24 hours
  ↓
Trust Score Calculation
  ├─ Email verified: +20 points
  ├─ Phone verified: +15 points
  ├─ ID verified: +30 points
  ├─ Positive reviews: +5 per review
  ├─ Account age: +2 per month
  ├─ Payment methods: +10 each
  └─ Total: 0-100 (Display as badge)
```

### Host Verification
```
ID & Background Check
  ├─ Government ID
  ├─ Background Check [Optional but Recommended]
  ├─ Address Verification
  └─ Property Ownership Verification

Property Verification
  ├─ Host must upload:
  │  ├─ Proof of Ownership/Lease
  │  ├─ Insurance Documentation
  │  └─ Permits/Licenses (if required)
  ├─ AI validates photos:
  │  ├─ Property matches address
  │  ├─ No unsafe conditions
  │  └─ Accurate descriptions
  └─ Manual review if needed

Superhost Badge Criteria
  ├─ 4.8+ average rating
  ├─ Response rate 90%+
  ├─ Response time < 24 hours
  ├─ Cancellation rate < 1%
  ├─ 10+ completed bookings
  └─ No cancellations in last 6 months
```

---

## 7. Review & Rating Flow

### Leaving a Review (Guest)
```
After Checkout (72 hours)
  ↓
Automatic Request: "How was your stay?"
  ├─ Option 1: "Rate Experience"
  └─ Option 2: "Skip for now"
  ↓
If Click "Rate Experience":
  ├─ Overall Rating [1-5 stars]
  │  └─ Star feedback appears
  ├─ Category Ratings
  │  ├─ Cleanliness [1-5]
  │  ├─ Communication [1-5]
  │  ├─ Location [1-5]
  │  └─ Accuracy [1-5]
  ├─ Title [Optional]
  ├─ Comment [Optional]
  ├─ Upload Photos [Optional]
  │  └─ Auto-flagged if inappropriate
  └─ Submit Review
  ↓
AI Processing:
  ├─ Parse text for highlights/concerns
  ├─ Generate summary
  ├─ Detect spam/fake reviews
  ├─ Check for guideline violations
  └─ Publish (public by default)
  ↓
Host Notification:
  ├─ Email notification
  ├─ Alert in dashboard
  ├─ Option to respond
  └─ Response deadline: 14 days
  ↓
Review Display:
  ├─ Show on property listing
  ├─ Show on host profile
  ├─ Feed updates reputation score
  └─ Impact on Superhost status
```

---

## 8. Message & Communication Flow

```
First Contact:
  ├─ Guest Messages Host (pre-booking)
  │  ├─ "Hi, is the place suitable for pets?"
  │  ├─ Host Gets Notification
  │  ├─ Host Has 24 Hours to Respond
  │  └─ Auto-reply if inactive
  │
  ├─ Host Can:
  │  ├─ Approve Booking Request
  │  ├─ Decline Booking Request
  │  └─ Respond to Question
  │
  └─ Guest Sees Status:
     ├─ "Awaiting Host Response"
     ├─ Host's Response Rate
     └─ Average Response Time

During Booking:
  ├─ Booking Message Thread
  ├─ Both parties can message
  ├─ Pin important info
  ├─ Request special amenities
  ├─ Report issues
  └─ Auto-translate languages

Post-Stay:
  ├─ Continue messaging until resolve
  ├─ Report damage claims
  ├─ Follow-up questions
  └─ Archive after 30 days (still visible)

Message Templates (Host):
  ├─ "Welcome" message template
  ├─ "Check-in instructions" template
  ├─ "Check-out" reminder template
  ├─ "Thank you" template
  └─ Custom templates
```

