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
  Target,
  Languages,
  HeadphonesIcon,
  Lightbulb,
  FileSpreadsheet,
  type LucideIcon,
} from "lucide-react";
import { type UserRole, type DashboardConfig, type NavGroup, type NavMainItem } from "@/types/navigation";

// Student Dashboard Configuration
export const studentDashboardConfig: DashboardConfig = {
  dashboardTitle: "Student Dashboard",
  dashboardDescription: "Track your progress across all learning modules",
  navMain: [
    {
      id: "overview",
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/student/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "My Progress",
          url: "/student/progress",
          icon: TrendingUp,
          subItems: [
            { title: "Progress Overview", url: "/student/progress" },
            { title: "NZCEL Progress", url: "/student/progress/nzcel" },
            { title: "General English", url: "/student/progress/general" },
            { title: "Speaking Stats", url: "/student/progress/speaking" },
          ],
        },
        {
          title: "Analytics",
          url: "/student/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      id: "learning",
      label: "Learning Modules",
      items: [
        {
          title: "NZCEL Exam Prep",
          url: "/student/dashboard/practice/nzcel",
          icon: GraduationCap,
          subItems: [
            { title: "Overview", url: "/student/dashboard/practice/nzcel" },
            { title: "Skills Practice", url: "/student/dashboard/practice/nzcel/skills" },
            { title: "Conversation", url: "/student/dashboard/practice/nzcel/conversation" },
            { title: "Mock Exams", url: "/student/dashboard/practice/nzcel/exams" },
          ],
        },
        {
          title: "General English",
          url: "/student/dashboard/practice/general",
          icon: Globe,
        },
        {
          title: "AI Speaking Coach",
          url: "/student/dashboard/speaking",
          icon: Mic,
        },
        {
          title: "Diagnostic Tests",
          url: "/student/dashboard/diagnostic",
          icon: FileText,
        },
        {
          title: "Scenario Practice",
          url: "/student/dashboard/practice/scenarios",
          icon: Languages,
        },
      ],
    },
    {
      id: "academic",
      label: "Academic",
      items: [
        {
          title: "Assignments",
          url: "/student/assignments",
          icon: ClipboardList,
        },
        {
          title: "Schedule",
          url: "/student/schedule",
          icon: Calendar,
        },
      ],
    },
    {
      id: "achievements",
      label: "Achievements",
      items: [
        {
          title: "Achievements & Badges",
          url: "/student/achievements",
          icon: Award,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Help & Support",
      url: "/student/help",
      icon: Bell,
    },
  ],
};

// Teacher Dashboard Configuration
export const teacherDashboardConfig: DashboardConfig = {
  dashboardTitle: "Teacher Dashboard",
  dashboardDescription: "Manage your classes and track student progress",
  navMain: [
    {
      id: "overview",
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/teacher/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Analytics",
          url: "/teacher/analytics",
          icon: BarChart3,
        },
        {
          title: "Insights",
          url: "/teacher/insights",
          icon: Lightbulb,
        },
      ],
    },
    {
      id: "classroom",
      label: "Classroom Management",
      items: [
        {
          title: "My Classes",
          url: "/teacher/classes",
          icon: Users,
          subItems: [
            { title: "All Classes", url: "/teacher/classes" },
            { title: "Schedule", url: "/teacher/classes/schedule" },
            { title: "Attendance", url: "/teacher/classes/attendance" },
            { title: "Materials", url: "/teacher/classes/materials" },
          ],
        },
        {
          title: "Gradebook",
          url: "/teacher/gradebook",
          icon: FileSpreadsheet,
        },
        {
          title: "Assignments",
          url: "/teacher/assignments",
          icon: ClipboardList,
          subItems: [
            { title: "All Assignments", url: "/teacher/assignments" },
            { title: "Create New", url: "/teacher/assignments/create" },
            { title: "Grade Submissions", url: "/teacher/assignments/grade" },
            { title: "History", url: "/teacher/assignments/history" },
          ],
        },
        {
          title: "Speaking Review",
          url: "/teacher/dashboard/speaking-review",
          icon: HeadphonesIcon,
        },
        {
          title: "Student Progress",
          url: "/teacher/students",
          icon: TrendingUp,
        },
      ],
    },
    {
      id: "resources",
      label: "Resources",
      items: [
        {
          title: "Teaching Resources",
          url: "/teacher/resources",
          icon: BookOpen,
        },
        {
          title: "Calendar",
          url: "/teacher/calendar",
          icon: Calendar,
        },
        {
          title: "Curriculum",
          url: "/teacher/curriculum",
          icon: Target,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Help & Support",
      url: "/teacher/help",
      icon: Bell,
    },
  ],
};

// Parent Dashboard Configuration
export const parentDashboardConfig: DashboardConfig = {
  dashboardTitle: "Parent Dashboard",
  dashboardDescription: "Monitor your child's learning progress",
  navMain: [
    {
      id: "overview",
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/parent/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "My Children",
          url: "/parent/children",
          icon: Users,
        },
      ],
    },
    {
      id: "monitoring",
      label: "Monitoring",
      items: [
        {
          title: "Activity & Attendance",
          url: "/parent/activity",
          icon: Activity,
        },
        {
          title: "Assignments",
          url: "/parent/assignments",
          icon: ClipboardList,
        },
        {
          title: "Speaking Progress",
          url: "/parent/dashboard/speaking-progress",
          icon: HeadphonesIcon,
        },
        {
          title: "Progress Reports",
          url: "/parent/reports",
          icon: FileText,
        },
      ],
    },
    {
      id: "communication",
      label: "Communication",
      items: [
        {
          title: "Messages",
          url: "/parent/communication",
          icon: MessageSquare,
        },
        {
          title: "Teacher Feedback",
          url: "/parent/feedback",
          icon: Award,
        },
        {
          title: "Schedule",
          url: "/parent/schedule",
          icon: Calendar,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Help & Support",
      url: "/parent/help",
      icon: Bell,
    },
  ],
};

// Department Head Dashboard Configuration
export const departmentHeadDashboardConfig: DashboardConfig = {
  dashboardTitle: "Department Dashboard",
  dashboardDescription: "Oversee your department's performance",
  navMain: [
    {
      id: "overview",
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/department/dashboard",
          icon: LayoutDashboard,
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
      ],
    },
    {
      id: "management",
      label: "Management",
      items: [
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
          title: "Resources",
          url: "/department/resources",
          icon: FolderKanban,
        },
      ],
    },
  ],
  navSecondary: [],
};

// School Admin Dashboard Configuration
export const schoolAdminDashboardConfig: DashboardConfig = {
  dashboardTitle: "School Administration",
  dashboardDescription: "Manage your entire school",
  navMain: [
    {
      id: "overview",
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/school-admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Analytics",
          url: "/school-admin/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      id: "administration",
      label: "Administration",
      items: [
        {
          title: "Departments",
          url: "/school-admin/departments",
          icon: Building2,
        },
        {
          title: "Users",
          url: "/school-admin/users",
          icon: Users,
          subItems: [
            { title: "Teachers", url: "/school-admin/users/teachers" },
            { title: "Students", url: "/school-admin/users/students" },
            { title: "Parents", url: "/school-admin/users/parents" },
          ],
        },
        {
          title: "Classes",
          url: "/school-admin/classes",
          icon: GraduationCap,
        },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      items: [
        {
          title: "Reports",
          url: "/school-admin/reports",
          icon: FileText,
        },
      ],
    },
  ],
  navSecondary: [],
};

// System Admin Dashboard Configuration
export const systemAdminDashboardConfig: DashboardConfig = {
  dashboardTitle: "System Administration",
  dashboardDescription: "Manage all organizations and system health",
  navMain: [
    {
      id: "overview",
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/system-admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "System Health",
          url: "/system-admin/health",
          icon: Activity,
        },
      ],
    },
    {
      id: "management",
      label: "Management",
      items: [
        {
          title: "Organizations",
          url: "/system-admin/organizations",
          icon: Building2,
        },
        {
          title: "User Management",
          url: "/system-admin/users",
          icon: Users,
        },
        {
          title: "Permissions",
          url: "/system-admin/permissions",
          icon: Shield,
        },
      ],
    },
    {
      id: "technical",
      label: "Technical",
      items: [
        {
          title: "Audit Logs",
          url: "/system-admin/audit",
          icon: FileText,
        },
        {
          title: "Database",
          url: "/system-admin/database",
          icon: Database,
        },
      ],
    },
  ],
  navSecondary: [],
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
    student: "/student/dashboard",
    teacher: "/teacher/dashboard",
    parent: "/parent/dashboard",
    department_head: "/department/dashboard",
    school_admin: "/school-admin/dashboard",
    system_admin: "/system-admin/dashboard",
  };

  return routes[role] || "/student/dashboard";
}

// Get settings route by role
export function getSettingsRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    student: "/student/dashboard/settings",
    teacher: "/teacher/dashboard/settings",
    parent: "/parent/dashboard/settings",
    department_head: "/department/dashboard/settings",
    school_admin: "/school-admin/dashboard/settings",
    system_admin: "/system-admin/dashboard/settings",
  };

  return routes[role] || "/student/dashboard/settings";
}