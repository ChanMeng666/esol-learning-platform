"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useActivityContext } from "./context";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  Clock,
  Calendar,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  FileText,
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

export default function ParentActivityPage() {
  return (
    <ProtectedRoute>
      <ActivityContent />
    </ProtectedRoute>
  );
}

function ActivityContent() {
  const { activityData, attendanceData, children } = useActivityContext();

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

  // Calculate statistics
  const totalActivities = activityData.length;
  const completedActivities = activityData.filter(a => a.status === "completed").length;
  const presentDays = attendanceData.filter(a => a.status === "present").length;
  const totalAttendanceDays = attendanceData.length / children.length;
  const attendanceRate = totalAttendanceDays > 0 ? Math.round((presentDays / attendanceData.length) * 100) : 0;

  return (
    <div className="space-y-6">
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

      {/* Activity Log */}
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
    </div>
  );
}