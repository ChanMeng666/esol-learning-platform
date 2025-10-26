"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { LoadingState } from "@/components/shared/loading-state";
import { getDefaultDashboardRoute } from "@/lib/dashboard-configs";

/**
 * Smart redirect page that routes users to their role-specific dashboard
 *
 * Routes:
 * - student → /student/dashboard
 * - teacher → /teacher/dashboard
 * - parent → /parent/dashboard
 * - school_admin → /school-admin/dashboard
 * - system_admin → /system-admin/dashboard
 */
export default function DashboardRedirect() {
  const router = useRouter();
  const user = useUser({ or: "redirect" });

  useEffect(() => {
    if (user) {
      const role = (user.clientMetadata?.role as string) || "student";
      const dashboardRoute = getDefaultDashboardRoute(
        role as "student" | "teacher" | "parent" | "school_admin" | "system_admin"
      );
      router.replace(dashboardRoute);
    }
  }, [user, router]);

  return <LoadingState message="Redirecting to your dashboard..." fullScreen />;
}
