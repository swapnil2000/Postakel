# Postakel Backend

Multi-tenant HR Management System Backend built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- 🏢 **Multi-tenant Architecture**: Each company has its own isolated database
- 👥 **Employee Management**: Complete employee lifecycle management
- ⏰ **Time Tracking**: Clock in/out with break management
- 🏖️ **Leave Management**: Leave requests with approval workflow
- 📋 **Task Management**: Create and assign tasks with progress tracking
- 💼 **Asset Management**: Track company assets and assignments
- 📊 **Performance Management**: Reviews, goals, and ratings
- 📢 **Announcements**: Company-wide communication
- 🔐 **Role-based Access Control**: Granular permission system
- 🔑 **JWT Authentication**: Secure token-based authentication

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Email**: Nodemailer
- **Deployment**: AWS EC2, Vercel

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

\`\`\`bash
git clone <repository-url>
cd backend
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your configuration:

\`\`\`env
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

FRONTEND_URL=http://localhost:5173
FRONTEND_PRODUCTION_URL=https://yourdomain.vercel.app

DATABASE_URL=postgresql://postgres:password@localhost:5432/postakel_master

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@postakel.com

TENANT_DB_HOST=localhost
TENANT_DB_PORT=5432
TENANT_DB_USER=postgres
TENANT_DB_PASSWORD=password
\`\`\`

### 4. Set up the database

Create the master database:

\`\`\`sql
CREATE DATABASE postakel_master;
\`\`\`

### 5. Generate Prisma Client

\`\`\`bash
npm run prisma:generate
\`\`\`

### 6. Run migrations

\`\`\`bash
npm run prisma:migrate
\`\`\`

## Running the Application

### Development

\`\`\`bash
npm run dev
\`\`\`

The server will start at `http://localhost:5000`

### Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── app.ts             # Express app setup
│   └── index.ts           # Entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── .env.example           # Environment variables template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
\`\`\`

## API Documentation

### Authentication Endpoints

#### Register Tenant
\`POST /api/v1/auth/register\`

\`\`\`json
{
  "name": "Company Name",
  "email": "admin@company.com",
  "password": "SecurePassword123!",
  "plan": "starter",
  "industry": "Technology",
  "companySize": "50-100"
}
\`\`\`

#### Login
\`POST /api/v1/auth/login\`

\`\`\`json
{
  "subdomain": "company-name",
  "email": "user@company.com",
  "password": "password"
}
\`\`\`

#### Get Current User
\`GET /api/v1/auth/me\`
*Requires: Authorization header with JWT token*

### User Management Endpoints

#### Create User
\`POST /api/v1/users\`
*Requires: Admin role*

\`\`\`json
{
  "email": "employee@company.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9876543210",
  "role": "employee",
  "department": "Engineering",
  "title": "Senior Developer"
}
\`\`\`

#### Get Users
\`GET /api/v1/users\`

#### Get User by ID
\`GET /api/v1/users/:userId\`

#### Update User
\`PUT /api/v1/users/:userId\`

#### Delete User
\`DELETE /api/v1/users/:userId\`
*Requires: Admin role*

### Time Tracking Endpoints

#### Clock In
\`POST /api/v1/timetracking/clock-in\`

\`\`\`json
{
  "location": "Office",
  "project": "Project Name",
  "description": "Starting work"
}
\`\`\`

#### Clock Out
\`POST /api/v1/timetracking/:timeEntryId/clock-out\`

#### Start Break
\`POST /api/v1/timetracking/:timeEntryId/break-start\`

\`\`\`json
{
  "type": "lunch",
  "notes": "Taking lunch break"
}
\`\`\`

#### End Break
\`POST /api/v1/timetracking/:breakId/break-end\`

#### Get Time Entries
\`GET /api/v1/timetracking\`

#### Get Today Hours
\`GET /api/v1/timetracking/today-hours\`

### Leave Management Endpoints

#### Create Leave Request
\`POST /api/v1/leave\`

\`\`\`json
{
  "leaveTypeId": "leave-type-id",
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "reason": "Personal leave"
}
\`\`\`

#### Get Leave Requests
\`GET /api/v1/leave\`

#### Approve Leave Request
\`POST /api/v1/leave/:leaveRequestId/approve\`

#### Reject Leave Request
\`POST /api/v1/leave/:leaveRequestId/reject\`

\`\`\`json
{
  "rejectionReason": "Insufficient balance"
}
\`\`\`

### Task Management Endpoints

#### Create Task
\`POST /api/v1/tasks\`

\`\`\`json
{
  "title": "Complete project",
  "description": "Finish the frontend implementation",
  "assignedToId": "user-id",
  "dueDate": "2024-02-01",
  "priority": "high",
  "tags": ["frontend", "urgent"]
}
\`\`\`

#### Get Tasks
\`GET /api/v1/tasks?status=in_progress\`

#### Update Task
\`PUT /api/v1/tasks/:taskId\`

#### Complete Task
\`POST /api/v1/tasks/:taskId/complete\`

#### Add Task Comment
\`POST /api/v1/tasks/:taskId/comments\`

\`\`\`json
{
  "content": "Great progress on this task!"
}
\`\`\`

### Asset Management Endpoints

#### Create Asset
\`POST /api/v1/assets\`

\`\`\`json
{
  "name": "MacBook Pro 14",
  "category": "laptop",
  "description": "Company laptop",
  "serialNumber": "ABC123456",
  "purchaseDate": "2023-01-01",
  "purchaseCost": 150000,
  "vendor": "Apple"
}
\`\`\`

#### Get Assets
\`GET /api/v1/assets?category=laptop\`

#### Assign Asset
\`POST /api/v1/assets/:assetId/assign\`

\`\`\`json
{
  "userId": "user-id",
  "notes": "Issued to new employee"
}
\`\`\`

#### Return Asset
\`POST /api/v1/assets/:assignmentId/return\`

\`\`\`json
{
  "condition": "good"
}
\`\`\`

### Announcement Endpoints

#### Create Announcement
\`POST /api/v1/announcements\`

\`\`\`json
{
  "title": "Company Announcement",
  "content": "Important information for all employees",
  "category": "important",
  "priority": "high"
}
\`\`\`

#### Get Announcements
\`GET /api/v1/announcements\`

#### Mark as Viewed
\`POST /api/v1/announcements/:announcementId/view\`

### Performance Management Endpoints

#### Create Review
\`POST /api/v1/performance/:userId/reviews\`

\`\`\`json
{
  "type": "manager",
  "title": "Q4 2024 Performance Review",
  "content": "Great performance this quarter",
  "strengths": ["Communication", "Team work"],
  "improvements": ["Time management"],
  "overallRating": 4.5
}
\`\`\`

#### Get Reviews
\`GET /api/v1/performance/:userId/reviews\`

#### Create Goal
\`POST /api/v1/performance/goals\`

\`\`\`json
{
  "title": "Complete training",
  "description": "Complete advanced JavaScript training",
  "target": "100%",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31",
  "quarter": "Q1",
  "year": 2024
}
\`\`\`

#### Get Goals
\`GET /api/v1/performance/goals?status=active\`

## Multi-Tenant Architecture

Each tenant (company) has:

1. **Master Database**: Stores tenant information and manages authentication
2. **Isolated Tenant Database**: Contains all tenant-specific data
   - Users and permissions
   - Time entries
   - Leave requests
   - Tasks
   - Assets
   - Performance data
   - Announcements

### Creating a New Tenant

When a company signs up:

1. A new record is created in the master database
2. A new PostgreSQL database is automatically created
3. Prisma schema is applied to the new database
4. Admin user is created with default permissions
5. Default leave types and departments are initialized

## Deployment

### AWS EC2 Setup

1. **Launch EC2 Instance**
   - AMI: Ubuntu 20.04 LTS
   - Instance Type: t2.medium or higher
   - Storage: 20GB+ EBS

2. **Install Dependencies**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y nodejs npm postgresql postgresql-contrib
   ```

3. **Clone Repository**
   ```bash
   cd /opt
   git clone <repository-url>
   cd backend
   npm install
   ```

4. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

5. **Setup PM2 for Process Management**
   ```bash
   sudo npm install -g pm2
   npm run build
   pm2 start dist/index.js --name "postakel-api"
   pm2 startup
   pm2 save
   ```

6. **Configure Nginx Reverse Proxy**
   ```nginx
   server {
     listen 80;
     server_name api.yourdomain.com;

     location / {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Frontend Deployment (Vercel)

The frontend is deployed separately on Vercel at `https://yourdomain.vercel.app`

Update `FRONTEND_PRODUCTION_URL` in backend `.env` after deployment.

## Error Handling

The API returns standardized JSON responses:

### Success Response
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2024-01-01T12:00:00Z"
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-01-01T12:00:00Z"
}
\`\`\`

## Testing

\`\`\`bash
npm run test
\`\`\`

## Contributing

1. Create a feature branch: \`git checkout -b feature/feature-name\`
2. Commit changes: \`git commit -am 'Add feature'\`
3. Push to branch: \`git push origin feature/feature-name\`
4. Submit a pull request

## Support

For issues and questions, please contact: support@postakel.com

## License

MIT License - See LICENSE file for details

## Contact

- Website: https://postakel.com
- Email: info@postakel.com
- Support: support@postakel.com
