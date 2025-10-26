# Role-Based Access Control (RBAC) Guide

Complete guide for implementing and using role-based permissions in the ESOL learning platform.

## Table of Contents

1. [Overview](#overview)
2. [User Roles](#user-roles)
3. [Route Protection](#route-protection)
4. [Component-Level Permissions](#component-level-permissions)
5. [Server Actions Permissions](#server-actions-permissions)
6. [Best Practices](#best-practices)

## Overview

The platform implements a comprehensive RBAC system with:
- **6 user roles** with hierarchical permissions
- **Server-side route protection** for layouts
- **Client-side permission checks** for UI elements
- **Resource-based permissions** for data access

## User Roles

### Role Hierarchy (highest to lowest)
```
system_admin → school_admin → department_head → teacher → student, parent
```

### Role Definitions

| Role | Description | Dashboard Route |
|------|-------------|----------------|
| `student` | End users learning English | `/dashboard` |
| `teacher` | Teachers managing classes | `/teacher/dashboard` |
| `parent` | Parents monitoring children | `/parent/dashboard` |
| `department_head` | Department managers | `/department/dashboard` |
| `school_admin` | School administrators | `/admin/dashboard` |
| `system_admin` | Platform administrators | `/system/dashboard` |

## Route Protection

### Server-Side Protection (Layouts)

All dashboard layouts are protected using the `RoleGuard` component:

```tsx
// src/app/(main)/teacher/layout.tsx
import { RoleGuard } from "@/components/auth/role-guard";

export default async function TeacherLayout({ children }) {
  return (
    <RoleGuard allowedRoles={["teacher", "school_admin", "system_admin"]}>
      {/* Layout content */}
    </RoleGuard>
  );
}
```

**Current Protected Routes:**
- ✅ `/dashboard` - Student only
- ✅ `/teacher/*` - Teacher, school_admin, system_admin
- ✅ `/parent/*` - Parent, school_admin, system_admin
- ✅ `/department/*` - Department head, school_admin, system_admin
- ✅ `/admin/*` - School admin, system_admin
- ✅ `/system/*` - System admin only

### Client-Side Protection (Pages)

For client components, use the `withRoleProtection` HOC:

```tsx
// src/app/(main)/some-page/page.tsx
"use client";

import { withTeacherProtection } from "@/lib/auth/route-protection";

function TeacherOnlyPage() {
  return <div>Teacher Content</div>;
}

export default withTeacherProtection(TeacherOnlyPage);
```

**Available Protection HOCs:**
- `withStudentProtection` - Student only
- `withTeacherProtection` - Teacher + admins
- `withParentProtection` - Parent + admins
- `withDepartmentHeadProtection` - Department head + admins
- `withSchoolAdminProtection` - School admin + system admin
- `withSystemAdminProtection` - System admin only

## Component-Level Permissions

### Using the `usePermissions` Hook

For conditional UI rendering based on permissions:

```tsx
"use client";

import { usePermissions } from "@/hooks/use-permissions";

export function AssignmentActions() {
  const { checkPermission, isTeacher, isAdmin } = usePermissions();

  return (
    <div>
      {/* Check specific permission */}
      {checkPermission("assignments", "create") && (
        <button>Create Assignment</button>
      )}

      {/* Check role */}
      {isTeacher() && (
        <button>Grade Submissions</button>
      )}

      {/* Check admin status */}
      {isAdmin() && (
        <button>View All Assignments</button>
      )}
    </div>
  );
}
```

### Available Hook Methods

```typescript
const {
  // User info
  user,                    // Stack Auth user object
  userRole,                // Current user's role

  // Permission checks
  checkPermission,         // (resource, action) => boolean
  getScope,                // (resource, action) => scope
  canAccess,               // (targetRole) => boolean
  hasRole,                 // (...roles) => boolean

  // Role helpers
  isAdmin,                 // () => boolean
  isSystemAdmin,           // () => boolean
  isSchoolAdmin,           // () => boolean
  isDepartmentHead,        // () => boolean
  isTeacher,               // () => boolean
  isStudent,               // () => boolean
  isParent,                // () => boolean
} = usePermissions();
```

## Server Actions Permissions

### Checking Permissions in Server Actions

```typescript
// src/actions/example.ts
"use server";

import { fetchWithDrizzle } from "@/lib/db";
import { requirePermission } from "@/lib/auth/permissions";

export async function createAssignment(data: AssignmentData) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    // Validate organization context
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Check permission
    const userRole = enhancedUser.role as UserRole;
    requirePermission(userRole, "assignments", "create");

    // Proceed with action
    const [assignment] = await db
      .insert(schema.assignments)
      .values({
        ...data,
        teacherId: userId,
        organizationId,
      })
      .returning();

    return assignment;
  });
}
```

### Permission Helper Functions

```typescript
import {
  hasPermission,          // (role, resource, action) => boolean
  getPermissionScope,     // (role, resource, action) => scope | null
  requirePermission,      // (role, resource, action) => void (throws error)
  canAccessRole,          // (accessorRole, targetRole) => boolean
} from "@/lib/auth/permissions";
```

## Resource Types

Available resources for permission checks:

```typescript
type Resource =
  | "students"
  | "classes"
  | "assignments"
  | "diagnostic_tests"
  | "recordings"
  | "transcriptions"
  | "insights"
  | "analytics"
  | "users"
  | "organizations"
  | "question_banks";
```

## Action Types

Available actions for permission checks:

```typescript
type Action =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "assign"
  | "review"
  | "manage";  // Full access (create, read, update, delete)
```

## Permission Scopes

Data access is scoped based on role:

```typescript
type PermissionScope =
  | "system"       // Access across all organizations (system_admin)
  | "organization" // Access within own organization
  | "department"   // Access within own department
  | "class"        // Access within own classes
  | "own";         // Access to own resources only
```

## Best Practices

### 1. Always Validate Organization Context

```typescript
export async function myServerAction() {
  return fetchWithDrizzle(async (db, { organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }
    // ... rest of action
  });
}
```

### 2. Use Role Guards in Layouts

Protect entire route sections in `layout.tsx`:

```tsx
<RoleGuard allowedRoles={["teacher", "school_admin", "system_admin"]}>
  {children}
</RoleGuard>
```

### 3. Conditional UI with Permissions Hook

Hide/show UI elements based on permissions:

```tsx
const { checkPermission } = usePermissions();

{checkPermission("assignments", "create") && (
  <CreateAssignmentButton />
)}
```

### 4. Validate Permissions in Server Actions

Always check permissions before database operations:

```typescript
const userRole = enhancedUser.role as UserRole;
requirePermission(userRole, "assignments", "update");
```

### 5. Follow the Principle of Least Privilege

Only grant the minimum permissions needed:
- Students can only access their own data
- Teachers can access their class data
- Admins have broader access

## Examples

### Example 1: Teacher-Only Assignment Creation

**Layout Protection:**
```tsx
// src/app/(main)/teacher/assignments/layout.tsx
<RoleGuard allowedRoles={["teacher", "school_admin", "system_admin"]}>
  {children}
</RoleGuard>
```

**Component Permission Check:**
```tsx
// src/app/(main)/teacher/assignments/page.tsx
"use client";

import { usePermissions } from "@/hooks/use-permissions";

export default function AssignmentsPage() {
  const { checkPermission } = usePermissions();

  return (
    <div>
      <h1>Assignments</h1>
      {checkPermission("assignments", "create") && (
        <CreateAssignmentButton />
      )}
    </div>
  );
}
```

**Server Action:**
```typescript
// src/actions/assignments.ts
export async function createAssignment(data: AssignmentData) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const userRole = enhancedUser.role as UserRole;
    requirePermission(userRole, "assignments", "create");

    const [assignment] = await db
      .insert(schema.assignments)
      .values({ ...data, teacherId: userId, organizationId })
      .returning();

    return assignment;
  });
}
```

### Example 2: Admin-Only User Management

**Route Protection:**
```tsx
// src/app/(main)/admin/users/layout.tsx
<RoleGuard allowedRoles={["school_admin", "system_admin"]}>
  {children}
</RoleGuard>
```

**UI Permission Check:**
```tsx
"use client";

import { usePermissions } from "@/hooks/use-permissions";

export function UserManagement() {
  const { isAdmin, checkPermission } = usePermissions();

  if (!isAdmin()) {
    return <AccessDenied />;
  }

  return (
    <div>
      {checkPermission("users", "create") && (
        <InviteUserButton />
      )}
      {checkPermission("users", "manage") && (
        <DeleteUserButton />
      )}
    </div>
  );
}
```

## Troubleshooting

### User Not Redirecting After Role Check

Ensure `RoleGuard` is used in the layout, not the page:

```tsx
// ✅ Correct - in layout.tsx
export default async function Layout({ children }) {
  return (
    <RoleGuard allowedRoles={["teacher"]}>
      {children}
    </RoleGuard>
  );
}

// ❌ Incorrect - in page.tsx (server component)
// Use client-side withRoleProtection instead
```

### Permission Checks Always Return False

Check that the user's role is properly set in Stack Auth:

```tsx
const user = useUser();
console.log("User role:", user?.clientMetadata?.role);
```

### Organization Context Missing

All Server Actions must use `fetchWithDrizzle`:

```typescript
// ✅ Correct
export async function myAction() {
  return fetchWithDrizzle(async (db, { organizationId }) => {
    if (!organizationId) throw new Error("Organization context required");
    // ...
  });
}

// ❌ Incorrect
export async function myAction() {
  const db = drizzle(...); // Missing organization context
}
```

## Security Considerations

1. **Defense in Depth**: Implement permissions at multiple layers:
   - Route protection (layouts)
   - UI rendering (components)
   - Data access (server actions)

2. **Server-Side Validation**: Always validate permissions server-side, even if UI is hidden

3. **Organization Isolation**: All queries must filter by `organizationId`

4. **Role Hierarchy**: Higher roles can access lower role resources (system_admin > school_admin > etc.)

5. **Audit Logging**: Consider logging all permission failures for security monitoring

## Migration Guide

To add permissions to an existing feature:

1. **Add Layout Protection**:
   ```tsx
   <RoleGuard allowedRoles={["your_role"]}>
   ```

2. **Update UI Components**:
   ```tsx
   const { checkPermission } = usePermissions();
   {checkPermission("resource", "action") && <Button />}
   ```

3. **Add Server Action Checks**:
   ```typescript
   requirePermission(userRole, "resource", "action");
   ```

4. **Test Each Role**: Verify each role can/cannot access as expected

---

**Last Updated**: 2025-01-26

For more information, see:
- `src/lib/auth/permissions.ts` - Permission definitions
- `src/lib/auth/route-protection.tsx` - Route protection HOCs
- `src/hooks/use-permissions.ts` - Permission checking hook
- `src/components/auth/role-guard.tsx` - Server-side role guard
