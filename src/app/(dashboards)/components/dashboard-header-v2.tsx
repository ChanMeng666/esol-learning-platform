"use client";

import { Fragment, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { UserStatsBadge } from "./user-stats-badge";
import { ThemeSwitcher } from "./theme-switcher";
import { LayoutControls } from "./layout-controls";
import { type NavbarStyle, type ContentLayout, type SidebarVariant, type SidebarCollapsible } from "@/types/preferences/layout";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title?: string;
  showBreadcrumbs?: boolean;
  navbarStyle?: NavbarStyle;
  contentLayout?: ContentLayout;
  sidebarVariant?: SidebarVariant;
  sidebarCollapsible?: SidebarCollapsible;
  onSearchOpen?: () => void;
}

/**
 * Enhanced dashboard header with layout preferences support
 */
export function DashboardHeader({
  title,
  showBreadcrumbs = true,
  navbarStyle = "scroll",
  contentLayout = "centered",
  sidebarVariant = "inset",
  sidebarCollapsible = "icon",
  onSearchOpen,
}: DashboardHeaderProps) {
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

  const layoutPreferences = {
    contentLayout,
    variant: sidebarVariant,
    collapsible: sidebarCollapsible,
    navbarStyle,
  };

  return (
    <header
      data-navbar-style={navbarStyle}
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
        // Handle sticky navbar style
        "data-[navbar-style=sticky]:bg-background/50 data-[navbar-style=sticky]:sticky data-[navbar-style=sticky]:top-0 data-[navbar-style=sticky]:z-50 data-[navbar-style=sticky]:overflow-hidden data-[navbar-style=sticky]:rounded-t-[inherit] data-[navbar-style=sticky]:backdrop-blur-md"
      )}
    >
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          {/* Sidebar Trigger */}
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

          {/* Search Button (Optional) */}
          {onSearchOpen && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSearchOpen}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4 hidden sm:block" />
            </>
          )}

          {/* Title (optional) */}
          {title && <h1 className="text-base font-semibold">{title}</h1>}

          {/* Breadcrumbs */}
          {showBreadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb className="hidden md:flex">
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

        {/* Right side: Layout Controls, User Stats, Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* User Statistics Badge */}
          <UserStatsBadge />

          {/* Layout Controls */}
          <LayoutControls {...layoutPreferences} />

          {/* Theme Switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}