"use client";

import { Fragment, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-toggle";
import { UserStatsBadge } from "./user-stats-badge";

interface DashboardHeaderProps {
  title?: string;
  showBreadcrumbs?: boolean;
}

/**
 * Dashboard header component based on dashboard-03 design
 * Features: SidebarTrigger, Breadcrumbs, User Stats, Theme Toggle
 * Removed: Search functionality, User Menu (moved to sidebar footer)
 */
export function DashboardHeader({
  title,
  showBreadcrumbs = true,
}: DashboardHeaderProps) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const breadcrumbs = useMemo(() => {
    if (!showBreadcrumbs) return [];

    const paths = pathname
      .split("/")
      .filter((path) => path !== "")
      .map((path, index, array) => {
        const href = `/${array.slice(0, index + 1).join("/")}`;
        // Clean up path labels
        const label = path
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return { label, href };
      });

    return paths;
  }, [pathname, showBreadcrumbs]);

  return (
    <header
      data-slot="dashboard-header"
      className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          {/* Sidebar Trigger */}
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

          {/* Title (optional) */}
          {title && <h1 className="text-base font-semibold">{title}</h1>}

          {/* Breadcrumbs */}
          {showBreadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb className="hidden sm:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((breadcrumb, index) =>
                  index === breadcrumbs.length - 1 ? (
                    <Fragment key={breadcrumb.href}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="capitalize">
                          {breadcrumb.label}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </Fragment>
                  ) : (
                    <Fragment key={breadcrumb.href}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild className="capitalize">
                          <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </Fragment>
                  )
                )}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>

        {/* Right side: User Stats, Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* User Statistics Badge */}
          <UserStatsBadge />

          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
