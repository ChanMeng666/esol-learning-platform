"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/shared/empty-state";
import { useClassContext } from "./context";
import { Users } from "lucide-react";

// Define columns for students in class
const studentColumns = [
  {
    accessorKey: "student",
    header: "Student Name",
    cell: ({ row }: any) => {
      const student = row.original.student;
      return <span className="font-medium">{student?.fullName || "N/A"}</span>;
    },
  },
  {
    accessorKey: "student",
    header: "Email",
    cell: ({ row }: any) => {
      const student = row.original.student;
      return <span className="text-muted-foreground">{student?.email || "N/A"}</span>;
    },
  },
  {
    accessorKey: "avgProgress",
    header: "Progress",
    cell: ({ row }: any) => {
      const progress = Math.round(row.original.avgProgress || 0);
      const variant = progress >= 80 ? "default" : progress >= 60 ? "secondary" : "outline";
      return <Badge variant={variant as any}>{progress}%</Badge>;
    },
  },
  {
    accessorKey: "nzcelProgress",
    header: "Questions Completed",
    cell: ({ row }: any) => {
      const count = row.original.nzcelProgress?.questionsCompleted || 0;
      return <span className="text-sm">{count}</span>;
    },
  },
  {
    accessorKey: "nzcelProgress",
    header: "Total Points",
    cell: ({ row }: any) => {
      const points = row.original.nzcelProgress?.totalPoints || 0;
      return <span className="text-sm font-medium">{points}</span>;
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
  const { classData, students } = useClassContext();

  // Calculate statistics from real data
  const totalStudents = students.length;
  const avgProgress = totalStudents > 0
    ? Math.round(students.reduce((sum, s) => sum + s.avgProgress, 0) / totalStudents)
    : 0;

  return (
    <div className="space-y-8">
      {/* Simplified Stats - Only show if there are students */}
      {totalStudents > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgProgress}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>
            {totalStudents} {totalStudents === 1 ? "student" : "students"} enrolled in {classData.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalStudents === 0 ? (
            <EmptyState
              title="No students enrolled"
              description="Students will appear here once they are added to this class"
              icon={<Users className="w-16 h-16" />}
            />
          ) : (
            <DataTable columns={studentColumns} data={students} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}