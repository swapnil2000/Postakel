# Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Create Database
```bash
createdb postakel_master
```

### Step 3: Setup Environment
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/postakel_master
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
```

### Step 4: Setup Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Step 5: Start Server
```bash
npm run dev
```

Server runs at: **http://localhost:5000**

## API Quick Test

### 1. Register Company
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Company",
    "email": "admin@company.com",
    "password": "Password123!",
    "plan": "starter"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "your-company",
    "email": "admin@company.com",
    "password": "Password123!"
  }'
```

Response includes JWT token.

### 3. Get Current User
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Docker Setup

### Start with Docker Compose
```bash
docker-compose up -d
```

Access API at: **http://localhost:5000**
PostgreSQL at: **localhost:5432**

### Stop Services
```bash
docker-compose down
```

## Using with Frontend

Update frontend API calls to point to:
```javascript
const API_BASE_URL = 'http://localhost:5000/api/v1';
```

For production, update to your domain:
```javascript
const API_BASE_URL = 'https://api.yourdomain.com/api/v1';
```

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Linting
npm run lint
```

## File Structure

- `src/controllers/` - Request handlers
- `src/services/` - Business logic
- `src/routes/` - API routes
- `src/middleware/` - Express middleware
- `prisma/schema.prisma` - Database schema

## API Documentation

See [README.md](./README.md) for complete API documentation

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for AWS EC2 and production setup

## Troubleshooting

### Port 5000 Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql --version

# Start PostgreSQL (macOS)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ Backend is running
2. ⬜ Update frontend to use backend API
3. ⬜ Configure email (SMTP in .env)
4. ⬜ Deploy to AWS EC2 (see DEPLOYMENT.md)
5. ⬜ Deploy frontend to Vercel

## Support

- API Documentation: [README.md](./README.md)
- Deployment Guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Project Summary: [SUMMARY.md](./SUMMARY.md)
- Email: support@postakel.com

---

**You're all set! Happy coding! 🚀**
