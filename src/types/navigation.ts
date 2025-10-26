import { type LucideIcon } from "lucide-react";

/**
 * Navigation sub-item definition
 */
export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

/**
 * Main navigation item definition
 */
export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

/**
 * Navigation group definition
 */
export interface NavGroup {
  id: string;
  label?: string;
  items: NavMainItem[];
}

/**
 * User role types
 */
export type UserRole =
  | "student"
  | "teacher"
  | "parent"
  | "department_head"
  | "school_admin"
  | "system_admin";

/**
 * Dashboard configuration for each role
 */
export interface DashboardConfig {
  navMain: NavGroup[];
  navSecondary: NavMainItem[];
  dashboardTitle: string;
  dashboardDescription: string;
}