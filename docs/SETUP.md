# Setup & Installation Guide

## Prerequisites

- **Node.js**: 18.17+ (LTS recommended)
- **npm**: 9+
- **PostgreSQL**: 15+
- **Redis**: 7+
- **Docker**: (Optional, for containerized development)
- **Git**: 2.40+

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/nestiva/nestiva.git
cd nestiva
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies (already installed at root)
```

### 3. Database Setup

#### Using Docker Compose (Recommended)
```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Wait for containers to be healthy
docker-compose ps
```

#### Manual PostgreSQL Setup
```bash
# Create database
createdb nestiva

# Create postgres user
createuser nestiva --interactive

# Grant privileges
psql -U postgres -d nestiva \
  -c "GRANT ALL PRIVILEGES ON DATABASE nestiva TO nestiva;"
```

### 4. Environment Configuration

```bash
# Backend environment
cp .env.example .env.local
# Edit .env.local with your settings

# Frontend environment
cp src/.env.example src/.env.local
```

### 5. Database Migrations

```bash
cd backend

# Run migrations
npm run migrate

# Create sample data (optional)
npm run seed
```

### 6. Start Development Servers

#### Terminal 1: Frontend
```bash
npm run dev
# Frontend: http://localhost:3000
```

#### Terminal 2: Backend
```bash
cd backend
npm run dev
# Backend: http://localhost:3001
# API Docs: http://localhost:3001/api/docs
```

#### Terminal 3: Redis (if needed)
```bash
redis-server
```

---

## Environment Variables

### Backend (.env.local)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nestiva

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret
JWT_EXPIRATION=7d

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=nestiva-images

# Email (SendGrid)
SENDGRID_API_KEY=your_api_key

# Maps
MAPBOX_ACCESS_TOKEN=your_token

# AI
OPENAI_API_KEY=your_api_key

# OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## Project Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run seed         # Populate sample data
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

---

## Verification

### Frontend
```bash
curl http://localhost:3000
# Should return HTML with "Nestiva" in title
```

### Backend
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"2025-02-04T..."}
```

### Database
```bash
psql -U postgres -d nestiva -c "SELECT COUNT(*) FROM users;"
# Should return: count = 0 (initially)
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different ports
PORT=3002 npm run dev
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
psql --version

# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Start PostgreSQL (Docker)
docker-compose up -d postgres
```

### Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping

# Start Redis (Docker)
docker-compose up -d redis
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Migration Failed
```bash
# Check migration status
npm run migrate:status

# Rollback last migration
npm run migrate:rollback

# Check database directly
psql -U postgres -d nestiva -c "\dt"
```

---

## IDE Setup (VS Code)

### Recommended Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "github.copilot"
  ]
}
```

### VS Code Settings
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Production Deployment

### Building for Production
```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
```

### Docker Deployment
```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### AWS Deployment
1. Create ECR repositories
2. Build and push Docker images
3. Create ECS task definitions
4. Create ECS services
5. Configure load balancer
6. Setup CloudFront CDN
7. Configure SSL certificates

---

## Testing

### Frontend Testing
```bash
npm run test                # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Backend Testing
```bash
cd backend
npm run test               # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Integration Testing
```bash
npm run test:integration  # Full integration tests
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3000/3001 in use | Use different port: `PORT=3002 npm run dev` |
| PostgreSQL not connecting | Check credentials in `.env.local` |
| Redis connection refused | Start Redis: `docker-compose up -d redis` |
| Migration errors | Check database exists: `createdb nestiva` |
| CORS errors | Check `CORS_ORIGIN` in backend `.env` |
| Image upload fails | Check AWS credentials and S3 bucket permissions |
| Email not sending | Verify SendGrid API key and email address |
| OAuth errors | Check callback URL matches configuration |

---

## Next Steps

1. **Create your first listing** → See [USER_FLOWS.md](./USER_FLOWS.md)
2. **Explore API** → See [API_ENDPOINTS.md](./API_ENDPOINTS.md)
3. **Understand database** → See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
4. **Deploy to production** → See [DEPLOYMENT.md](./DEPLOYMENT.md)

