"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { LoadingState } from "@/components/shared/loading-state";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getDepartmentStudents } from "@/actions/department-data";
import { toast } from "sonner";

interface DepartmentStudent {
  id: bigint;
  organizationId: bigint;
  stackUserId: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  className: string;
  averageProgress: number;
  totalPoints: number;
  questionsCompleted: number;
  currentLevel: string;
  cefrLevel: string;
  status: string;
  isAtRisk: boolean;
}

export default function DepartmentStudentsPage() {
  return (
    <ProtectedRoute>
      <StudentsPageContent />
    </ProtectedRoute>
  );
}

function StudentsPageContent() {
  const [students, setStudents] = useState<DepartmentStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setIsLoading(true);
      const data = await getDepartmentStudents();
      setStudents(data as DepartmentStudent[]);
    } catch (error) {
      console.error("Failed to load students:", error);
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  }

  // Table columns
  const columns: ColumnDef<DepartmentStudent>[] = [
    {
      accessorKey: "fullName",
      header: "Student Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("fullName")}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "className",
      header: "Class",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("className")}</span>
      ),
    },
    {
      accessorKey: "currentLevel",
      header: "Level",
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.getValue("currentLevel")}
        </Badge>
      ),
    },
    {
      accessorKey: "averageProgress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.getValue("averageProgress") as number;
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{progress}%</span>
            {progress < 60 && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.status === "active";
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Active
              </>
            ) : (
              "Inactive"
            )}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = `/department/students/${row.original.id}`}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  const atRiskStudents = students.filter(s => s.isAtRisk);

  if (isLoading) {
    return <LoadingState message="Loading students..." fullScreen />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          Department students overview
        </p>
      </div>

      {/* At-Risk Students Alert */}
      {atRiskStudents.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <CardTitle className="text-base">Students Needing Attention</CardTitle>
                <CardDescription>
                  {atRiskStudents.length} student{atRiskStudents.length > 1 ? "s" : ""} with progress below 60%
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {atRiskStudents.map(student => (
                <div key={student.id.toString()} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border">
                  <div>
                    <p className="font-medium text-sm">{student.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      Progress: {student.averageProgress}% • Class: {student.className}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `/department/students/${student.id}`}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            {students.length} {students.length === 1 ? "student" : "students"} in your department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={students}
            searchKey="fullName"
            pageSize={20}
          />
        </CardContent>
      </Card>
    </div>
  );
}
