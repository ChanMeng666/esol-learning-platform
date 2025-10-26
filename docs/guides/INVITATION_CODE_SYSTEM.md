# Invitation Code System - Complete Guide

## Overview

The invitation code system provides role-based registration for the ESOL Platform. It ensures that:
- Every new user is associated with an organization
- Users automatically receive the correct role (student, teacher, parent, school_admin)
- Organizations can control who can register and join their platform

## System Architecture

### 1. Database Tables

**invitation_codes** - Stores invitation codes and their properties
- `code` - Unique invitation code (format: PREFIX-RANDOM-CHECKSUM)
- `organization_id` - Organization this code belongs to
- `role` - Role to assign (student/teacher/parent/school_admin)
- `type` - Code type (organization_general/teacher_specific/parent_specific)
- `max_uses` - Maximum number of times code can be used (null = unlimited)
- `used_count` - How many times code has been used
- `expires_at` - Expiration date (null = never expires)
- `is_active` - Whether code is currently active

**invitation_usages** - Tracks who used which codes
- `invitation_code_id` - Reference to the invitation code
- `user_id` - User who used the code
- `organization_id` - Organization context
- `used_at` - Timestamp of usage
- `ip_address` - User's IP address (optional)
- `user_agent` - User's browser info (optional)

### 2. Code Generation

**Format**: `PREFIX-RANDOM-CHECKSUM`

Examples:
- `SCHOOL-ABC123-X7` - Student code for organization
- `TEACHER-DEF456-Y2` - Teacher-specific code
- `PARENT-GHI789-Z5` - Parent-specific code

**Checksum Validation**:
- Each code includes a checksum character to prevent typos
- Invalid codes are rejected before database lookup

### 3. Code Types

**organization_general** (Reusable)
- For student registration
- Can be used multiple times
- Typically shared with all prospective students
- Example: School website displays "Use code SCHOOL-ABC123-X7 to register"

**teacher_specific** (Limited)
- For teacher registration
- Limited uses (e.g., max 50 teachers)
- Sent individually to verified teachers
- Example: "Welcome aboard! Use code TEACHER-DEF456-Y2"

**parent_specific** (One-time)
- For parent registration
- Usually one-time use
- Linked to specific students later by teachers/admins
- Example: Email to parent with unique code

## Admin Interface

Access: `/admin/invitations`

### Creating Invitation Codes

1. Click **"Create Invitation Code"** button
2. Select:
   - **Role**: student, teacher, parent, school_admin
   - **Type**: organization_general, teacher_specific, parent_specific
   - **Max Uses** (optional): Leave empty for unlimited
   - **Expires In** (days, optional): Leave empty for never expires
   - **Custom Prefix** (optional): Custom code prefix (e.g., "SPRING2024")

3. Click **"Create Code"**
4. Code is generated and displayed in the table

### Managing Codes

**Copy Code**: Click copy icon to copy code to clipboard

**View Stats**: Click eye icon to see:
- Total uses
- Remaining uses
- Usage history with user details

**Deactivate/Reactivate**: Click ban/check icon to toggle active status

**Delete**: Click trash icon (only for unused codes)

## Registration Flow

### For End Users

1. **Visit Homepage** → Click "Get Started Free"
2. **Enter Invitation Code** → `/register` page
   - Enter code (e.g., SCHOOL-ABC123-X7)
   - Code is validated in real-time
   - Shows organization name and role if valid
3. **Stack Auth Signup** → Standard registration form
   - Email, password, name
   - No role selection (automatic)
4. **Post-Registration Processing** → `/auth/callback`
   - Enhanced user record created
   - Linked to organization
   - Role assigned automatically
   - Invitation usage recorded
   - NZCEL & CEFR progress initialized
5. **Redirect to Dashboard** → Role-based dashboard

### For Admins Testing

#### Test Student Registration

1. Go to `/admin/invitations`
2. Create invitation code:
   - Role: `student`
   - Type: `organization_general`
   - Max Uses: empty (unlimited)
   - Expires In: empty (never)
   - Custom Prefix: `TESTSTUDENT`
3. Copy the generated code (e.g., `TESTSTUDENT-ABC123-X7`)
4. Open incognito window
5. Go to homepage → "Get Started Free"
6. Enter code → Continue
7. Complete Stack Auth registration
8. Verify:
   - Redirected to student dashboard
   - Role is "student"
   - Organization is correct
   - Progress tracking initialized

#### Test Teacher Registration

1. Create invitation code:
   - Role: `teacher`
   - Type: `teacher_specific`
   - Max Uses: `1` (one-time)
   - Custom Prefix: `TESTTEACHER`
2. Copy code
3. Open incognito window
4. Register with code
5. Verify:
   - Redirected to teacher dashboard
   - Role is "teacher"
   - Can create classes/assignments

#### Test Parent Registration

1. Create invitation code:
   - Role: `parent`
   - Type: `parent_specific`
   - Max Uses: `1`
   - Custom Prefix: `TESTPARENT`
2. Register with code
3. Verify:
   - Role is "parent"
   - Can view linked students (after admin links them)

## Server Actions Reference

### Creating Codes

```typescript
import { createInvitationCode } from "@/actions/invitations";

await createInvitationCode({
  role: "student",
  type: "organization_general",
  maxUses: null, // unlimited
  expiresAt: null, // never expires
  customPrefix: "SPRING2024",
});
```

### Validating Codes (Public)

```typescript
import { validateInvitationCode } from "@/actions/invitations";

try {
  const invitation = await validateInvitationCode("SCHOOL-ABC123-X7");
  // { id, code, role, organizationId, organizationName }
} catch (error) {
  // Invalid code
}
```

### Recording Usage

```typescript
import { useInvitationCode } from "@/actions/invitations";

await useInvitationCode(
  invitationCodeId,
  userId,
  organizationId,
  ipAddress,
  userAgent
);
```

### Getting Organization Codes

```typescript
import { getOrganizationInvitationCodes } from "@/actions/invitations";

const codes = await getOrganizationInvitationCodes();
// Returns all codes for current user's organization
```

## Security Features

### Multi-Tenant Isolation
- All codes are scoped to organizations
- Users can only see codes from their organization
- Validation checks organization is active

### Checksum Validation
- Prevents accidental typos
- Invalid format rejected before database query

### Permission Checks
- Only school_admin, system_admin, and teachers can create codes
- Only school_admin and system_admin can deactivate/delete codes

### Expiration & Usage Limits
- Codes can expire after a date
- Codes can have usage limits
- Inactive codes are rejected

### Audit Trail
- Every code usage is recorded
- IP address and user agent tracked
- Usage history available for review

## Troubleshooting

### "Invalid invitation code format"
- Check code format: must be PREFIX-RANDOM-CHECKSUM
- Ensure no spaces or special characters
- Try copying code again

### "Invitation code not found"
- Code might be deleted
- Check for typos
- Verify code is for correct organization

### "This invitation code has been deactivated"
- Admin deactivated the code
- Request new code from admin

### "This invitation code has expired"
- Code past expiration date
- Request new code from admin

### "This invitation code has reached its usage limit"
- Max uses reached
- Request new code or ask admin to increase limit

### "Organization context required"
- User not authenticated
- Session expired
- Try signing in again

## Best Practices

### For Organizations

1. **Student Codes**
   - Use `organization_general` type
   - Set no expiration for ongoing enrollment
   - Display prominently on website
   - Example: "JOIN-OURSCHOOL-2024"

2. **Teacher Codes**
   - Use `teacher_specific` type
   - Set max uses to expected teacher count
   - Send individually via email
   - Set expiration (e.g., 30 days)
   - Example: "TEACHER-WELCOME-JOHN"

3. **Parent Codes**
   - Use `parent_specific` type
   - One-time use only
   - Generated when teacher invites parent
   - Example: "PARENT-STUDENT123-A5"

### Code Management

1. **Monitor Usage**
   - Check stats regularly
   - Track who's registering
   - Identify unused codes

2. **Deactivate Old Codes**
   - Deactivate instead of deleting (preserves history)
   - Create new codes periodically
   - Remove expired codes from public materials

3. **Naming Convention**
   - Use descriptive prefixes
   - Include year/season: SPRING2024
   - Include purpose: NEWSTUDENT, TRANSFER

## Future Enhancements

Potential improvements:
- Bulk code generation (create 100 codes at once)
- Code templates (save common configurations)
- Email integration (send codes directly)
- Class-specific codes (auto-enroll in specific class)
- Student-parent linking codes (link parent to specific student)
- QR code generation for easy mobile scanning
- Analytics dashboard (registration trends)

## Technical Details

### Files Modified/Created

**Database Schema**: `/src/lib/db/schema.ts`
- Added `invitation_codes` table
- Added `invitation_usages` table

**Server Actions**: `/src/actions/invitations.ts`
- `createInvitationCode()`
- `validateInvitationCode()`
- `useInvitationCode()`
- `getOrganizationInvitationCodes()`
- `getInvitationCodeStats()`
- `deactivateInvitationCode()`
- `reactivateInvitationCode()`
- `deleteInvitationCode()`

**Registration Flow**:
- `/src/app/register/page.tsx` - Invitation code input
- `/src/app/auth/callback/page.tsx` - Post-registration processing
- `/src/actions/registration.ts` - Registration completion logic

**Admin UI**: `/src/app/admin/invitations/page.tsx`

**Code Generation**: `/src/lib/invitations/code-generator.ts`
- `generateInvitationCode()`
- `validateCodeFormat()`
- `generateStudentCode()`
- `generateTeacherCode()`
- `generateParentCode()`

**Stack Auth Config**: `/src/lib/stack.ts`
- Updated `afterSignUp` URL to `/auth/callback`

### Integration Points

1. **Stack Auth** → Handles authentication
2. **Neon Database** → Stores codes and usage
3. **Enhanced User System** → Links to organization
4. **Role-Based Access Control** → Assigns correct permissions
5. **Progress Tracking** → Initializes NZCEL & CEFR progress

## Summary

The invitation code system provides:
✅ Secure, role-based registration
✅ Organization-scoped access control
✅ Usage tracking and analytics
✅ Flexible code types for different scenarios
✅ Complete audit trail
✅ Multi-tenant isolation
✅ Checksum validation
✅ Expiration and usage limits

This ensures every user is properly authenticated, authorized, and associated with the correct organization from the moment they register.
