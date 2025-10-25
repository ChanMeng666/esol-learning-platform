"use client";

import { Fragment, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/theme-toggle";
import { UserNav } from "./user-nav";

interface SiteHeaderProps {
  title?: string;
  showBreadcrumbs?: boolean;
}

export function SiteHeader({ title, showBreadcrumbs = true }: SiteHeaderProps) {
  const { toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const breadcrumbs = useMemo(() => {
    if (!showBreadcrumbs) return [];

    const paths = pathname
      .split("/")
      .filter((path) => path !== "")
      .map((path, index, array) => {
        const href = `/${array.slice(0, index + 1).join("/")}`;
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
      data-slot="site-header"
      className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear"
    >
      <div className="flex w-full items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {title && <h1 className="text-base font-semibold">{title}</h1>}

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
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </Fragment>
                ) : (
                  <Fragment key={breadcrumb.href}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </Fragment>
                )
              )}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
