# Nestiva Database Setup Guide

## 🗄️ Database Architecture

Nestiva uses **Supabase** (PostgreSQL) as the database backend with a complete migration and seeding system.

---

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [Supabase Setup](#supabase-setup)
3. [Local Development Setup](#local-development-setup)
4. [Running Migrations](#running-migrations)
5. [Seeding Data](#seeding-data)
6. [Database Management](#database-management)

---

## Database Schema

### Core Tables

#### **users** - User accounts and profiles
- Authentication credentials
- Profile information (name, bio, profile picture)
- User type: guest, host, or both
- Verification status and trust scores
- Host-specific metrics (response rate, superhost status)

#### **listings** - Property listings
- Property details (title, description, type)
- Location information with geolocation
- Capacity and room configuration
- Pricing (per night, cleaning fee)
- Amenities (stored as JSONB array)
- Images and media
- Booking settings and policies
- Average ratings and review counts

#### **bookings** - Reservations
- Booking dates and guest information
- Status tracking (pending, confirmed, cancelled, completed)
- Booking stage workflow
- Detailed price breakdown
- Payment status
- Host-guest communication
- Cancellation details with refund tracking

#### **reviews** (Phase 3) - Guest and host reviews
- Bidirectional reviews (guest↔host)
- Multiple rating categories (cleanliness, accuracy, communication, etc.)
- Review text and responses
- Rating aggregation for listings

#### **conversations & messages** (Phase 4) - Messaging system
- Conversation threads between users
- Message content with read status
- Support for text, images, and system messages

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: nestiva-production (or nestiva-dev)
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier for development

### 2. Get Connection Details

Once your project is created:

1. Go to **Settings** → **Database**
2. Copy the following:
   - **Host**: `db.your-project-id.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: Your database password

### 3. Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGc...` (provided: `sb_publishable_715pS8gw9Hne4qmInMpR8A__tUrOQgM`)
   - **service_role key**: `eyJhbGc...` (keep this secret!)

---

## Local Development Setup

### 1. Configure Environment Variables

Copy the example environment file:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
# Database Connection
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
DB_HOST=db.your-project-id.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_database_password_here
DB_SSL=true

# Supabase API Keys
SUPABASE_PROJECT_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=sb_publishable_715pS8gw9Hne4qmInMpR8A__tUrOQgM
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

---

## Running Migrations

### What are Migrations?

Migrations create the database schema (tables, indexes, triggers, functions).

### Migration Files

Located in `backend/database/migrations/`:

1. **001_create_users_table.sql** - Users and authentication
2. **002_create_listings_table.sql** - Property listings
3. **003_create_bookings_table.sql** - Booking/reservation system
4. **004_create_reviews_table.sql** - Review system (Phase 3)
5. **005_create_messages_table.sql** - Messaging (Phase 4)

### Run All Migrations

```bash
cd backend/database
node run-migrations.js
```

Expected output:
```
🚀 Starting database migrations...

Found 5 migration files:

📄 Running: 001_create_users_table.sql
✅ Success: 001_create_users_table.sql

📄 Running: 002_create_listings_table.sql
✅ Success: 002_create_listings_table.sql

📄 Running: 003_create_bookings_table.sql
✅ Success: 003_create_bookings_table.sql

📄 Running: 004_create_reviews_table.sql
✅ Success: 004_create_reviews_table.sql

📄 Running: 005_create_messages_table.sql
✅ Success: 005_create_messages_table.sql

🎉 All migrations completed successfully!
```

### Verify in Supabase

1. Go to **Supabase Dashboard** → **Table Editor**
2. You should see: `users`, `listings`, `bookings`, `reviews`, `conversations`, `messages`

### Run Individual Migration (if needed)

Using Supabase SQL Editor:
1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Copy-paste migration SQL
4. Click **Run**

---

## Seeding Data

### What is Seeding?

Seeding populates the database with sample data for testing and development.

### Seed Files

Located in `backend/database/seeds/`:

1. **001_seed_users.sql** - 5 test users (guests, hosts)
2. **002_seed_listings.sql** - 5 sample properties
3. **003_seed_bookings.sql** - 6 sample bookings (various statuses)

### Run All Seeds

```bash
cd backend/database
node run-seeds.js
```

Expected output:
```
🌱 Starting database seeding...

Found 3 seed files:

📄 Running: 001_seed_users.sql
✅ Success: 001_seed_users.sql

📄 Running: 002_seed_listings.sql
✅ Success: 002_seed_listings.sql

📄 Running: 003_seed_bookings.sql
✅ Success: 003_seed_bookings.sql

🎉 Database seeding completed!

📊 Database Summary:
   Users: 5
   Listings: 5
   Bookings: 6
```

### Sample Test Users

All test users have password: **`Test123!`**

- **guest1@example.com** - Verified guest (Sarah Johnson)
- **guest2@example.com** - New guest (Michael Chen)
- **host1@example.com** - Superhost (Emily Rodriguez) ⭐
- **host2@example.com** - Regular host (James Wilson)
- **both@example.com** - Guest + Host (Alex Martinez)

### Sample Listings

1. **Beach Villa** - $450/night (Malibu)
2. **Downtown Loft** - $185/night (Los Angeles)
3. **Mountain Cabin** - $220/night (Big Bear)
4. **Private Room** - $65/night (San Diego)
5. **Luxury Penthouse** - $550/night (San Francisco)

---

## Database Management

### View Tables in Supabase

**Table Editor**:
- Browse data with GUI
- Filter and sort records
- Edit data manually

**SQL Editor**:
```sql
-- Count records
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'listings', COUNT(*) FROM listings
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings;

-- View recent bookings
SELECT 
  b.id,
  b.status,
  b.check_in_date,
  l.title as listing_title,
  u.first_name || ' ' || u.last_name as guest_name
FROM bookings b
JOIN listings l ON b.listing_id = l.id
JOIN users u ON b.guest_id = u.id
ORDER BY b.created_at DESC
LIMIT 10;
```

### Reset Database (Careful!)

To completely reset and start fresh:

**Option 1: Drop all tables** (Supabase SQL Editor):
```sql
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS validate_amenities CASCADE;
DROP FUNCTION IF EXISTS validate_booking_dates CASCADE;
DROP FUNCTION IF EXISTS check_booking_availability CASCADE;
DROP FUNCTION IF EXISTS update_listing_average_rating CASCADE;
DROP FUNCTION IF EXISTS update_conversation_last_message CASCADE;
```

Then re-run migrations and seeds.

**Option 2: Truncate tables** (keeps schema):
```sql
TRUNCATE TABLE messages, conversations, reviews, bookings, listings, users CASCADE;
```

Then re-run seeds only.

### Backup Database

**From Supabase Dashboard**:
1. Go to **Database** → **Backups**
2. Free tier includes daily backups (7-day retention)
3. Click **"Create backup"** for manual backup

**Using pg_dump** (local backup):
```bash
pg_dump -h db.your-project-id.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  -f nestiva_backup_$(date +%Y%m%d).dump
```

### Common SQL Queries

**Find all bookings for a listing**:
```sql
SELECT * FROM bookings 
WHERE listing_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
ORDER BY check_in_date;
```

**Check listing availability**:
```sql
SELECT check_booking_availability(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- listing_id
  '2026-03-01', -- check-in
  '2026-03-05'  -- check-out
);
-- Returns true if available, false if blocked
```

**Calculate total revenue for a host**:
```sql
SELECT 
  u.first_name || ' ' || u.last_name as host_name,
  COUNT(b.id) as total_bookings,
  SUM(b.total_price) as total_revenue,
  AVG(b.total_price) as avg_booking_value
FROM users u
JOIN bookings b ON u.id = b.host_id
WHERE b.status IN ('confirmed', 'completed')
  AND u.id = '33333333-3333-3333-3333-333333333333'
GROUP BY u.id, u.first_name, u.last_name;
```

---

## Troubleshooting

### Connection Issues

**Error: "connection refused"**
- Check DB_HOST, DB_PORT, DB_PASSWORD in `.env`
- Verify Supabase project is not paused (free tier pauses after 7 days inactive)
- Check network/firewall settings

**Error: "SSL connection required"**
- Ensure `DB_SSL=true` in `.env`
- Supabase requires SSL connections

### Migration Errors

**Error: "relation already exists"**
- Tables already created
- Safe to ignore or drop tables first

**Error: "syntax error"**
- Check SQL syntax in migration file
- Run individual migrations to isolate issue

### Seed Errors

**Error: "duplicate key value"**
- Seed data already exists
- Truncate tables or use different IDs

---

## Next Steps

After database setup:

1. ✅ **Test API endpoints** - Start server and test with cURL/Postman
2. ✅ **Connect frontend** - Update frontend with Supabase credentials
3. 📦 **Phase 3: Reviews** - Implement review system (table ready)
4. 💬 **Phase 4: Messaging** - Build chat functionality (tables ready)
5. 💳 **Phase 5: Payments** - Integrate Stripe for real payments

---

## Production Deployment

### Security Checklist

- [ ] Use strong, unique passwords for production database
- [ ] Never commit `.env` file to version control
- [ ] Rotate JWT secrets regularly
- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Set up database backup schedule
- [ ] Monitor connection pool usage
- [ ] Enable SSL enforcement
- [ ] Review and adjust rate limiting

### Supabase Production Tips

1. **Enable Row Level Security (RLS)**:
   - Go to **Authentication** → **Policies**
   - Create policies for each table
   - Restrict access based on user roles

2. **Monitor Performance**:
   - Use Supabase **Reports** dashboard
   - Check query performance in **Logs**
   - Add indexes for slow queries

3. **Scale Appropriately**:
   - Free tier: 500MB database, 2 CPU cores
   - Pro tier: Unlimited database, dedicated resources
   - Upgrade before reaching limits

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Nestiva API Reference](../API_REFERENCE.md)

---

**Database Version**: 1.0.0  
**Last Updated**: February 4, 2026  
**Maintainer**: Nestiva Development Team
