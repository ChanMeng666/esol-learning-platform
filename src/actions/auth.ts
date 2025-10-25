"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { UserRole, hasPermission, Resource, Action } from "@/lib/auth/permissions";

/**
 * Get the current user's role and enhanced profile
 * Multi-tenant: Returns user data from organization context
 */
export async function getCurrentUserRole() {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    return {
      userId,
      organizationId: organizationId.toString(),
      role: enhancedUser.role as UserRole,
      email: enhancedUser.email,
      fullName: enhancedUser.fullName,
      isActive: enhancedUser.isActive,
      metadata: enhancedUser.metadata,
    };
  });
}

/**
 * Check if the current user has a specific permission
 * @param resource - The resource being accessed
 * @param action - The action being performed
 * @returns boolean indicating if permission is granted
 */
export async function checkPermission(resource: Resource, action: Action) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    const userRole = enhancedUser.role as UserRole;

    // Check role-based permission
    const hasRolePermission = hasPermission(userRole, resource, action);

    // Check for any user-specific permission overrides
    const userPermissionOverride = await db.query.userPermissions.findFirst({
      where: and(
        eq(schema.userPermissions.userId, enhancedUser.id),
        eq(schema.userPermissions.organizationId, organizationId),
        eq(schema.userPermissions.resource, resource),
        eq(schema.userPermissions.action, action)
      ),
    });

    // If there's a deny override, deny access
    if (userPermissionOverride?.permissionType === "deny") {
      return false;
    }

    // If there's a grant override, grant access
    if (userPermissionOverride?.permissionType === "grant") {
      return true;
    }

    // Check expiration
    if (
      userPermissionOverride?.expiresAt &&
      new Date(userPermissionOverride.expiresAt) < new Date()
    ) {
      return hasRolePermission;
    }

    // Otherwise, use role-based permission
    return hasRolePermission;
  });
}

/**
 * Get all users by role within the organization
 * Multi-tenant: Returns users from current organization only
 * @param role - The role to filter by
 */
export async function getUsersByRole(role: UserRole) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate requester has permission to view users
    if (enhancedUser.role !== "teacher" && enhancedUser.role !== "school_admin") {
      throw new Error("Access denied: Insufficient permissions to view users");
    }

    const users = await db.query.users.findMany({
      where: and(
        eq(schema.users.organizationId, organizationId),
        eq(schema.users.role, role),
        eq(schema.users.isActive, true)
      ),
    });

    return users;
  });
}

/**
 * Get all teachers in the organization
 * Multi-tenant: Returns teachers from current organization only
 */
export async function getOrganizationTeachers() {
  return getUsersByRole("teacher");
}

/**
 * Get all students in the organization
 * Multi-tenant: Returns students from current organization only
 */
export async function getOrganizationStudents() {
  return getUsersByRole("student");
}

/**
 * Check if current user is a teacher
 */
export async function isTeacher() {
  return fetchWithDrizzle(async (db, { enhancedUser }) => {
    if (!enhancedUser) return false;
    return enhancedUser.role === "teacher";
  });
}

/**
 * Check if current user is a student
 */
export async function isStudent() {
  return fetchWithDrizzle(async (db, { enhancedUser }) => {
    if (!enhancedUser) return false;
    return enhancedUser.role === "student";
  });
}

/**
 * Check if current user is an admin
 */
export async function isAdmin() {
  return fetchWithDrizzle(async (db, { enhancedUser }) => {
    if (!enhancedUser) return false;
    return (
      enhancedUser.role === "school_admin" ||
      enhancedUser.role === "system_admin"
    );
  });
}

/**
 * Validate teacher has access to a specific student
 * (Student must be in one of the teacher's classes)
 */
export async function validateTeacherStudentAccess(studentId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      return false;
    }

    // Must be a teacher
    if (enhancedUser.role !== "teacher") {
      return false;
    }

    // Get student's classes
    const studentEnrollments = await db.query.classEnrollments.findMany({
      where: eq(schema.classEnrollments.studentId, studentId),
    });

    if (studentEnrollments.length === 0) {
      return false;
    }

    // Get teacher's classes
    const teacherClasses = await db.query.classes.findMany({
      where: and(
        eq(schema.classes.teacherId, enhancedUser.id),
        eq(schema.classes.organizationId, organizationId)
      ),
    });

    const teacherClassIds = teacherClasses.map((c) => c.id);

    // Check if student is in any of teacher's classes
    return studentEnrollments.some((enrollment) =>
      teacherClassIds.includes(enrollment.classId)
    );
  });
}

/**
 * Validate teacher has access to a specific class
 */
export async function validateTeacherClassAccess(classId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      return false;
    }

    // Must be a teacher
    if (enhancedUser.role !== "teacher") {
      return false;
    }

    // Check if teacher is primary teacher
    const classInfo = await db.query.classes.findFirst({
      where: and(
        eq(schema.classes.id, classId),
        eq(schema.classes.teacherId, enhancedUser.id),
        eq(schema.classes.organizationId, organizationId)
      ),
    });

    if (classInfo) {
      return true;
    }

    // Check if teacher is assistant teacher
    const assistantRole = await db.query.classTeachers.findFirst({
      where: and(
        eq(schema.classTeachers.classId, classId),
        eq(schema.classTeachers.teacherId, enhancedUser.id)
      ),
    });

    return !!assistantRole;
  });
}

/**
 * Grant special permission to a user (admin only)
 * Multi-tenant: Creates permission within organization
 */
export async function grantUserPermission(
  targetUserId: bigint,
  resource: Resource,
  action: Action,
  expiresAt?: Date
) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Only admins can grant permissions
    if (
      enhancedUser.role !== "school_admin" &&
      enhancedUser.role !== "system_admin"
    ) {
      throw new Error("Access denied: Admin role required");
    }

    // Validate target user exists in same organization
    const targetUser = await db.query.users.findFirst({
      where: and(
        eq(schema.users.id, targetUserId),
        eq(schema.users.organizationId, organizationId)
      ),
    });

    if (!targetUser) {
      throw new Error("Target user not found");
    }

    // Create permission
    const [permission] = await db
      .insert(schema.userPermissions)
      .values({
        userId: targetUserId,
        organizationId,
        permissionType: "grant",
        resource,
        action,
        grantedByUserId: enhancedUser.id,
        expiresAt,
      })
      .returning();

    return permission;
  });
}

/**
 * Revoke special permission from a user (admin only)
 */
export async function revokeUserPermission(
  targetUserId: bigint,
  resource: Resource,
  action: Action
) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Only admins can revoke permissions
    if (
      enhancedUser.role !== "school_admin" &&
      enhancedUser.role !== "system_admin"
    ) {
      throw new Error("Access denied: Admin role required");
    }

    // Create deny permission (overrides role permission)
    const [permission] = await db
      .insert(schema.userPermissions)
      .values({
        userId: targetUserId,
        organizationId,
        permissionType: "deny",
        resource,
        action,
        grantedByUserId: enhancedUser.id,
      })
      .returning();

    return permission;
  });
}
