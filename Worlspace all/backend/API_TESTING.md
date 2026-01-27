# API Testing Guide

This guide provides examples for testing all API endpoints. You can use these with Postman, cURL, or any API testing tool.

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1. Authentication Endpoints

### Register Tenant
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Acme Corporation",
  "email": "admin@acme.com",
  "password": "SecurePassword123!",
  "plan": "starter",
  "industry": "Technology",
  "companySize": "50-100"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tenant registered successfully",
  "data": {
    "tenantId": "cuid-123",
    "subdomain": "acme-corporation",
    "name": "Acme Corporation",
    "email": "admin@acme.com",
    "plan": "starter"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "subdomain": "acme-corporation",
  "email": "admin@acme.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "admin@acme.com",
      "name": "Admin User",
      "role": "admin",
      "avatar": null
    }
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Change Password
```http
POST /auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

---

## 2. User Management Endpoints

### Create User (Admin Only)
```http
POST /users
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "email": "john.doe@acme.com",
  "password": "InitialPassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9876543210",
  "role": "employee",
  "department": "Engineering",
  "title": "Senior Developer",
  "employmentType": "full-time",
  "startDate": "2024-01-15"
}
```

### Get All Users
```http
GET /users
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get User by ID
```http
GET /users/user-123
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update User
```http
PUT /users/user-123
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Principal Engineer",
  "department": "R&D",
  "phone": "+91-9876543211"
}
```

### Delete User (Admin Only)
```http
DELETE /users/user-123
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 3. Time Tracking Endpoints

### Clock In
```http
POST /timetracking/clock-in
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "location": "Office",
  "project": "Project Alpha",
  "description": "Starting daily standup"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "entry-123",
    "userId": "user-123",
    "checkInTime": "2024-01-15T09:00:00Z",
    "location": "Office",
    "project": "Project Alpha"
  }
}
```

### Start Break
```http
POST /timetracking/entry-123/break-start
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "type": "lunch",
  "notes": "Going for lunch"
}
```

**Break Types:** `coffee`, `lunch`, `personal`, `meeting`

### End Break
```http
POST /timetracking/break-456/break-end
Authorization: Bearer YOUR_JWT_TOKEN
```

### Clock Out
```http
POST /timetracking/entry-123/clock-out
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Time Entries
```http
GET /timetracking?userId=user-123
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Today Hours
```http
GET /timetracking/today-hours
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 4. Leave Management Endpoints

### Create Leave Request
```http
POST /leave
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "leaveTypeId": "leave-type-123",
  "startDate": "2024-02-10",
  "endDate": "2024-02-12",
  "reason": "Personal emergency"
}
```

### Get Leave Requests
```http
GET /leave?userId=user-123
Authorization: Bearer YOUR_JWT_TOKEN
```

### Approve Leave Request (Manager/Admin)
```http
POST /leave/leave-request-123/approve
Authorization: Bearer YOUR_JWT_TOKEN
```

### Reject Leave Request (Manager/Admin)
```http
POST /leave/leave-request-123/reject
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "rejectionReason": "Insufficient leave balance"
}
```

### Create Leave Type (Admin)
```http
POST /leave/types
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Annual Leave",
  "description": "Paid annual leave",
  "daysPerYear": 20,
  "carryOver": 5,
  "requiresApproval": true
}
```

---

## 5. Task Management Endpoints

### Create Task
```http
POST /tasks
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Implement authentication module",
  "description": "Complete JWT-based authentication system",
  "assignedToId": "user-456",
  "dueDate": "2024-02-28",
  "priority": "high",
  "project": "Backend System",
  "tags": ["backend", "security"]
}
```

**Priority:** `low`, `medium`, `high`, `urgent`
**Status:** `todo`, `in_progress`, `in_review`, `done`

### Get Tasks
```http
GET /tasks?status=in_progress&userId=user-456
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Task
```http
PUT /tasks/task-123
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "high"
}
```

### Complete Task
```http
POST /tasks/task-123/complete
Authorization: Bearer YOUR_JWT_TOKEN
```

### Add Task Comment
```http
POST /tasks/task-123/comments
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "content": "Great progress! Please add unit tests."
}
```

---

## 6. Asset Management Endpoints

### Create Asset
```http
POST /assets
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "MacBook Pro 14-inch",
  "category": "laptop",
  "description": "Company issued laptop for development",
  "serialNumber": "ABC123DEF456",
  "purchaseDate": "2023-01-15",
  "purchaseCost": 150000,
  "vendor": "Apple",
  "warrantyExpiry": "2026-01-15",
  "location": "Headquarters"
}
```

**Categories:** `laptop`, `phone`, `furniture`, `other`

### Get Assets
```http
GET /assets?category=laptop
Authorization: Bearer YOUR_JWT_TOKEN
```

### Assign Asset
```http
POST /assets/asset-123/assign
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "user-789",
  "notes": "Assigned to new employee"
}
```

### Return Asset
```http
POST /assets/assignment-123/return
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "condition": "good"
}
```

**Condition:** `good`, `fair`, `damaged`

---

## 7. Announcement Endpoints

### Create Announcement
```http
POST /announcements
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Company Expansion Announcement",
  "content": "We're excited to announce our expansion into new markets!",
  "category": "important",
  "priority": "high",
  "expiresAt": "2024-02-28"
}
```

**Category:** `general`, `important`, `event`, `policy`
**Priority:** `low`, `normal`, `high`, `urgent`

### Get Announcements
```http
GET /announcements
Authorization: Bearer YOUR_JWT_TOKEN
```

### Mark as Viewed
```http
POST /announcements/announcement-123/view
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 8. Performance Management Endpoints

### Create Review
```http
POST /performance/user-123/reviews
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "type": "manager",
  "title": "Q4 2024 Performance Review",
  "content": "Exceptional performance this quarter with great team collaboration.",
  "strengths": ["Communication", "Problem Solving", "Teamwork"],
  "improvements": ["Time Management", "Documentation"],
  "overallRating": 4.5
}
```

**Review Type:** `self`, `manager`, `peer`, `360`

### Get Reviews
```http
GET /performance/user-123/reviews
Authorization: Bearer YOUR_JWT_TOKEN
```

### Create Goal
```http
POST /performance/goals
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Complete Advanced TypeScript Training",
  "description": "Master advanced TypeScript patterns and concepts",
  "target": "100%",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31",
  "quarter": "Q1",
  "year": 2024
}
```

### Get Goals
```http
GET /performance/goals?status=active
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Testing Workflow

### 1. Register & Login
```bash
# Register tenant
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Company","email":"admin@test.com","password":"Test123!","plan":"starter"}'

# Login and get token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"subdomain":"test-company","email":"admin@test.com","password":"Test123!"}'

# Copy the token from response
TOKEN="YOUR_TOKEN_HERE"
```

### 2. Create Employee
```bash
curl -X POST http://localhost:5000/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@test.com",
    "password":"John123!",
    "firstName":"John",
    "lastName":"Doe",
    "role":"employee",
    "department":"Engineering"
  }'
```

### 3. Employee Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"subdomain":"test-company","email":"john@test.com","password":"John123!"}'
```

### 4. Test Time Tracking
```bash
curl -X POST http://localhost:5000/api/v1/timetracking/clock-in \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"location":"Office"}'
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email already exists",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## Tips for Testing

1. **Use Postman**: Import these requests into Postman for easy testing
2. **Save Tokens**: Store JWT tokens for subsequent requests
3. **Test Order**: Register → Login → Create Users → Test Features
4. **Check Status Codes**: 200/201 for success, 400+ for errors
5. **Verify Data**: Check database for created records
6. **Use Different Roles**: Test with admin and employee accounts

---

## Postman Collection Import

Create a new Postman collection and import these requests for organized API testing.
