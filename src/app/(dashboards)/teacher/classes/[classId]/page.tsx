"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useClassContext } from "./context";
import { UserPlus, Download, Mail } from "lucide-react";

// Define columns for students in class
const studentColumns = [
  {
    accessorKey: "name",
    header: "Student Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "attendance",
    header: "Attendance",
    cell: ({ row }: any) => {
      const attendance = row.original.attendance || 0;
      return (
        <div className="flex items-center gap-2">
          <Progress value={attendance} className="w-20 h-2" />
          <span className="text-xs text-muted-foreground">{attendance}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }: any) => {
      const progress = row.original.progress || 0;
      return (
        <div className="flex items-center gap-2">
          <Progress value={progress} className="w-20 h-2" />
          <span className="text-xs font-medium">{progress}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "grade",
    header: "Current Grade",
    cell: ({ row }: any) => {
      const grade = row.original.grade;
      const gradeColor = grade >= 90 ? "success" : grade >= 80 ? "secondary" : grade >= 70 ? "default" : "destructive";
      return <Badge variant={gradeColor as any}>{grade}%</Badge>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }: any) => {
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">View</Button>
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function ClassStudentsPage() {
  return (
    <ProtectedRoute>
      <StudentsContent />
    </ProtectedRoute>
  );
}

function StudentsContent() {
  const { classData } = useClassContext();

  // Mock student data for the class
  const mockStudents = [
    { id: "1", name: "Alex Chen", email: "alex@example.com", attendance: 95, progress: 87, grade: 92 },
    { id: "2", name: "Sarah Kim", email: "sarah@example.com", attendance: 88, progress: 92, grade: 88 },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", attendance: 75, progress: 68, grade: 72 },
    { id: "4", name: "Emma Wilson", email: "emma@example.com", attendance: 92, progress: 85, grade: 86 },
    { id: "5", name: "James Lee", email: "james@example.com", attendance: 100, progress: 95, grade: 94 },
    { id: "6", name: "Lisa Wang", email: "lisa@example.com", attendance: 85, progress: 78, grade: 80 },
    { id: "7", name: "Tom Davis", email: "tom@example.com", attendance: 70, progress: 62, grade: 65 },
    { id: "8", name: "Amy Zhang", email: "amy@example.com", attendance: 96, progress: 89, grade: 91 },
  ];

  return (
    <div className="space-y-6">
      {/* Students Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStudents.length}</div>
            <p className="text-xs text-muted-foreground">Enrolled in class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Average Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.6%</div>
            <Progress value={85.6} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79.9%</div>
            <Progress value={79.9} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82.1%</div>
            <Badge variant="secondary" className="mt-2">Good</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Roster</CardTitle>
              <CardDescription>
                Manage and track student progress in {classData.name}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={studentColumns} data={mockStudents} />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Send Class Announcement</Button>
            <Button variant="outline">Generate Progress Report</Button>
            <Button variant="outline">Schedule Parent Meetings</Button>
            <Button variant="outline">Export Gradebook</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}