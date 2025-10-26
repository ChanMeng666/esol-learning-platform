import { cookies } from "next/headers";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/app/(dashboards)/components/dashboard-sidebar";
import { DashboardHeader } from "@/app/(dashboards)/components/dashboard-header";
import { RoleGuard } from "@/components/auth/role-guard";

/**
 * Student Dashboard Layout
 * Features: Sidebar navigation, role-based access control
 */
export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false";

  return (
    <RoleGuard
      allowedRoles={[
        "student",
        "parent",
        "system_admin",
        "school_admin",
        "department_head",
      ]}
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar userRole="student" />
        <SidebarInset>
          <DashboardHeader showBreadcrumbs={true} />
          <div className="flex-1 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RoleGuard>
  );
}
