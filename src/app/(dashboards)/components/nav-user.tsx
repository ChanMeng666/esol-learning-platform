"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import {
  EllipsisVertical,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { type UserRole } from "@/types/navigation";
import { getSettingsRoute } from "@/lib/dashboard-configs";

interface NavUserProps {
  role?: UserRole;
  enhancedUser?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

/**
 * Get initials from a name
 */
function getInitials(name?: string | null): string {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Get role display name
 */
function getRoleDisplayName(role?: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    student: "Student",
    teacher: "Teacher",
    parent: "Parent",
    department_head: "Department Head",
    school_admin: "School Admin",
    system_admin: "System Admin",
  };
  return role ? roleNames[role] : "User";
}

/**
 * User navigation component with dropdown menu
 */
export function NavUser({ role, enhancedUser }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const stackUser = useUser();

  // Combine Stack Auth user data with enhanced user data
  const displayName = enhancedUser?.name || stackUser?.displayName || "User";
  const email = enhancedUser?.email || stackUser?.primaryEmail || "";
  const avatar = enhancedUser?.avatar || stackUser?.profileImageUrl || undefined;

  const handleSignOut = async () => {
    if (stackUser) {
      await stackUser.signOut();
      router.push("/");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatar} alt={displayName} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {email}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatar} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {email}
                  </span>
                </div>
              </div>
              <div className="px-2 pb-1.5">
                <Badge variant="secondary" className="text-xs">
                  {getRoleDisplayName(role)}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/notifications")}
                className="cursor-pointer"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(getSettingsRoute(role || "student"))}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}