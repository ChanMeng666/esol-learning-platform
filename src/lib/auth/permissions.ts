/**
 * Role-Based Access Control (RBAC) System
 * Defines permissions for each role in the platform
 */

export type UserRole =
  | "system_admin"
  | "school_admin"
  | "department_head"
  | "teacher"
  | "student"
  | "parent";

export type Resource =
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

export type Action = "create" | "read" | "update" | "delete" | "assign" | "review" | "manage";

export type PermissionScope =
  | "system" // Access across all organizations
  | "organization" // Access within own organization
  | "department" // Access within own department
  | "class" // Access within own classes
  | "own"; // Access to own resources only

export interface Permission {
  resource: Resource;
  action: Action;
  scope: PermissionScope;
  conditions?: Record<string, any>;
}

/**
 * Permission matrix defining what each role can do
 * Phase 1: Only teacher and student roles are fully implemented
 * Other roles are defined but not yet implemented
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // System Admin - Full access (not implemented in Phase 1)
  system_admin: [
    { resource: "students", action: "manage", scope: "system" },
    { resource: "classes", action: "manage", scope: "system" },
    { resource: "assignments", action: "manage", scope: "system" },
    { resource: "diagnostic_tests", action: "manage", scope: "system" },
    { resource: "recordings", action: "manage", scope: "system" },
    { resource: "transcriptions", action: "manage", scope: "system" },
    { resource: "insights", action: "manage", scope: "system" },
    { resource: "analytics", action: "manage", scope: "system" },
    { resource: "users", action: "manage", scope: "system" },
    { resource: "organizations", action: "manage", scope: "system" },
    { resource: "question_banks", action: "manage", scope: "system" },
  ],

  // School Admin - Organization-wide access (not implemented in Phase 1)
  school_admin: [
    { resource: "students", action: "manage", scope: "organization" },
    { resource: "classes", action: "manage", scope: "organization" },
    { resource: "assignments", action: "read", scope: "organization" },
    { resource: "diagnostic_tests", action: "manage", scope: "organization" },
    { resource: "recordings", action: "read", scope: "organization" },
    { resource: "transcriptions", action: "read", scope: "organization" },
    { resource: "insights", action: "read", scope: "organization" },
    { resource: "analytics", action: "read", scope: "organization" },
    { resource: "users", action: "manage", scope: "organization" },
    { resource: "question_banks", action: "manage", scope: "organization" },
  ],

  // Department Head - Department-wide access (not implemented in Phase 1)
  department_head: [
    { resource: "students", action: "read", scope: "department" },
    { resource: "classes", action: "manage", scope: "department" },
    { resource: "assignments", action: "read", scope: "department" },
    { resource: "diagnostic_tests", action: "read", scope: "organization" },
    { resource: "recordings", action: "read", scope: "department" },
    { resource: "transcriptions", action: "read", scope: "department" },
    { resource: "insights", action: "read", scope: "department" },
    { resource: "analytics", action: "read", scope: "department" },
    { resource: "users", action: "read", scope: "department" },
  ],

  // Teacher - Class-level access (FULLY IMPLEMENTED)
  teacher: [
    {
      resource: "students",
      action: "read",
      scope: "class",
      conditions: { must_be_enrolled_in_teacher_class: true },
    },
    { resource: "classes", action: "read", scope: "class" },
    { resource: "classes", action: "manage", scope: "class" },
    {
      resource: "assignments",
      action: "create",
      scope: "class",
      conditions: { can_assign_to_own_classes: true },
    },
    { resource: "assignments", action: "read", scope: "class" },
    { resource: "assignments", action: "update", scope: "class" },
    { resource: "assignments", action: "delete", scope: "class" },
    { resource: "assignments", action: "review", scope: "class" },
    { resource: "diagnostic_tests", action: "read", scope: "organization" },
    { resource: "diagnostic_tests", action: "assign", scope: "class" },
    {
      resource: "recordings",
      action: "read",
      scope: "class",
      conditions: { student_in_teacher_class: true },
    },
    {
      resource: "transcriptions",
      action: "read",
      scope: "class",
      conditions: { student_in_teacher_class: true },
    },
    { resource: "insights", action: "read", scope: "class" },
    { resource: "analytics", action: "read", scope: "class" },
  ],

  // Student - Own resources only (FULLY IMPLEMENTED)
  student: [
    { resource: "students", action: "read", scope: "own" },
    { resource: "students", action: "update", scope: "own" },
    { resource: "classes", action: "read", scope: "own" },
    { resource: "assignments", action: "read", scope: "own" },
    { resource: "assignments", action: "create", scope: "own" }, // Submit work
    { resource: "diagnostic_tests", action: "read", scope: "organization" },
    { resource: "diagnostic_tests", action: "create", scope: "own" }, // Take tests
    { resource: "recordings", action: "create", scope: "own" },
    { resource: "recordings", action: "read", scope: "own" },
    { resource: "transcriptions", action: "read", scope: "own" },
    { resource: "insights", action: "read", scope: "own" },
    { resource: "analytics", action: "read", scope: "own" },
  ],

  // Parent - Limited access to children's data (not implemented in Phase 1)
  parent: [
    {
      resource: "students",
      action: "read",
      scope: "own",
      conditions: { must_be_parent_of_student: true },
    },
    {
      resource: "classes",
      action: "read",
      scope: "own",
      conditions: { child_enrolled: true },
    },
    {
      resource: "assignments",
      action: "read",
      scope: "own",
      conditions: { child_assignment: true },
    },
    {
      resource: "diagnostic_tests",
      action: "read",
      scope: "own",
      conditions: { child_test: true },
    },
    {
      resource: "insights",
      action: "read",
      scope: "own",
      conditions: { child_insights: true },
    },
    {
      resource: "analytics",
      action: "read",
      scope: "own",
      conditions: { child_analytics: true },
    },
  ],
};

/**
 * Check if a user has permission to perform an action on a resource
 * @param userRole - The user's role
 * @param resource - The resource being accessed
 * @param action - The action being performed
 * @returns boolean indicating if the action is permitted
 */
export function hasPermission(
  userRole: UserRole,
  resource: Resource,
  action: Action
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];

  return rolePermissions.some(
    (permission) =>
      permission.resource === resource &&
      (permission.action === action || permission.action === "manage")
  );
}

/**
 * Get the scope for a specific permission
 * @param userRole - The user's role
 * @param resource - The resource being accessed
 * @param action - The action being performed
 * @returns PermissionScope or null if permission doesn't exist
 */
export function getPermissionScope(
  userRole: UserRole,
  resource: Resource,
  action: Action
): PermissionScope | null {
  const rolePermissions = ROLE_PERMISSIONS[userRole];

  const permission = rolePermissions.find(
    (p) =>
      p.resource === resource && (p.action === action || p.action === "manage")
  );

  return permission?.scope || null;
}

/**
 * Get all permissions for a role
 * @param userRole - The user's role
 * @returns Array of permissions
 */
export function getRolePermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole];
}

/**
 * Check if a role can access another role's resources
 * Hierarchy: system_admin > school_admin > department_head > teacher > student, parent
 * @param accessorRole - The role attempting access
 * @param targetRole - The role of the resource owner
 * @returns boolean indicating if access is permitted
 */
export function canAccessRole(accessorRole: UserRole, targetRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    system_admin: 5,
    school_admin: 4,
    department_head: 3,
    teacher: 2,
    student: 1,
    parent: 1,
  };

  return roleHierarchy[accessorRole] >= roleHierarchy[targetRole];
}

/**
 * Validate if a user can perform an action, throwing an error if not
 * @param userRole - The user's role
 * @param resource - The resource being accessed
 * @param action - The action being performed
 * @throws Error if permission is denied
 */
export function requirePermission(
  userRole: UserRole,
  resource: Resource,
  action: Action
): void {
  if (!hasPermission(userRole, resource, action)) {
    throw new Error(
      `Access denied: ${userRole} cannot ${action} ${resource}`
    );
  }
}

/**
 * Get human-readable permission description
 * @param permission - The permission object
 * @returns String description
 */
export function getPermissionDescription(permission: Permission): string {
  return `Can ${permission.action} ${permission.resource} within ${permission.scope} scope`;
}
