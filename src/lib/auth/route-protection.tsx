"use client";

import { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { UserRole } from "./permissions";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface RouteProtectionOptions {
  allowedRoles: UserRole[];
  requireAuth?: boolean;
  redirectTo?: string;
  loadingComponent?: ComponentType;
  unauthorizedComponent?: ComponentType;
}

/**
 * Higher-Order Component for route protection
 * Wraps a page component and checks user role before rendering
 *
 * Usage:
 * export default withRoleProtection(TeacherDashboard, {
 *   allowedRoles: ["teacher", "school_admin"],
 *   redirectTo: "/unauthorized"
 * });
 */
export function withRoleProtection<P extends object>(
  Component: ComponentType<P>,
  options: RouteProtectionOptions
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const user = useUser({ or: "redirect" });
    const {
      allowedRoles,
      requireAuth = true,
      redirectTo,
      loadingComponent: LoadingComponent,
      unauthorizedComponent: UnauthorizedComponent,
    } = options;

    useEffect(() => {
      // Check authentication
      if (requireAuth && !user) {
        // Stack Auth's useUser with { or: "redirect" } will handle redirect to sign-in
        return;
      }

      // Check role authorization
      if (user) {
        const userRole = user.clientMetadata?.role as UserRole | undefined;

        if (!userRole || !allowedRoles.includes(userRole)) {
          // Unauthorized - redirect or show error
          if (redirectTo) {
            router.push(redirectTo);
          } else if (UnauthorizedComponent) {
            // Will render UnauthorizedComponent below
          } else {
            // Default: redirect to home
            router.push("/");
          }
        }
      }
    }, [user, router, redirectTo]);

    // Loading state
    if (!user) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return <DefaultLoadingComponent />;
    }

    // Check role
    const userRole = user.clientMetadata?.role as UserRole | undefined;

    if (!userRole || !allowedRoles.includes(userRole)) {
      if (UnauthorizedComponent) {
        return <UnauthorizedComponent />;
      }
      return <DefaultUnauthorizedComponent />;
    }

    // Authorized - render component
    return <Component {...props} />;
  };
}

/**
 * Default loading component
 */
function DefaultLoadingComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <DotLottieReact
          src="/animations/loading.lottie"
          autoplay
          loop
          style={{ width: 200, height: 200 }}
        />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Default unauthorized component
 */
function DefaultUnauthorizedComponent() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-8">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

/**
 * Simplified route protection for common roles
 */
export const withTeacherProtection = <P extends object>(Component: ComponentType<P>) =>
  withRoleProtection(Component, {
    allowedRoles: ["teacher", "school_admin", "system_admin"],
    redirectTo: "/dashboard",
  });

export const withStudentProtection = <P extends object>(Component: ComponentType<P>) =>
  withRoleProtection(Component, {
    allowedRoles: ["student"],
    redirectTo: "/",
  });

export const withAdminProtection = <P extends object>(Component: ComponentType<P>) =>
  withRoleProtection(Component, {
    allowedRoles: ["school_admin", "system_admin"],
    redirectTo: "/",
  });
