"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Users,
  Target,
  BarChart3,
  PieChart,
} from "lucide-react";

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

export default function ParentActivityPage() {
  return (
    <ProtectedRoute>
      <ActivityPageContent />
    </ProtectedRoute>
  );
}

function ActivityPageContent() {
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("week");
  const [activityData, setActivityData] = useState<ActivityLog[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        setActivityData(mockActivities);
        setAttendanceData(mockAttendance);
      } catch (error) {
        console.error("Failed to load activity data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivityData();
  }, [selectedChild, timeRange]);

  // Activity table columns
  const activityColumns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: "childName",
      header: "Child",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.childAvatar} />
            <AvatarFallback>{row.getValue("childName").toString().split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.getValue("childName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Activity",
      cell: ({ row }) => {
        const type = row.original.type;
        const icons = {
          achievement: <Award className="h-4 w-4 text-amber-500" />,
          practice: <BookOpen className="h-4 w-4 text-blue-500" />,
          test: <FileText className="h-4 w-4 text-purple-500" />,
          alert: <AlertCircle className="h-4 w-4 text-red-500" />,
          attendance: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        };

        return (
          <div className="flex items-center gap-2">
            {icons[type]}
            <span>{row.getValue("action")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => (
        <p className="text-sm text-muted-foreground">{row.getValue("details")}</p>
      ),
    },
    {
      accessorKey: "timestamp",
      header: "Time",
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp") as Date;
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return "Just now";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        if (!status) return null;

        const variants: Record<string, "default" | "secondary" | "outline"> = {
          completed: "default",
          in_progress: "secondary",
          missed: "outline",
        };

        return (
          <Badge variant={variants[status] || "outline"}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
  ];

  // Attendance table columns
  const attendanceColumns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("date") as Date;
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "childName",
      header: "Child",
    },
    {
      accessorKey: "class",
      header: "Class",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const colors: Record<string, string> = {
          present: "text-green-600",
          absent: "text-red-600",
          late: "text-amber-600",
          excused: "text-blue-600",
        };

        const icons: Record<string, React.ReactNode> = {
          present: <CheckCircle2 className="h-4 w-4" />,
          absent: <XCircle className="h-4 w-4" />,
          late: <Clock className="h-4 w-4" />,
          excused: <AlertCircle className="h-4 w-4" />,
        };

        return (
          <div className={`flex items-center gap-2 ${colors[status]}`}>
            {icons[status]}
            <span className="capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => {
        const notes = row.getValue("notes") as string;
        return notes ? (
          <p className="text-sm text-muted-foreground">{notes}</p>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
  ];

  // Calculate statistics
  const totalActivities = activityData.length;
  const completedActivities = activityData.filter(a => a.status === "completed").length;
  const presentDays = attendanceData.filter(a => a.status === "present").length;
  const totalAttendanceDays = attendanceData.length / children.length;
  const attendanceRate = totalAttendanceDays > 0 ? Math.round((presentDays / attendanceData.length) * 100) : 0;

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
        <select
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-background"
        >
          <option value="all">All Children</option>
          {children.map(child => (
            <option key={child.id} value={child.id}>{child.name}</option>
          ))}
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-background"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold">{totalActivities}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedActivities}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold">{attendanceRate}%</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                <p className="text-2xl font-bold">24.5</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Activity and Attendance */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Log</CardTitle>
              <CardDescription>
                All activities from your children in chronological order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={activityColumns}
                data={activityData}
                searchKey="action"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Daily attendance tracking for all your children
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={attendanceColumns}
                data={attendanceData}
                searchKey="childName"
              />
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children.map(child => {
              const childAttendance = attendanceData.filter(a => a.childName === child.name);
              const presentCount = childAttendance.filter(a => a.status === "present").length;
              const rate = childAttendance.length > 0 ? Math.round((presentCount / childAttendance.length) * 100) : 0;

              return (
                <Card key={child.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{child.name}</CardTitle>
                      <Badge variant={rate >= 90 ? "default" : rate >= 80 ? "secondary" : "destructive"}>
                        {rate}% Attendance
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={rate} className="h-3" />
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                          <p className="text-xs text-muted-foreground">Present</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-amber-600">
                            {childAttendance.filter(a => a.status === "late").length}
                          </p>
                          <p className="text-xs text-muted-foreground">Late</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-600">
                            {childAttendance.filter(a => a.status === "absent").length}
                          </p>
                          <p className="text-xs text-muted-foreground">Absent</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {childAttendance.filter(a => a.status === "excused").length}
                          </p>
                          <p className="text-xs text-muted-foreground">Excused</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Distribution</CardTitle>
                <CardDescription>Breakdown by activity type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["practice", "achievement", "test", "attendance"].map(type => {
                    const count = activityData.filter(a => a.type === type).length;
                    const percentage = totalActivities > 0 ? Math.round((count / totalActivities) * 100) : 0;

                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{type}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity Pattern</CardTitle>
                <CardDescription>Most active times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Most Active Day</span>
                    <Badge>Wednesday</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Peak Study Time</span>
                    <Badge>3:00 PM - 5:00 PM</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Session</span>
                    <Badge>45 minutes</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Weekly Streak</span>
                    <Badge variant="secondary">5 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}