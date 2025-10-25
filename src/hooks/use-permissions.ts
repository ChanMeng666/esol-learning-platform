"use client";

import { useUser } from "@stackframe/stack";
import {
  UserRole,
  Resource,
  Action,
  hasPermission,
  getPermissionScope,
  canAccessRole
} from "@/lib/auth/permissions";

/**
 * Hook to check user permissions in client components
 *
 * Usage:
 * const { userRole, checkPermission, canAccess } = usePermissions();
 *
 * if (checkPermission("assignments", "create")) {
 *   // Show create assignment button
 * }
 */
export function usePermissions() {
  const user = useUser();
  const userRole = (user?.clientMetadata?.role as UserRole) || null;

  /**
   * Check if current user has permission to perform an action on a resource
   */
  const checkPermission = (resource: Resource, action: Action): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole, resource, action);
  };

  /**
   * Get the scope for a specific permission
   */
  const getScope = (resource: Resource, action: Action) => {
    if (!userRole) return null;
    return getPermissionScope(userRole, resource, action);
  };

  /**
   * Check if current user can access another role's resources
   */
  const canAccess = (targetRole: UserRole): boolean => {
    if (!userRole) return false;
    return canAccessRole(userRole, targetRole);
  };

  /**
   * Check if user is one of the specified roles
   */
  const hasRole = (...roles: UserRole[]): boolean => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  /**
   * Check if user is admin (school or system)
   */
  const isAdmin = (): boolean => {
    return hasRole("school_admin", "system_admin");
  };

  /**
   * Check if user is system admin
   */
  const isSystemAdmin = (): boolean => {
    return hasRole("system_admin");
  };

  /**
   * Check if user is school admin
   */
  const isSchoolAdmin = (): boolean => {
    return hasRole("school_admin");
  };

  /**
   * Check if user is department head
   */
  const isDepartmentHead = (): boolean => {
    return hasRole("department_head");
  };

  /**
   * Check if user is teacher
   */
  const isTeacher = (): boolean => {
    return hasRole("teacher");
  };

  /**
   * Check if user is student
   */
  const isStudent = (): boolean => {
    return hasRole("student");
  };

  /**
   * Check if user is parent
   */
  const isParent = (): boolean => {
    return hasRole("parent");
  };

  return {
    user,
    userRole,
    checkPermission,
    getScope,
    canAccess,
    hasRole,
    isAdmin,
    isSystemAdmin,
    isSchoolAdmin,
    isDepartmentHead,
    isTeacher,
    isStudent,
    isParent,
  };
}
