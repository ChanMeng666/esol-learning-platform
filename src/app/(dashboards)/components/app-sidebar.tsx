"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getDashboardConfig } from "@/lib/dashboard-configs-v2";
import { type UserRole } from "@/types/navigation";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: UserRole;
  enhancedUser?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

/**
 * Main application sidebar component with role-based navigation
 */
export function AppSidebar({ userRole, enhancedUser, ...props }: AppSidebarProps) {
  const config = getDashboardConfig(userRole);

  return (
    <Sidebar {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">ESOL Platform</span>
                  <span className="text-xs text-muted-foreground">
                    {config.dashboardTitle.replace(" Dashboard", "")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent>
        {/* Main Navigation with Groups */}
        <NavMain items={config.navMain} />

        {/* Secondary Navigation */}
        {config.navSecondary && config.navSecondary.length > 0 && (
          <NavSecondary items={config.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>

      {/* Footer - User Navigation */}
      <SidebarFooter>
        <NavUser role={userRole} enhancedUser={enhancedUser} />
      </SidebarFooter>
    </Sidebar>
  );
}