# Nestiva Backend - Production Ready ✅

A comprehensive Node.js/TypeScript/Express backend for a global short-term rental platform with 76 production-ready API endpoints.

**Status**: ✅ **COMPLETE AND READY FOR DEPLOYMENT**

---

## Quick Overview

```
Total Endpoints: 76
Lines of Code: ~10,000+ (4,927 new features)
Database Tables: 7
Supported Countries: 195+
Commission Rate: 15%
Git Commits: 8
Documentation Pages: 5
```

### Key Features

- 🔐 **JWT Authentication** - Secure user authentication with refresh tokens
- 💳 **Payment Commission** - Automatic 15% platform fee on bookings
- 💬 **Messaging System** - Host-guest communication with read receipts
- 🌍 **Multi-Currency** - 195+ countries with auto-exchange rates
- 📍 **Location Search** - Haversine distance calculations for nearby listings
- ⭐ **Reviews & Ratings** - Bidirectional reviews with 5-star system
- 📅 **Booking Management** - Full booking lifecycle with check-in/out
- 🔒 **Security** - Helmet, rate limiting, CORS, SSL database

---

## Architecture

```
Express.js + TypeScript + PostgreSQL (Supabase)
├── 76 API Endpoints
├── 9 Controllers (routing logic)
├── 9 Models (database queries)
├── 9 Services (business logic)
├── 7 Database Tables
└── Full Type Safety (TypeScript)
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) | **START HERE** - Complete status & deployment checklist |
| [API_REFERENCE.md](./API_REFERENCE.md) | All 76 endpoints with examples |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | How to test all features |
| [PAYMENT_SYSTEM.md](./PAYMENT_SYSTEM.md) | Commission system explained |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Technical deep dive |

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Create `.env` file:
```env
DATABASE_URL=postgresql://user:pass@host/nestiva?sslmode=require
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

### 3. Run Migrations
```bash
npm run db:migrate
npm run db:seed
```

### 4. Start Server
```bash
npm run dev
```

### 5. Test
```bash
curl http://localhost:3000/health
```

---

## API Endpoints (76 Total)

### Public Endpoints (No Auth)
- **Authentication**: 6 endpoints (register, login, etc.)
- **Currency**: 7 endpoints (conversion, rates, etc.)
- **Location Search**: 6 endpoints (nearby, map, etc.)
- **Listings**: 3 endpoints (list, details, featured)

### Protected Endpoints (JWT Required)
- **Users**: 6 endpoints (profile, avatar, etc.)
- **Listings**: 6 endpoints (create, update, etc.)
- **Bookings**: 12 endpoints (full lifecycle)
- **Reviews**: 11 endpoints (bidirectional)
- **Payments**: 8 endpoints (earnings, commissions)
- **Messaging**: 11 endpoints (conversations, messages)

**Total**: 76 production-ready endpoints

---

## Key Features

### Payment Commission System
```json
{
  "booking_amount": 1000,
  "platform_commission": 150,  // 15%
  "host_receives": 850,
  "commission_due": "7 days after checkout"
}
```

### Multi-Currency
```
195+ countries supported
Auto-set currency: US → USD, UK → GBP, JP → JPY, etc.
Real-time exchange rates
Price formatting with symbols ($, €, £, ¥, ₹, etc.)
```

### Location Search
```
Haversine formula for accurate distances
Nearby listings: ?latitude=40.7128&longitude=-74.0060&radius=10
Map bounds: ?bounds=south,west,north,east
City/country filtering
```

### Messaging
```
One conversation per guest per listing
Full message history
Read receipts
Unread count tracking
Archiving support
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20+ |
| Language | TypeScript | 5.3.3 |
| Framework | Express.js | 4.18.2 |
| Database | PostgreSQL | 14+ (via Supabase) |
| Auth | JWT + bcrypt | 9.0.2 / 5.1.1 |
| Security | Helmet, Rate Limit | 7.1.0 / 7.1.5 |
| Validation | Joi | 17.11.0 |
| Logging | Winston | 3.11.0 |

---

## Database Schema

```sql
-- 7 Core Tables
users                    -- User accounts & profiles
listings                 -- Property listings
bookings                 -- Reservations
reviews                  -- Ratings & feedback
conversations            -- Chat threads
messages                 -- Chat messages
payment_transactions     -- Commission tracking
```

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # 9 HTTP handlers
│   ├── models/          # 9 Database queries
│   ├── services/        # 9 Business logic
│   ├── routes/          # 9 API routes
│   ├── middleware/      # Auth, errors
│   ├── utils/           # Helpers (JWT, currency, location)
│   ├── types/           # TypeScript interfaces
│   └── server.ts        # Express app
├── database/
│   ├── migrations/      # 7 schema files
│   └── seeds/           # Test data
├── dist/                # Compiled JavaScript
├── API_REFERENCE.md     # Complete endpoint docs
├── TESTING_GUIDE.md     # How to test
├── PAYMENT_SYSTEM.md    # Commission system
├── PROJECT_SUMMARY.md   # Technical details
└── DEPLOYMENT_READY.md  # Status & checklist
```

---

## Usage Examples

### Register & Login
```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "user_type": "guest",
    "country": "US"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecurePass123!"}'
```

### Find Nearby Listings
```bash
curl "http://localhost:3000/api/v1/listings/search/nearby?latitude=40.7128&longitude=-74.0060&radius=10"
```

### Convert Currency
```bash
curl -X POST http://localhost:3000/api/v1/currencies/convert \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "from": "USD", "to": "EUR"}'
```

### Create Booking
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listing_id": "123e4567-e89b-12d3-a456-426614174000",
    "check_in_date": "2026-02-15",
    "check_out_date": "2026-02-20",
    "number_of_guests": 2
  }'
```

### Check Host Earnings
```bash
curl -H "Authorization: Bearer HOST_JWT_TOKEN" \
  http://localhost:3000/api/v1/payments/earnings
```

Response:
```json
{
  "success": true,
  "data": {
    "gross_earnings": 5000.00,
    "total_commissions": 750.00,
    "net_earnings": 4250.00,
    "pending_commissions": 225.00,
    "commission_rate": 0.15
  }
}
```

---

## Deployment

### Prerequisites
- Node.js 20+
- Supabase PostgreSQL instance
- 2GB+ disk space
- 512MB+ RAM

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/kellyworkos00-droid/nestiva.git
   cd nestiva/backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Run Migrations**
   ```bash
   npm run db:migrate
   npm run db:seed  # Optional: seed test data
   ```

5. **Build**
   ```bash
   npm run build
   ```

6. **Start Server**
   ```bash
   npm start
   ```

---

## Performance

### Expected Benchmarks
- **Authentication**: < 200ms
- **Listing Lookup**: < 100ms
- **Currency Conversion**: < 50ms
- **Location Search**: < 200ms
- **Concurrent Users**: 1000+

### Optimization
- Database connection pooling (20 max)
- SQL query optimization
- Haversine distance in SQL
- Indexed database columns
- Rate limiting per endpoint

---

## Security

✅ **Features Implemented**
- JWT authentication with refresh tokens
- bcrypt password hashing (salt rounds: 10)
- HTTPS/SSL for database connection
- CORS configuration
- Security headers (Helmet)
- Rate limiting (100 requests/15 min)
- Input validation (Joi)
- SQL injection protection
- XSS protection
- CSRF token support

---

## Monitoring & Logging

- Winston logger for application logs
- Error tracking and reporting
- Request/response logging
- Database query logging
- Performance monitoring

---

## Git History

```
061ccf0 - docs: Add deployment-ready status and final summary
7193e4c - docs: Add comprehensive project summary and testing guide
c64c7c4 - feat: Add location-based listing search
d157c9d - feat: Add automatic currency conversion by country
6d44470 - feat: Add messaging system (11 endpoints)
c4df086 - feat: Add payment & commission system (15% fee)
bc0b95c - feat: Complete reviews & ratings system
f431bfc - feat: Complete database setup with Supabase
0cabcac - feat: Complete Phase 1 Backend Implementation
```

**Repository**: https://github.com/kellyworkos00-droid/nestiva

---

## Scripts

```json
{
  "dev": "tsx watch src/server.ts",           // Development with hot reload
  "build": "tsc",                             // Compile TypeScript
  "start": "node dist/server.js",             // Start production
  "db:migrate": "node database/run-migrations.js",
  "db:seed": "node database/run-seeds.js",
  "db:setup": "npm run db:migrate && npm run db:seed",
  "lint": "eslint src --ext .ts",
  "test": "vitest"
}
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Authentication
JWT_SECRET=your-super-secret-key
JWT_EXPIRY=24h

# Server
PORT=3000
NODE_ENV=development|production

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email@gmail.com
SMTP_PASS=password

# Payment (Optional)
STRIPE_SECRET_KEY=sk_test_...

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=key
AWS_SECRET_ACCESS_KEY=secret
AWS_S3_BUCKET=bucket-name

# OAuth (Optional)
GOOGLE_CLIENT_ID=id
GOOGLE_CLIENT_SECRET=secret
```

---

## Troubleshooting

### Database Connection Error
```
Error: ECONNREFUSED 127.0.0.1:5432
```
✅ Solution: Verify DATABASE_URL in .env and Supabase connection

### Build Errors
```
error TS2307: Cannot find module 'express'
```
✅ Solution: Run `npm install` to install dependencies

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
✅ Solution: Change PORT in .env or kill process on port 3000

### Disk Space
```
npm ERR! ENOSPC: no space left on device
```
✅ Solution: Free up 2GB+ disk space and retry

---

## Support & Resources

- 📖 [Complete API Documentation](./API_REFERENCE.md)
- 🧪 [Testing Guide](./TESTING_GUIDE.md)
- 💳 [Payment System Guide](./PAYMENT_SYSTEM.md)
- 📋 [Project Summary](./PROJECT_SUMMARY.md)
- 🚀 [Deployment Checklist](./DEPLOYMENT_READY.md)

---

## License

Proprietary - Nestiva Platform

---

## Status

✅ **PRODUCTION READY**

- All 76 endpoints implemented
- Complete type safety (TypeScript)
- Database migrations ready
- Error handling implemented
- Security hardened
- Documentation complete
- Git version controlled
- Ready for deployment

---

**Last Updated**: February 4, 2026  
**Version**: 1.0.0  
**Development Status**: Complete  

Ready to deploy! 🚀

