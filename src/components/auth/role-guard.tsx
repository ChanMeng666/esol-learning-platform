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
  const userRole = user.clientMetadata?.role as UserRole | undefined;

  // Redirect if role not allowed
  if (!userRole || !allowedRoles.includes(userRole)) {
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

  const userRole = user.clientMetadata?.role as UserRole | undefined;

  switch (userRole) {
    case "student":
      return "/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "parent":
      return "/parent/dashboard";
    case "department_head":
      return "/department/dashboard";
    case "school_admin":
      return "/admin/dashboard";
    case "system_admin":
      return "/system/dashboard";
    default:
      return "/";
  }
}
