import { cookies } from "next/headers";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { RoleGuard } from "@/components/auth/role-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false";

  return (
    <RoleGuard allowedRoles={["student"]}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar userRole="student" />
        <SidebarInset>
          <SiteHeader title="Dashboard" showBreadcrumbs={true} />
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RoleGuard>
  );
}
