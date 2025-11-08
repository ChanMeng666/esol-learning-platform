"use client";

import { useState, useEffect, ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ActivityContext } from "./context";

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

// Navigation items for activity sub-pages
const activityNavItems = [
  { href: "/parent/activity", label: "Recent Activity" },
  { href: "/parent/activity/attendance", label: "Attendance" },
  { href: "/parent/activity/summary", label: "Summary" },
];

export default function ActivityLayout({ children: layoutChildren }: { children: ReactNode }) {
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("week");
  const [activityData, setActivityData] = useState<ActivityLog[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const children = [
    { id: "1", name: "Alice Johnson", avatar: "/avatars/alice.jpg" },
    { id: "2", name: "Bob Johnson", avatar: "/avatars/bob.jpg" },
  ];

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        // Mock data - replace with actual API call
        const mockActivities: ActivityLog[] = [
          {
            id: "1",
            childName: "Alice Johnson",
            childAvatar: "/avatars/alice.jpg",
            action: "Completed Practice",
            details: "Finished Level 3 Reading Exercise with 85% accuracy",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            type: "practice",
            status: "completed",
          },
          {
            id: "2",
            childName: "Bob Johnson",
            childAvatar: "/avatars/bob.jpg",
            action: "Achievement Unlocked",
            details: "Earned 'Consistent Learner' badge - 7 day streak!",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            type: "achievement",
            status: "completed",
          },
          {
            id: "3",
            childName: "Alice Johnson",
            childAvatar: "/avatars/alice.jpg",
            action: "Test Completed",
            details: "NZCEL Diagnostic Test - Score: 78/100",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            type: "test",
            status: "completed",
          },
          {
            id: "4",
            childName: "Alice Johnson",
            childAvatar: "/avatars/alice.jpg",
            action: "Attendance Marked",
            details: "Present in all classes today",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            type: "attendance",
            status: "completed",
          },
          {
            id: "5",
            childName: "Bob Johnson",
            childAvatar: "/avatars/bob.jpg",
            action: "Assignment Started",
            details: "Started working on Science Project",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            type: "practice",
            status: "in_progress",
          },
        ];

        const mockAttendance: AttendanceRecord[] = [
          {
            id: "1",
            childName: "Alice Johnson",
            date: new Date(),
            status: "present",
            class: "5A",
            notes: "Participated actively in class",
          },
          {
            id: "2",
            childName: "Bob Johnson",
            date: new Date(),
            status: "present",
            class: "3B",
          },
          {
            id: "3",
            childName: "Alice Johnson",
            date: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: "present",
            class: "5A",
          },
          {
            id: "4",
            childName: "Bob Johnson",
            date: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: "late",
            class: "3B",
            notes: "Arrived 10 minutes late",
          },
        ];

        // Filter based on selected child
        if (selectedChild !== "all") {
          const childData = children.find(c => c.id === selectedChild);
          if (childData) {
            setActivityData(mockActivities.filter(a => a.childName === childData.name));
            setAttendanceData(mockAttendance.filter(a => a.childName === childData.name));
          }
        } else {
          setActivityData(mockActivities);
          setAttendanceData(mockAttendance);
        }
      } catch (error) {
        console.error("Failed to load activity data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivityData();
  }, [selectedChild, timeRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading activity data...</p>
        </div>
      </div>
    );
  }

  return (
    <ActivityContext.Provider
      value={{
        selectedChild,
        setSelectedChild,
        timeRange,
        setTimeRange,
        activityData,
        attendanceData,
        isLoading,
        children,
      }}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Activity & Attendance</h1>
          <p className="text-muted-foreground">
            Track your children's daily activities and attendance records
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {children.map(child => (
                <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        <div className="border-b">
          <nav className="flex space-x-8" aria-label="Activity navigation">
            {activityNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  pathname === item.href
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        {layoutChildren}
      </div>
    </ActivityContext.Provider>
  );
}