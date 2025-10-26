import { cookies } from "next/headers";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/app/(dashboards)/components/dashboard-sidebar";
import { DashboardHeader } from "@/app/(dashboards)/components/dashboard-header";
import { RoleGuard } from "@/components/auth/role-guard";

/**
 * System Admin Dashboard Layout
 * Features: Sidebar navigation, role-based access control
 */
export default async function SystemAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false";

  return (
    <RoleGuard allowedRoles={["system_admin"]}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar userRole="system_admin" />
        <SidebarInset>
          <DashboardHeader showBreadcrumbs={true} />
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RoleGuard>
  );
}
