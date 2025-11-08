"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { useActivityContext } from "../layout";
import { type ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
} from "lucide-react";

// Attendance record structure
interface AttendanceRecord {
  id: string;
  childName: string;
  date: Date;
  status: "present" | "absent" | "late" | "excused";
  class: string;
  notes?: string;
}

export default function ParentAttendancePage() {
  return (
    <ProtectedRoute>
      <AttendanceContent />
    </ProtectedRoute>
  );
}

function AttendanceContent() {
  const { attendanceData, children } = useActivityContext();

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

  // Calculate attendance statistics
  const totalDays = Math.ceil(attendanceData.length / children.length);
  const presentCount = attendanceData.filter(a => a.status === "present").length;
  const absentCount = attendanceData.filter(a => a.status === "absent").length;
  const lateCount = attendanceData.filter(a => a.status === "late").length;
  const excusedCount = attendanceData.filter(a => a.status === "excused").length;

  const attendanceRate = totalDays > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0;
  const punctualityRate = totalDays > 0 ? Math.round(((presentCount) / (presentCount + lateCount)) * 100) : 0;

  // Group attendance by child
  const attendanceByChild = children.map(child => {
    const childAttendance = attendanceData.filter(a => a.childName === child.name);
    const childPresent = childAttendance.filter(a => a.status === "present").length;
    const childTotal = childAttendance.length;
    const rate = childTotal > 0 ? Math.round((childPresent / childTotal) * 100) : 0;

    return {
      name: child.name,
      present: childPresent,
      total: childTotal,
      rate,
    };
  });

  return (
    <div className="space-y-6">
      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold">{attendanceRate}%</p>
                {attendanceRate >= 90 ? (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    Excellent
                  </p>
                ) : attendanceRate >= 80 ? (
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3" />
                    Needs Improvement
                  </p>
                ) : (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    Critical
                  </p>
                )}
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Present Days</p>
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Total: {attendanceData.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Absent Days</p>
                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Late: {lateCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Punctuality</p>
                <p className="text-2xl font-bold">{punctualityRate}%</p>
                <p className="text-xs text-muted-foreground">On-time rate</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance by Child */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Attendance</CardTitle>
          <CardDescription>
            Attendance breakdown for each child
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {attendanceByChild.map(child => (
            <div key={child.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{child.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {child.present}/{child.total} days
                  </span>
                  <Badge variant={child.rate >= 90 ? "default" : child.rate >= 80 ? "secondary" : "destructive"}>
                    {child.rate}%
                  </Badge>
                </div>
              </div>
              <Progress value={child.rate} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Detailed attendance history for all children
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

      {/* Weekly Pattern */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance Pattern</CardTitle>
          <CardDescription>
            Attendance trends throughout the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => {
              // Mock data for weekly pattern
              const dayAttendance = Math.round(85 + Math.random() * 15);
              return (
                <div key={day} className="text-center space-y-2">
                  <p className="text-sm font-medium">{day.slice(0, 3)}</p>
                  <div className="mx-auto h-20 w-full bg-muted rounded-md relative overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full bg-primary transition-all"
                      style={{ height: `${dayAttendance}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{dayAttendance}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}