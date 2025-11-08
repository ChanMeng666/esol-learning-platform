"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type NavMainItem } from "@/types/navigation";

interface NavSecondaryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavMainItem[];
}

/**
 * Secondary navigation component for sidebar footer area
 */
export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  aria-disabled={item.comingSoon}
                  className={isActive ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-blue-500 font-semibold text-blue-600 dark:text-blue-400" : ""}
                >
                  <Link href={item.url} target={item.newTab ? "_blank" : undefined}>
                    {Icon && <Icon />}
                    <span>{item.title}</span>
                    {item.comingSoon && (
                      <span className="ml-auto rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">
                        Soon
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}