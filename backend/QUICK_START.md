# Backend Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/nestiva
JWT_SECRET=your-dev-secret-key-change-in-production
JWT_REFRESH_SECRET=your-dev-refresh-secret-key
```

### 3. Start PostgreSQL
```bash
# Using Docker
docker-compose up -d postgres

# Or start your local PostgreSQL server
```

### 4. Run Database Migrations
```bash
npm run migrate
```

### 5. Start Development Server
```bash
npm run dev
```

Server will be running at: `http://localhost:3001`

---

## Testing First Endpoint

### Health Check (No Auth Required)
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Register New User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "first_name": "Test",
    "last_name": "User",
    "user_type": "host"
  }'
```

Expected response (201):
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "test@example.com", ... },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Save Your Token
```bash
TOKEN="paste_token_from_response_here"
```

### Use Token to Access Protected Endpoint
```bash
curl -X GET http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

Expected response (200):
```json
{
  "success": true,
  "data": {
    "user": { ... full user profile ... }
  }
}
```

---

## Common Development Tasks

### Create a Listing
```bash
curl -X POST http://localhost:3001/api/v1/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Test Apartment",
    "description": "A beautiful apartment in the city with all amenities you need for a comfortable stay.",
    "category": "apartments",
    "property_type": "apartment",
    "address": "456 Oak Ave",
    "city": "New York",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "max_guests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 1,
    "amenities": ["wifi", "kitchen", "ac", "washer"],
    "house_rules": ["no smoking", "quiet hours after 10pm"],
    "cancellation_policy": "moderate",
    "base_price": 120,
    "currency": "USD",
    "cleaning_fee": 20,
    "service_fee_percentage": 3
  }'
```

### Search Listings
```bash
curl -X GET "http://localhost:3001/api/v1/listings/search?city=New%20York&min_price=100&max_price=200" \
  -H "Content-Type: application/json"
```

### Publish Your Listing
```bash
LISTING_ID="paste_listing_id_from_create_response"

curl -X POST http://localhost:3001/api/v1/listings/$LISTING_ID/publish \
  -H "Authorization: Bearer $TOKEN"
```

### Update Your Profile
```bash
curl -X PUT http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "bio": "Travel enthusiast and host!",
    "response_time_hours": 2
  }'
```

---

## Project Structure

```
backend/src/
├── controllers/          # HTTP request handlers
│   ├── authController.ts
│   ├── userController.ts
│   └── listingController.ts
├── services/            # Business logic
│   ├── authService.ts
│   ├── userService.ts
│   └── listingService.ts
├── models/              # Database queries
│   ├── userModel.ts
│   └── listingModel.ts
├── routes/              # API route definitions
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   └── listingRoutes.ts
├── middleware/          # Express middleware
│   └── auth.ts
├── utils/               # Utility functions
│   ├── jwt.ts
│   ├── password.ts
│   ├── validators.ts
│   └── errors.ts
├── config/              # Configuration
│   └── database.ts
├── types/               # TypeScript types
│   └── index.ts
└── server.ts            # Express app entry point
```

---

## Code Organization

### Adding a New Endpoint

1. **Create a Model Function** (`models/userModel.ts`):
```typescript
export const myNewQuery = async (param: string): Promise<User> => {
  const result = await pool.query(
    `SELECT * FROM users WHERE name = $1`,
    [param]
  );
  return result.rows[0];
};
```

2. **Create a Service Function** (`services/userService.ts`):
```typescript
export const myNewService = async (param: string): Promise<User> => {
  if (!isValid(param)) {
    throw new ValidationError('Invalid parameter');
  }
  return await myNewQuery(param);
};
```

3. **Create a Controller Function** (`controllers/userController.ts`):
```typescript
export const myNewEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await myNewService(req.body.param);
    res.status(200).json(createSuccessResponse({ data: result }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};
```

4. **Add Route** (`routes/userRoutes.ts`):
```typescript
router.post('/my-endpoint', requireAuthMiddleware, myNewEndpoint);
```

---

## Debugging

### Enable Debug Logging
```bash
DEBUG=nestiva:* npm run dev
```

### Check Database Connection
```bash
psql postgresql://user:password@localhost:5432/nestiva -c "SELECT version();"
```

### View API Logs
```bash
# Server logs are printed to console in development
# Check terminal running `npm run dev`
```

### Test Token Validity
```bash
# Decode JWT (online): jwt.io
# Or use Node:
node -e "console.log(require('jsonwebtoken').decode('YOUR_TOKEN'))"
```

---

## Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Run production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
npm run migrate      # Run database migrations
npm test             # Run tests (when implemented)
```

---

## Common Issues

### "Database Connection Error"
- Verify PostgreSQL is running
- Check DATABASE_URL in .env.local
- Ensure database exists: `createdb nestiva`

### "Invalid Token"
- Token may have expired (15 minute expiry)
- Check token is correctly formatted in header
- Use refresh token to get new access token (Phase 2)

### "Port Already in Use"
- Change PORT in .env.local
- Or kill process: `lsof -i :3001` then `kill -9 <PID>`

### "TypeScript Compilation Error"
- Clear cache: `rm -rf dist/`
- Reinstall: `npm install`
- Check types: `npm run type-check`

---

## Performance Tips

- Use pagination (limit, offset) for large result sets
- Search uses indexes on city, category
- View count tracking is non-blocking
- Database connection pooling is configured
- JWT verification is fast (~5ms)

---

## Security Reminders

✅ Always use HTTPS in production  
✅ Keep JWT_SECRET secure (use environment variables)  
✅ Validate all user input (validators.ts)  
✅ Never commit .env.local to git  
✅ Use prepared statements (already implemented)  
✅ Hash passwords (already implemented)  
✅ Set up rate limiting (configured at 100/15min)  

---

## Next Steps

1. **Test all 21 endpoints** - Use API_REFERENCE.md
2. **Integrate with frontend** - Exchange JWT tokens
3. **Set up database backups** - Implement regular dumps
4. **Create test suite** - Unit and integration tests
5. **Phase 2 Implementation** - Add booking endpoints

---

## Resources

- Full API Documentation: [API_REFERENCE.md](./API_REFERENCE.md)
- Implementation Guide: [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- Phase 1 Status: [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md)
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Express.js Guide: https://expressjs.com/
- PostgreSQL Docs: https://www.postgresql.org/docs/

---

## Support

Questions? Check these files in order:
1. This file (Quick Start Guide)
2. API_REFERENCE.md (For endpoint details)
3. IMPLEMENTATION_GUIDE.md (For architecture details)
4. Source code comments (In controller/service files)

Ready to build! 🚀
