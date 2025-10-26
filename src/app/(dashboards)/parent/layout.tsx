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
 * Parent Dashboard Layout with enhanced layout preferences
 * Features: Sidebar navigation, role-based access, layout preferences
 */
export default async function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  // Get layout preferences
  const [sidebarVariant, sidebarCollapsible, contentLayout, navbarStyle] =
    await Promise.all([
      getPreference<SidebarVariant>(
        "sidebar_variant",
        SIDEBAR_VARIANT_VALUES,
        "inset"
      ),
      getPreference<SidebarCollapsible>(
        "sidebar_collapsible",
        SIDEBAR_COLLAPSIBLE_VALUES,
        "icon"
      ),
      getPreference<ContentLayout>(
        "content_layout",
        CONTENT_LAYOUT_VALUES,
        "centered"
      ),
      getPreference<NavbarStyle>(
        "navbar_style",
        NAVBAR_STYLE_VALUES,
        "scroll"
      ),
    ]);

  return (
    <RoleGuard allowedRoles={["parent", "system_admin", "school_admin"]}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar
          userRole="parent"
          variant={sidebarVariant}
          collapsible={sidebarCollapsible}
        />
        <SidebarInset
          data-content-layout={contentLayout}
          className={cn(
            "data-[content-layout=centered]:!mx-auto data-[content-layout=centered]:max-w-screen-2xl",
            // Adds right margin for inset sidebar in centered layout
            "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto"
          )}
        >
          <DashboardHeader
            showBreadcrumbs={true}
            navbarStyle={navbarStyle}
            contentLayout={contentLayout}
            sidebarVariant={sidebarVariant}
            sidebarCollapsible={sidebarCollapsible}
          />
          <div className="h-full p-4 md:p-6">{children}</div>
        </SidebarInset>
        <SearchDialog />
      </SidebarProvider>
    </RoleGuard>
  );
}
