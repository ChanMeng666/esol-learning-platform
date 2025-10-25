import {
  LayoutDashboard,
  GraduationCap,
  Mic,
  Globe,
  MessageSquare,
  Settings,
  User,
  Users,
  ClipboardList,
  TrendingUp,
  BookOpen,
  Award,
  Calendar,
  Bell,
  FileText,
  BarChart3,
  Building2,
  Shield,
  Database,
  Activity,
  FolderKanban,
  type LucideIcon,
} from "lucide-react";

export type UserRole =
  | "student"
  | "teacher"
  | "parent"
  | "department_head"
  | "school_admin"
  | "system_admin";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface DashboardConfig {
  navMain: NavItem[];
  navSecondary: NavItem[];
  dashboardTitle: string;
  dashboardDescription: string;
}

// Student Dashboard Configuration
export const studentDashboardConfig: DashboardConfig = {
  dashboardTitle: "Student Dashboard",
  dashboardDescription: "Track your progress across all learning modules",
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "General Practice",
      url: "/practice/general",
      icon: Globe,
    },
    {
      title: "NZCEL Exam Prep",
      url: "/practice/nzcel",
      icon: GraduationCap,
    },
    {
      title: "AI Speaking Coach",
      url: "/speaking",
      icon: Mic,
    },
    {
      title: "Conversation Practice",
      url: "/conversation",
      icon: MessageSquare,
    },
    {
      title: "My Progress",
      url: "/progress",
      icon: TrendingUp,
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "/account",
      icon: User,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

// Teacher Dashboard Configuration
export const teacherDashboardConfig: DashboardConfig = {
  dashboardTitle: "Teacher Dashboard",
  dashboardDescription: "Manage your classes and track student progress",
  navMain: [
    {
      title: "Dashboard",
      url: "/teacher/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Classes",
      url: "/teacher/classes",
      icon: Users,
    },
    {
      title: "Assignments",
      url: "/teacher/assignments",
      icon: ClipboardList,
    },
    {
      title: "Student Progress",
      url: "/teacher/students",
      icon: TrendingUp,
    },
    {
      title: "Analytics",
      url: "/teacher/analytics",
      icon: BarChart3,
    },
    {
      title: "Resources",
      url: "/teacher/resources",
      icon: BookOpen,
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "/teacher/calendar",
      icon: Calendar,
    },
    {
      title: "Notifications",
      url: "/teacher/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

// Parent Dashboard Configuration
export const parentDashboardConfig: DashboardConfig = {
  dashboardTitle: "Parent Dashboard",
  dashboardDescription: "Monitor your child's learning progress",
  navMain: [
    {
      title: "Dashboard",
      url: "/parent/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Children Progress",
      url: "/parent/children",
      icon: Users,
    },
    {
      title: "Assignments",
      url: "/parent/assignments",
      icon: ClipboardList,
    },
    {
      title: "Teacher Feedback",
      url: "/parent/feedback",
      icon: MessageSquare,
    },
    {
      title: "Reports",
      url: "/parent/reports",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Messages",
      url: "/parent/messages",
      icon: Bell,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

// Department Head Dashboard Configuration
export const departmentHeadDashboardConfig: DashboardConfig = {
  dashboardTitle: "Department Dashboard",
  dashboardDescription: "Oversee your department's performance",
  navMain: [
    {
      title: "Dashboard",
      url: "/department/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Teachers",
      url: "/department/teachers",
      icon: Users,
    },
    {
      title: "Classes",
      url: "/department/classes",
      icon: GraduationCap,
    },
    {
      title: "Students",
      url: "/department/students",
      icon: User,
    },
    {
      title: "Analytics",
      url: "/department/analytics",
      icon: BarChart3,
    },
    {
      title: "Reports",
      url: "/department/reports",
      icon: FileText,
    },
    {
      title: "Resources",
      url: "/department/resources",
      icon: FolderKanban,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

// School Admin Dashboard Configuration
export const schoolAdminDashboardConfig: DashboardConfig = {
  dashboardTitle: "School Administration",
  dashboardDescription: "Manage your entire school",
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Departments",
      url: "/admin/departments",
      icon: Building2,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Classes",
      url: "/admin/classes",
      icon: GraduationCap,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Announcements",
      url: "/admin/announcements",
      icon: Bell,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Organization Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
};

// System Admin Dashboard Configuration
export const systemAdminDashboardConfig: DashboardConfig = {
  dashboardTitle: "System Administration",
  dashboardDescription: "Manage all organizations and system health",
  navMain: [
    {
      title: "Dashboard",
      url: "/system/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Organizations",
      url: "/system/organizations",
      icon: Building2,
    },
    {
      title: "System Health",
      url: "/system/health",
      icon: Activity,
    },
    {
      title: "User Management",
      url: "/system/users",
      icon: Users,
    },
    {
      title: "Permissions",
      url: "/system/permissions",
      icon: Shield,
    },
    {
      title: "Audit Logs",
      url: "/system/audit",
      icon: FileText,
    },
    {
      title: "Database",
      url: "/system/database",
      icon: Database,
    },
  ],
  navSecondary: [
    {
      title: "System Tools",
      url: "/system/tools",
      icon: Settings,
    },
  ],
};

// Get dashboard config by role
export function getDashboardConfig(role: UserRole): DashboardConfig {
  const configs: Record<UserRole, DashboardConfig> = {
    student: studentDashboardConfig,
    teacher: teacherDashboardConfig,
    parent: parentDashboardConfig,
    department_head: departmentHeadDashboardConfig,
    school_admin: schoolAdminDashboardConfig,
    system_admin: systemAdminDashboardConfig,
  };

  return configs[role] || studentDashboardConfig;
}

// Get default dashboard route by role
export function getDefaultDashboardRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    student: "/dashboard",
    teacher: "/teacher/dashboard",
    parent: "/parent/dashboard",
    department_head: "/department/dashboard",
    school_admin: "/admin/dashboard",
    system_admin: "/system/dashboard",
  };

  return routes[role] || "/dashboard";
}
