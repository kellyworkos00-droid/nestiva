# Nestiva - Architecture & Project Structure

## Project Overview

**Nestiva** is a next-generation short-term rental platform combining the best-in-class UX of Airbnb with innovation in trust, speed, and discovery. Built with modern fullstack architecture optimized for scale, real-time features, and AI-powered personalization.

---

## Directory Structure

```
nestiva/
├── backend/                          # Node.js + Express API Server
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   ├── database.ts           # PostgreSQL connection pool
│   │   │   ├── redis.ts              # Redis client
│   │   │   ├── stripe.ts             # Stripe configuration
│   │   │   ├── aws.ts                # AWS S3 client
│   │   │   └── mail.ts               # Email service (SendGrid)
│   │   │
│   │   ├── controllers/              # Route handlers
│   │   │   ├── authController.ts     # Auth endpoints
│   │   │   ├── userController.ts     # User management
│   │   │   ├── listingController.ts  # Property listings
│   │   │   ├── bookingController.ts  # Bookings
│   │   │   ├── reviewController.ts   # Reviews & ratings
│   │   │   ├── messageController.ts  # Messaging
│   │   │   ├── paymentController.ts  # Payments
│   │   │   └── analyticsController.ts# Analytics
│   │   │
│   │   ├── models/                   # Database models/queries
│   │   │   ├── User.ts
│   │   │   ├── Listing.ts
│   │   │   ├── Booking.ts
│   │   │   ├── Review.ts
│   │   │   ├── Message.ts
│   │   │   └── Transaction.ts
│   │   │
│   │   ├── services/                 # Business logic
│   │   │   ├── authService.ts        # Auth logic (JWT, OAuth)
│   │   │   ├── listingService.ts     # Listing operations
│   │   │   ├── bookingService.ts     # Booking logic
│   │   │   ├── paymentService.ts     # Stripe integration
│   │   │   ├── reviewService.ts      # Review logic + AI summaries
│   │   │   ├── pricingService.ts     # Dynamic pricing & AI
│   │   │   ├── searchService.ts      # Full-text search
│   │   │   ├── emailService.ts       # Email sending
│   │   │   ├── uploadService.ts      # Image upload to S3
│   │   │   └── aiService.ts          # OpenAI integration
│   │   │
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── listings.ts
│   │   │   ├── bookings.ts
│   │   │   ├── reviews.ts
│   │   │   ├── messages.ts
│   │   │   ├── payments.ts
│   │   │   └── analytics.ts
│   │   │
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.ts               # JWT verification
│   │   │   ├── validation.ts         # Request validation (Joi)
│   │   │   ├── errorHandler.ts       # Global error handling
│   │   │   ├── rateLimiter.ts        # Rate limiting
│   │   │   ├── cors.ts               # CORS configuration
│   │   │   └── logger.ts             # Request logging
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ├── jwt.ts                # JWT token generation
│   │   │   ├── password.ts           # Hash/verify passwords
│   │   │   ├── email.ts              # Email templates
│   │   │   ├── validators.ts         # Input validation
│   │   │   ├── errorCodes.ts         # Error definitions
│   │   │   ├── constants.ts          # App constants
│   │   │   ├── helpers.ts            # Helper functions
│   │   │   └── logger.ts             # Logging utility
│   │   │
│   │   ├── types/                    # TypeScript types
│   │   │   ├── index.ts              # All type definitions
│   │   │   ├── express.ts            # Express extensions
│   │   │   └── db.ts                 # Database types
│   │   │
│   │   ├── migrations/               # Database migrations
│   │   │   ├── 001_init_schema.sql
│   │   │   ├── 002_add_indices.sql
│   │   │   └── config.js
│   │   │
│   │   ├── jobs/                     # Background jobs (Bull)
│   │   │   ├── emailQueue.ts         # Email processing
│   │   │   ├── pricingQueue.ts       # Auto-pricing calculations
│   │   │   ├── analyticsQueue.ts     # Analytics processing
│   │   │   └── cleanupQueue.ts       # Cleanup tasks
│   │   │
│   │   └── server.ts                 # Express app entry
│   │
│   ├── .env.example                  # Environment template
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── src/                              # Next.js Frontend (App Router)
│   ├── app/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage / Landing
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   ├── verify-phone/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── page.tsx              # Search results
│   │   │   ├── [id]/page.tsx         # Listing details
│   │   │   └── map/page.tsx          # Map view
│   │   │
│   │   ├── listings/
│   │   │   ├── [id]/page.tsx         # Listing detail page
│   │   │   ├── [id]/reviews/page.tsx # Reviews section
│   │   │   └── [id]/booking/page.tsx # Booking flow
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx          # My bookings
│   │   │   │   └── [id]/page.tsx     # Booking details
│   │   │   ├── trips/page.tsx        # My trips
│   │   │   ├── profile/page.tsx      # User profile
│   │   │   ├── favorites/page.tsx    # Saved listings
│   │   │   └── messages/page.tsx     # Inbox
│   │   │
│   │   ├── host/
│   │   │   ├── page.tsx              # Host info page
│   │   │   ├── dashboard/page.tsx    # Host dashboard
│   │   │   ├── listings/
│   │   │   │   ├── page.tsx          # My listings
│   │   │   │   ├── create/page.tsx   # Create listing
│   │   │   │   ├── [id]/page.tsx     # Edit listing
│   │   │   │   └── [id]/calendar/page.tsx
│   │   │   ├── bookings/page.tsx     # Host bookings
│   │   │   ├── analytics/page.tsx    # Revenue analytics
│   │   │   └── reviews/page.tsx      # Host reviews
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── signup/route.ts
│   │   │   │   └── callback/route.ts
│   │   │   ├── listings/route.ts
│   │   │   ├── upload/route.ts       # Image upload endpoint
│   │   │   └── webhooks/
│   │   │       ├── stripe/route.ts
│   │   │       └── sendgrid/route.ts
│   │   │
│   │   └── error.tsx                 # Error boundary
│   │
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Rating.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── Spinner.tsx
│   │   │
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ListingCard.tsx
│   │   │   ├── ListingGallery.tsx
│   │   │   ├── PropertyPreview3D.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewSummary.tsx
│   │   │   ├── BookingFlow.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── HostProfile.tsx
│   │   │   ├── MessageThread.tsx
│   │   │   ├── MapSearch.tsx
│   │   │   └── PricingCalculator.tsx
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Container.tsx
│   │   │   └── SEO.tsx
│   │   │
│   │   └── forms/                    # Form components
│   │       ├── LoginForm.tsx
│   │       ├── SignupForm.tsx
│   │       ├── ListingForm.tsx
│   │       ├── ProfileForm.tsx
│   │       └── FilterForm.tsx
│   │
│   ├── lib/                          # Utility functions
│   │   ├── api.ts                    # API client
│   │   ├── auth.ts                   # Auth helpers
│   │   ├── storage.ts                # Local storage utils
│   │   ├── validators.ts             # Form validators
│   │   ├── formatting.ts             # Format utilities
│   │   ├── constants.ts              # App constants
│   │   └── helpers.ts                # Helper functions
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts                # Auth context hook
│   │   ├── useLocalStorage.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useFetch.ts
│   │   ├── useForm.ts
│   │   ├── usePagination.ts
│   │   └── useDebounce.ts
│   │
│   ├── context/                      # React context
│   │   ├── AuthContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── styles/
│   │   ├── globals.css               # Global styles
│   │   ├── variables.css             # CSS variables (colors, spacing)
│   │   ├── animations.css            # Animation definitions
│   │   └── utilities.css             # Utility classes
│   │
│   ├── types/
│   │   ├── index.ts                  # All type definitions
│   │   └── api.ts                    # API response types
│   │
│   ├── middleware.ts                 # Next.js middleware
│   └── instrumentation.ts            # Observability
│
├── docs/
│   ├── DATABASE_SCHEMA.md            # PostgreSQL schema
│   ├── API_ENDPOINTS.md              # Full API documentation
│   ├── USER_FLOWS.md                 # User journey diagrams
│   ├── ARCHITECTURE.md               # This file
│   ├── SETUP.md                      # Installation guide
│   ├── DEPLOYMENT.md                 # Deployment guide
│   ├── CONTRIBUTING.md               # Contribution guidelines
│   └── FEATURES.md                   # Feature specifications
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # GitHub Actions CI/CD
│   │   ├── test.yml
│   │   └── deploy.yml
│   └── copilot-instructions.md       # Copilot instructions
│
├── .docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── .env.example                      # Environment template
├── .env.local                        # Local environment
├── .gitignore
├── package.json                      # Root workspace config
├── tsconfig.json
├── tailwind.config.ts                # Tailwind CSS config
├── next.config.ts                    # Next.js config
├── postcss.config.mjs                # PostCSS config
└── README.md
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **Component Library**: Custom (premium, minimal design)
- **State Management**: React Context + Custom Hooks
- **API Client**: Axios + React Query
- **Maps**: Mapbox GL
- **3D**: Three.js / Spline
- **Forms**: React Hook Form + Zod
- **Authentication**: NextAuth.js
- **Image Optimization**: Next.js Image component + Sharp
- **Real-time**: Socket.io
- **PWA**: next-pwa
- **Analytics**: Vercel Analytics + Custom Events
- **Testing**: Vitest + React Testing Library

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **Cache**: Redis
- **File Storage**: AWS S3
- **Authentication**: JWT + OAuth 2.0
- **Payments**: Stripe API
- **Email**: SendGrid
- **SMS**: Twilio
- **Search**: PostgreSQL Full-text Search (+ Elasticsearch if needed)
- **Background Jobs**: Bull (Redis)
- **Web Sockets**: Socket.io
- **AI/ML**: OpenAI API (Reviews, Recommendations)
- **Rate Limiting**: express-rate-limit + Redis
- **Validation**: Joi
- **Logging**: Winston
- **Monitoring**: Sentry / DataDog
- **Testing**: Vitest + Supertest

### DevOps & Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose (dev), Kubernetes (prod)
- **CI/CD**: GitHub Actions
- **Hosting**: AWS (EC2 / ECS / Lambda)
- **CDN**: CloudFront
- **Database Hosting**: AWS RDS
- **Monitoring**: CloudWatch + Sentry
- **Error Tracking**: Sentry
- **Performance**: New Relic / DataDog

---

## Key Architecture Decisions

### 1. **Separation of Concerns**
- Backend API serves as single source of truth
- Frontend consumes via REST + WebSocket
- Database layer abstracted through models/services
- Each service handles one business domain

### 2. **Authentication & Security**
- JWT tokens for stateless authentication
- Refresh tokens stored in HTTP-only cookies
- OAuth 2.0 for social login (Google, GitHub)
- Email + Phone verification for guests
- ID verification for hosts
- Rate limiting on all public endpoints
- CORS whitelisting

### 3. **Database Design**
- PostgreSQL for relational data with ACID guarantees
- Normalized schema to prevent redundancy
- Materialized views for performance
- Indexes on frequently queried columns
- Soft deletes for data recovery
- JSONB for flexible data (amenities, preferences)
- PostGIS for geographic queries

### 4. **Caching Strategy**
- Redis for session storage
- Redis for rate limiting
- Redis for caching expensive queries
- Cache invalidation on data updates
- TTL-based expiration

### 5. **File Storage**
- AWS S3 for image storage
- CloudFront CDN for distribution
- Image optimization pipeline (Sharp)
- Pre-signed URLs for upload/download
- Automatic cleanup of unused images

### 6. **Real-time Features**
- Socket.io for real-time messaging
- Redis adapter for Socket.io horizontal scaling
- Event-driven architecture for notifications
- WebSocket connections for live updates

### 7. **API Design**
- RESTful endpoints with standard HTTP methods
- Consistent response format with metadata
- Pagination with limit/offset
- Filtering & sorting capabilities
- Proper HTTP status codes
- Versioning (/api/v1)

### 8. **AI Integration**
- OpenAI API for review summaries
- AI-powered recommendations engine
- Dynamic pricing suggestions
- Fraud detection
- Inappropriate content detection

### 9. **Scalability**
- Stateless backend services
- Horizontal scaling with load balancing
- Database connection pooling
- Background job queue for long-running tasks
- CDN for static assets
- Microservices-ready architecture

---

## Development Workflow

### Local Development
```bash
# 1. Clone repository
git clone https://github.com/nestiva/nestiva.git

# 2. Install dependencies
npm install
cd backend && npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Start databases (Docker Compose)
docker-compose up -d postgres redis

# 5. Run migrations
npm run migrate

# 6. Start development servers
npm run dev        # Frontend (localhost:3000)
npm run dev:backend # Backend (localhost:3001)
```

### Deployment
```bash
# Production deployment workflow:
# 1. Push to main branch
# 2. GitHub Actions runs tests
# 3. If tests pass, builds Docker images
# 4. Pushes to AWS ECR
# 5. Updates ECS service
# 6. Runs smoke tests
```

---

## Performance Optimizations

1. **Frontend**
   - Code splitting with dynamic imports
   - Image optimization with Next.js Image
   - Lazy loading of components
   - Service Worker caching
   - Compression (gzip/brotli)

2. **Backend**
   - Database query optimization
   - Caching frequently accessed data
   - Pagination for large result sets
   - Asynchronous processing with Bull
   - CDN for static assets

3. **Database**
   - Proper indexing strategy
   - Query optimization
   - Connection pooling
   - Read replicas for analytics
   - Materialized views for complex queries

---

## Security Measures

1. **Authentication**
   - JWT tokens with short expiration
   - Refresh tokens in HTTP-only cookies
   - OAuth 2.0 for third-party login

2. **Authorization**
   - Role-based access control (RBAC)
   - Row-level security for data isolation
   - Resource ownership validation

3. **Data Protection**
   - HTTPS/TLS for all communications
   - Password hashing with bcrypt
   - Sensitive data encryption
   - PII protection

4. **API Security**
   - Rate limiting per IP/user
   - Input validation & sanitization
   - CORS whitelisting
   - CSRF protection
   - SQL injection prevention (parameterized queries)
   - XSS protection

5. **Infrastructure**
   - VPC for network isolation
   - Security groups for access control
   - Secrets management (AWS Secrets Manager)
   - Regular security audits
   - Penetration testing

---

## Monitoring & Analytics

1. **Application Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)
   - Real-time logs (CloudWatch)
   - Custom metrics

2. **Business Analytics**
   - User behavior tracking
   - Conversion funnel analysis
   - Revenue metrics
   - Host performance metrics

3. **Infrastructure Monitoring**
   - CPU/Memory utilization
   - Database performance
   - API response times
   - Error rates

