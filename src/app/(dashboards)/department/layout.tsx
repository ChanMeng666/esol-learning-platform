import { cookies } from "next/headers";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(dashboards)/components/app-sidebar";
import { DashboardHeader } from "@/app/(dashboards)/components/dashboard-header-v2";
import { RoleGuard } from "@/components/auth/role-guard";
import { getPreference } from "@/lib/layout-preferences";
import { SearchDialog } from "@/app/(dashboards)/components/search-dialog";
import { cn } from "@/lib/utils";
import {
  SIDEBAR_VARIANT_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  type SidebarVariant,
  type SidebarCollapsible,
  type ContentLayout,
  type NavbarStyle,
} from "@/types/preferences/layout";

/**
 * Department Head Dashboard Layout with enhanced layout preferences
 * Features: Sidebar navigation, role-based access, layout preferences
 */
export default async function DepartmentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  // Get layout preferences
  const sidebarVariant = await getPreference(
    "sidebar_variant",
    SIDEBAR_VARIANT_VALUES,
    "inset"
  );
  const sidebarCollapsible = await getPreference(
    "sidebar_collapsible",
    SIDEBAR_COLLAPSIBLE_VALUES,
    "icon"
  );
  const contentLayout = await getPreference(
    "content_layout",
    CONTENT_LAYOUT_VALUES,
    "centered"
  );
  const navbarStyle = await getPreference(
    "navbar_style",
    NAVBAR_STYLE_VALUES,
    "sticky"
  );

  return (
    <RoleGuard allowedRoles={["department_head"]}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar userRole="department_head" />
        <SidebarInset
          data-content-layout={contentLayout}
          className={cn(
            navbarStyle === "sticky" && "flex flex-col"
          )}
        >
          <DashboardHeader />
          <main
            className={cn(
              "flex-1",
              navbarStyle === "sticky" && "overflow-auto"
            )}
          >
            {contentLayout === "centered" ? (
              <div className="max-w-7xl mx-auto p-8">
                {children}
              </div>
            ) : (
              <div className="p-8">
                {children}
              </div>
            )}
          </main>
        </SidebarInset>
        <SearchDialog />
      </SidebarProvider>
    </RoleGuard>
  );
}