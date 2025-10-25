"use client";

import { ReactNode } from "react";
import { useUser } from "@stackframe/stack";
import { UserRole, hasPermission, Resource, Action } from "./permissions";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

/**
 * Role Guard Component
 * Conditionally renders children based on user role
 *
 * Usage:
 * <RoleGuard allowedRoles={["teacher", "school_admin"]}>
 *   <TeacherOnlyContent />
 * </RoleGuard>
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
  requireAuth = true,
}: RoleGuardProps) {
  const user = useUser();

  if (requireAuth && !user) {
    return <>{fallback}</>;
  }

  // Get user role from custom data
  // Note: This assumes the role is stored in Stack Auth's custom data
  // In production, you might need to fetch from your users table
  const userRole = user?.clientMetadata?.role as UserRole | undefined;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface PermissionGuardProps {
  resource: Resource;
  action: Action;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Permission Guard Component
 * Conditionally renders children based on specific permissions
 *
 * Usage:
 * <PermissionGuard resource="assignments" action="create">
 *   <CreateAssignmentButton />
 * </PermissionGuard>
 */
export function PermissionGuard({
  resource,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const user = useUser();

  if (!user) {
    return <>{fallback}</>;
  }

  const userRole = user.clientMetadata?.role as UserRole | undefined;

  if (!userRole || !hasPermission(userRole, resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ConditionalRenderProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditional Render Component
 * Simple utility for conditional rendering
 */
export function ConditionalRender({
  condition,
  children,
  fallback = null,
}: ConditionalRenderProps) {
  return condition ? <>{children}</> : <>{fallback}</>;
}

/**
 * Custom hook to check if user has a specific role
 */
export function useHasRole(allowedRoles: UserRole[]): boolean {
  const user = useUser();

  if (!user) return false;

  const userRole = user.clientMetadata?.role as UserRole | undefined;

  return !!userRole && allowedRoles.includes(userRole);
}

/**
 * Custom hook to check if user has a specific permission
 */
export function useHasPermission(resource: Resource, action: Action): boolean {
  const user = useUser();

  if (!user) return false;

  const userRole = user.clientMetadata?.role as UserRole | undefined;

  return !!userRole && hasPermission(userRole, resource, action);
}

/**
 * Custom hook to get current user's role
 */
export function useUserRole(): UserRole | null {
  const user = useUser();

  if (!user) return null;

  return (user.clientMetadata?.role as UserRole | undefined) || null;
}
