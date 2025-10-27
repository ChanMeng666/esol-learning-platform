"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { LoadingState } from "@/components/shared/loading-state";
import { getDefaultDashboardRoute } from "@/lib/dashboard-configs";
import type { UserRole } from "@/types/navigation";

/**
 * Role-based redirect component
 *
 * Automatically redirects users to their role-specific homepage
 * - Teachers → /teacher/dashboard
 * - Students → /dashboard
 * - No role → /dashboard (default student)
 *
 * Usage:
 * Place this component in pages where you want automatic redirection based on role
 */
export function RoleRedirect({
  redirectTo,
  loading = true,
}: {
  redirectTo?: "dashboard";
  loading?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser({ or: "redirect" });

  useEffect(() => {
    if (!user) return;

    // Get user role from Stack Auth clientMetadata
    const userRole = (user.clientMetadata?.role as string) || "student";

    // Don't redirect if already on the correct dashboard
    if (userRole === "teacher" && pathname.startsWith("/teacher")) {
      return;
    }
    if (userRole === "student" && pathname.startsWith("/dashboard")) {
      return;
    }

    // Redirect to appropriate dashboard
    if (redirectTo === "dashboard") {
      const targetPath = getDefaultDashboardRoute(userRole as UserRole);
      router.push(targetPath);
    }
  }, [user, router, pathname, redirectTo]);

  if (loading) {
    return <LoadingState message="Redirecting..." fullScreen />;
  }

  return null;
}

/**
 * Hook to get user role
 *
 * Returns the current user's role from Stack Auth clientMetadata
 */
export function useUserRole(): "teacher" | "student" | "school_admin" | "system_admin" | null {
  const user = useUser();

  if (!user) return null;

  const role = user.clientMetadata?.role as string;
  return (role as any) || "student";
}

/**
 * Hook to check if user has a specific role
 *
 * @param allowedRoles - Array of roles to check against
 * @returns true if user has one of the allowed roles
 */
export function useHasRole(allowedRoles: string[]): boolean {
  const user = useUser();

  if (!user) return false;

  // Default to "student" for legacy users without roles
  const userRole = (user.clientMetadata?.role as string) || "student";
  return allowedRoles.includes(userRole);
}
