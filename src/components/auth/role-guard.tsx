import { redirect } from "next/navigation";
import { stackServerApp } from "@/lib/stack";
import { UserRole } from "@/lib/auth/permissions";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Server-side role guard for layouts
 * Checks user role and redirects if unauthorized
 *
 * Usage in layout.tsx:
 * <RoleGuard allowedRoles={["teacher", "school_admin"]}>
 *   {children}
 * </RoleGuard>
 */
export async function RoleGuard({
  allowedRoles,
  children,
  redirectTo = "/",
}: RoleGuardProps) {
  const user = await stackServerApp.getUser();

  // Redirect to sign-in if not authenticated
  if (!user) {
    redirect("/handler/sign-in");
  }

  // Check user role
  // Default to "student" for legacy users without roles
  const userRole = (user.clientMetadata?.role as UserRole | undefined) || "student";

  // Redirect if role not allowed
  if (!allowedRoles.includes(userRole)) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}

/**
 * Get default redirect path based on user role
 */
export async function getDefaultRedirectForRole(): Promise<string> {
  const user = await stackServerApp.getUser();

  if (!user) {
    return "/handler/sign-in";
  }

  // Default to "student" for legacy users without roles
  const userRole = (user.clientMetadata?.role as UserRole | undefined) || "student";

  switch (userRole) {
    case "student":
      return "/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "parent":
      return "/dashboard"; // Parents use main dashboard for now
    case "department_head":
      return "/dashboard"; // Department heads use main dashboard for now
    case "school_admin":
      return "/dashboard"; // School admins use main dashboard for now
    case "system_admin":
      return "/dashboard"; // System admins use main dashboard for now
    default:
      return "/dashboard"; // Default to student dashboard
  }
}
