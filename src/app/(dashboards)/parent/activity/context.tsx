"use client";

import { createContext, useContext } from "react";

// Activity log data structure
interface ActivityLog {
  id: string;
  childName: string;
  childAvatar?: string;
  action: string;
  details: string;
  timestamp: Date;
  type: "achievement" | "practice" | "test" | "alert" | "attendance";
  status?: "completed" | "in_progress" | "missed";
}

// Attendance record structure
interface AttendanceRecord {
  id: string;
  childName: string;
  date: Date;
  status: "present" | "absent" | "late" | "excused";
  class: string;
  notes?: string;
}

// Context for sharing activity data across pages
interface ActivityContextType {
  selectedChild: string;
  setSelectedChild: (child: string) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  activityData: ActivityLog[];
  attendanceData: AttendanceRecord[];
  isLoading: boolean;
  children: Array<{ id: string; name: string; avatar: string }>;
}

export const ActivityContext = createContext<ActivityContextType | null>(null);

export function useActivityContext() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivityContext must be used within ActivityLayout");
  }
  return context;
}