# Email Service Placeholder - Integration Guide

## Overview

The `EmailService` has been converted to a **placeholder implementation** that logs email events instead of sending them. This allows you to integrate with Twilio later without breaking the application.

## Current Implementation

All email functions now log to console with the `[EMAIL PLACEHOLDER]` prefix.

### Email Functions

#### 1. `sendWelcomeEmail()`
```typescript
static async sendWelcomeEmail(email: string, name: string, tenantName: string, tempPassword: string)
```
**Logged as:** `[EMAIL PLACEHOLDER] Welcome email for {email}`
**Use Case:** New employee account creation

#### 2. `sendPasswordResetEmail()`
```typescript
static async sendPasswordResetEmail(email: string, resetLink: string)
```
**Logged as:** `[EMAIL PLACEHOLDER] Password reset email for {email}`
**Use Case:** Password recovery requests

#### 3. `sendLeaveApprovalEmail()`
```typescript
static async sendLeaveApprovalEmail(email: string, employeeName: string, leaveType: string, startDate: string, endDate: string, status: string)
```
**Logged as:** `[EMAIL PLACEHOLDER] Leave approval email for {email}`
**Use Case:** Leave request approvals/rejections

#### 4. `sendTaskAssignmentEmail()`
```typescript
static async sendTaskAssignmentEmail(email: string, taskTitle: string, assignedByName: string, dueDate: string)
```
**Logged as:** `[EMAIL PLACEHOLDER] Task assignment email for {email}`
**Use Case:** New task assignments

#### 5. `sendAnnouncementEmail()`
```typescript
static async sendAnnouncementEmail(email: string, announcementTitle: string, announcementContent: string)
```
**Logged as:** `[EMAIL PLACEHOLDER] Announcement email for {email}`
**Use Case:** Company announcements and notifications

## Where Email Service is Called

The EmailService is called in the following locations:

### User Creation
**File:** `src/services/UserAuthService.ts`
```typescript
await EmailService.sendWelcomeEmail(email, name, tenantName, tempPassword);
```

### Leave Request Operations
**File:** `src/services/LeaveService.ts`
```typescript
await EmailService.sendLeaveApprovalEmail(...);
// OR
await EmailService.sendLeaveApprovalEmail(...); // for rejection
```

### Task Assignment
**File:** `src/services/TaskService.ts`
```typescript
await EmailService.sendTaskAssignmentEmail(...);
```

### Announcements
**File:** `src/services/AnnouncementService.ts`
```typescript
await EmailService.sendAnnouncementEmail(...);
```

## How to Integrate Twilio

When your Twilio backend is ready, follow these steps:

### Step 1: Install Twilio SDK
```bash
npm install twilio
npm install --save-dev @types/twilio
```

### Step 2: Add Twilio Configuration
Update `.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_EMAIL=noreply@yourdomain.com
```

Update `src/config/index.ts`:
```typescript
export const config = {
  // ... existing config
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_from_email: process.env.TWILIO_FROM_EMAIL,
};
```

### Step 3: Update EmailService
Replace the placeholder implementation:

```typescript
import twilio from 'twilio';
import { config } from '../config';

export class EmailService {
  private static twilioClient = twilio(
    config.twilio_account_sid,
    config.twilio_auth_token
  );

  static async sendWelcomeEmail(
    email: string,
    name: string,
    tenantName: string,
    tempPassword: string
  ) {
    try {
      await this.twilioClient.messages.create({
        from: config.twilio_from_email,
        to: email,
        subject: `Welcome to ${tenantName} - Postakel`,
        body: `
          Hello ${name},
          
          Your account has been created on Postakel.
          
          Login Details:
          Email: ${email}
          Temporary Password: ${tempPassword}
          
          Please change your password immediately after logging in.
        `,
      });
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  static async sendPasswordResetEmail(email: string, resetLink: string) {
    try {
      await this.twilioClient.messages.create({
        from: config.twilio_from_email,
        to: email,
        subject: 'Password Reset Request - Postakel',
        body: `
          Password Reset Request
          
          Click the link below to reset your password:
          ${resetLink}
          
          This link expires in 1 hour.
        `,
      });
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  static async sendLeaveApprovalEmail(
    email: string,
    employeeName: string,
    leaveType: string,
    startDate: string,
    endDate: string,
    status: string
  ) {
    try {
      await this.twilioClient.messages.create({
        from: config.twilio_from_email,
        to: email,
        subject: `Leave Request ${status} - Postakel`,
        body: `
          Leave Request ${status.toUpperCase()}
          
          Hello ${employeeName},
          
          Your ${leaveType} leave request from ${startDate} to ${endDate} 
          has been ${status}.
        `,
      });
      console.log(`Leave email sent to ${email}`);
    } catch (error) {
      console.error('Error sending leave email:', error);
      throw error;
    }
  }

  static async sendTaskAssignmentEmail(
    email: string,
    taskTitle: string,
    assignedByName: string,
    dueDate: string
  ) {
    try {
      await this.twilioClient.messages.create({
        from: config.twilio_from_email,
        to: email,
        subject: 'New Task Assigned - Postakel',
        body: `
          New Task Assigned
          
          Task: ${taskTitle}
          Assigned by: ${assignedByName}
          Due Date: ${dueDate}
        `,
      });
      console.log(`Task assignment email sent to ${email}`);
    } catch (error) {
      console.error('Error sending task email:', error);
      throw error;
    }
  }

  static async sendAnnouncementEmail(
    email: string,
    announcementTitle: string,
    announcementContent: string
  ) {
    try {
      await this.twilioClient.messages.create({
        from: config.twilio_from_email,
        to: email,
        subject: `New Announcement - Postakel`,
        body: `
          ${announcementTitle}
          
          ${announcementContent}
        `,
      });
      console.log(`Announcement email sent to ${email}`);
    } catch (error) {
      console.error('Error sending announcement email:', error);
      throw error;
    }
  }
}
```

### Step 4: Test
```bash
npm run dev
# Create a new user and verify email logs appear
```

### Step 5: Deploy
No other files need changes! The same integration points will now send real emails.

## Debugging Email Events

While using the placeholder, you can track all email events:

```bash
# Run backend in development
npm run dev

# You'll see output like:
# [EMAIL PLACEHOLDER] Welcome email for john@example.com
# Name: John Doe, Tenant: Acme Corp, Temp Password: abc123def456
```

All email functions are called from the same locations, so when you switch to Twilio, all emails will be sent automatically.

## Important Notes

1. **Function Signatures:** Never change the function signatures or parameter order
2. **Error Handling:** All functions maintain error handling behavior
3. **Backward Compatible:** Switching from placeholder to Twilio requires only EmailService.ts changes
4. **No Configuration Required:** Currently needs no email config in .env
5. **Logging:** Console logs help debug which emails should have been sent

## Testing Checklist

When implementing Twilio integration:

- ✅ Add Twilio dependencies
- ✅ Update .env with Twilio credentials
- ✅ Update config/index.ts
- ✅ Implement EmailService methods
- ✅ Test with user creation (welcome email)
- ✅ Test with leave requests (approval/rejection emails)
- ✅ Test with task assignments
- ✅ Test with announcements
- ✅ Verify all emails received
- ✅ Check email formatting

## Summary

The EmailService placeholder is a **temporary, non-breaking solution** that:
- ✅ Allows development without Twilio setup
- ✅ Logs all email events for debugging
- ✅ Maintains function signatures for easy integration
- ✅ Requires only EmailService.ts changes for Twilio
- ✅ Will not cause any breaking changes to the system
