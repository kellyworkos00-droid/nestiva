# Database Setup & Migrations - Complete ✅

## 📊 What's Been Created

### 5 Migration Files (Database Schema)
All migration files are production-ready SQL with:
- Complete table definitions
- Indexes for performance optimization
- Triggers for automatic timestamp updates
- Check constraints for data validation
- Foreign key relationships
- Helper functions for business logic

**Created Tables**:
1. **users** - Authentication and profiles (26 columns)
2. **listings** - Property listings (36 columns)
3. **bookings** - Reservations (25 columns)
4. **reviews** - Rating system (16 columns) *Phase 3*
5. **conversations & messages** - Chat system (12+10 columns) *Phase 4*

### 3 Seed Data Files
Sample data for development and testing:
- **5 test users** - 2 guests, 2 hosts, 1 both (password: `Test123!`)
- **5 property listings** - Various types and price ranges ($65-$550/night)
- **6 bookings** - Different statuses (completed, current, pending, cancelled)

### Configuration Files
- ✅ **`.env.example`** - Complete environment template with Supabase config
- ✅ **`run-migrations.js`** - Automated migration runner
- ✅ **`run-seeds.js`** - Automated seed data loader
- ✅ **`DATABASE_SETUP.md`** - Comprehensive setup guide

### Updated Files
- ✅ **`src/config/database.ts`** - Enhanced with SSL support, connection pooling, health check
- ✅ **`package.json`** - Added npm scripts for database management

---

## 🚀 Quick Start

### 1. Configure Supabase

Create `.env` file in `backend/` folder:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your Supabase details:
```env
# Get these from Supabase Dashboard → Settings → Database
DB_HOST=db.your-project-id.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_SSL=true

# Provided anon key
SUPABASE_ANON_KEY=sb_publishable_715pS8gw9Hne4qmInMpR8A__tUrOQgM
SUPABASE_PROJECT_URL=https://your-project-id.supabase.co

# Generate secure secrets (32+ characters)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

### 2. Run Migrations (Create Tables)

```bash
npm run db:migrate
```

This creates all 5 tables with indexes, triggers, and constraints.

### 3. Seed Sample Data (Optional)

```bash
npm run db:seed
```

Loads 5 users, 5 listings, and 6 bookings for testing.

### 4. Or Do Both at Once

```bash
npm run db:setup
```

---

## 📁 File Structure

```
backend/
├── database/
│   ├── migrations/
│   │   ├── 001_create_users_table.sql       (113 lines)
│   │   ├── 002_create_listings_table.sql    (145 lines)
│   │   ├── 003_create_bookings_table.sql    (142 lines)
│   │   ├── 004_create_reviews_table.sql     (87 lines)
│   │   └── 005_create_messages_table.sql    (109 lines)
│   ├── seeds/
│   │   ├── 001_seed_users.sql               (75 lines)
│   │   ├── 002_seed_listings.sql            (165 lines)
│   │   └── 003_seed_bookings.sql            (125 lines)
│   ├── run-migrations.js                     (56 lines)
│   └── run-seeds.js                          (66 lines)
├── src/
│   └── config/
│       └── database.ts                       (Updated with SSL)
├── .env.example                              (52 lines)
├── DATABASE_SETUP.md                         (550 lines)
└── package.json                              (Updated scripts)
```

**Total**: 1,633 lines of database code + comprehensive documentation

---

## 🗂️ Database Schema Overview

### **users** table
```sql
- id (UUID, primary key)
- email, password_hash
- first_name, last_name, user_type
- phone_number, date_of_birth, bio
- is_superhost, response_rate
- verification fields (email, phone, identity)
- trust_score, account_status
- timestamps (created_at, updated_at, deleted_at)
```

### **listings** table
```sql
- id (UUID, primary key)
- host_id → users(id)
- title, description, property_type, room_type
- address, city, country, latitude, longitude
- max_guests, num_bedrooms, num_beds, num_bathrooms
- price_per_night, cleaning_fee, currency
- minimum_nights, maximum_nights, instant_booking
- cancellation_policy (flexible/moderate/strict/super_strict)
- amenities (JSONB array)
- image_urls (JSONB array)
- average_rating, total_reviews
- timestamps
```

### **bookings** table
```sql
- id (UUID, primary key)
- listing_id → listings(id)
- guest_id, host_id → users(id)
- check_in_date, check_out_date, number_of_nights
- status (pending/confirmed/cancelled/completed)
- booking_stage (awaiting_host/confirmed/checked_in/checked_out)
- base_price, cleaning_fee, service_fee, total_price
- payment_intent_id, payment_status
- guest_message, host_response
- cancellation details (reason, refund_amount)
- timestamps
```

### **reviews** table (Phase 3)
```sql
- id (UUID, primary key)
- booking_id, listing_id, reviewer_id, reviewee_id
- review_type (guest_to_host / host_to_guest)
- overall_rating (1-5)
- category ratings (cleanliness, accuracy, communication, etc.)
- review_text, response_text
- is_published, is_flagged
- timestamps
```

### **conversations & messages** tables (Phase 4)
```sql
conversations:
- id (UUID, primary key)
- listing_id, booking_id
- participant1_id, participant2_id
- last_message_at, last_message_preview

messages:
- id (UUID, primary key)
- conversation_id → conversations(id)
- sender_id → users(id)
- message_text, message_type
- is_read, read_at
- timestamps
```

---

## 🔧 NPM Scripts

```bash
npm run db:migrate    # Run all migrations (create tables)
npm run db:seed       # Load sample data
npm run db:setup      # Run migrations + seeds
npm run dev           # Start development server
```

---

## 📊 Sample Data Summary

### Test Users (Password: `Test123!`)
| Email | Name | Type | Verified | Trust Score |
|-------|------|------|----------|-------------|
| guest1@example.com | Sarah Johnson | guest | ✅ | 85 |
| guest2@example.com | Michael Chen | guest | ❌ | 60 |
| host1@example.com | Emily Rodriguez | host | ✅ ⭐ | 95 (Superhost) |
| host2@example.com | James Wilson | host | ✅ | 78 |
| both@example.com | Alex Martinez | both | ✅ | 90 |

### Sample Listings
1. **Beachfront Villa** - Malibu, $450/night (Emily - Superhost)
2. **Downtown Loft** - Los Angeles, $185/night (Emily)
3. **Mountain Cabin** - Big Bear, $220/night (James)
4. **Private Room** - San Diego, $65/night (Alex)
5. **Luxury Penthouse** - San Francisco, $550/night (James)

### Sample Bookings
- 1 completed (past stay)
- 1 checked-in (current guest)
- 2 confirmed (upcoming)
- 1 pending (awaiting host)
- 1 cancelled (with refund)

---

## ✨ Key Features

### Automatic Availability Checking
```sql
SELECT check_booking_availability(
  listing_id,
  check_in_date,
  check_out_date
); -- Returns true/false
```

### Automatic Rating Updates
When a review is added, triggers automatically update:
- Listing's `average_rating`
- Listing's `total_reviews`

### Timestamp Management
All tables have automatic `updated_at` timestamp updates via triggers.

### Data Validation
- Check constraints prevent invalid data
- Date validation ensures check-out > check-in
- Guest count validation against listing capacity
- Price validation (positive values only)

---

## 🔒 Security Features

- **SSL Connection** - Encrypted database communication
- **Connection Pooling** - Efficient resource usage (max 20 connections)
- **Password Hashing** - bcrypt with salt rounds (in seed data)
- **Foreign Key Constraints** - Referential integrity
- **Soft Deletes** - Users have `deleted_at` field
- **Input Validation** - Check constraints at database level

---

## 📖 Documentation

Complete guide available in [DATABASE_SETUP.md](DATABASE_SETUP.md):
- Supabase project creation
- Environment configuration
- Migration guide
- Seeding instructions
- SQL query examples
- Troubleshooting
- Production deployment checklist

---

## 🎯 Next Steps

1. **Update `.env`** with your Supabase credentials
2. **Run migrations**: `npm run db:migrate`
3. **Load sample data**: `npm run db:seed`
4. **Test connection**: `npm run dev` (should show "✅ Database connected")
5. **Test API endpoints** with sample data
6. **Commit to Git**:
   ```bash
   git add .
   git commit -m "feat: Complete database setup with Supabase"
   git push origin main
   ```

---

## 📈 Statistics

**Database Setup Complete**:
- ✅ 5 migration files (596 lines SQL)
- ✅ 3 seed files (365 lines SQL)
- ✅ 2 runner scripts (122 lines JS)
- ✅ 1 comprehensive guide (550 lines)
- ✅ Updated database config with SSL
- ✅ NPM scripts for easy management

**Total Backend Progress**:
- 33 API endpoints (Phase 1 + Phase 2)
- 5 database tables (3 active, 2 ready for Phase 3/4)
- Complete authentication system
- Booking system with refund logic
- Sample data for testing

Ready for frontend integration! 🚀
