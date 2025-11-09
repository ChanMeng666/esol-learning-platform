"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { LoadingState } from "@/components/shared/loading-state";
import { type ColumnDef } from "@tanstack/react-table";
import { BookOpen, Users, Eye, CheckCircle2 } from "lucide-react";
import { getDepartmentTeachers } from "@/actions/department-data";
import { toast } from "sonner";

interface DepartmentTeacher {
  id: bigint;
  fullName: string;
  email: string;
  classCount: number;
  studentCount: number;
  status: string;
  isActive: boolean;
}

export default function DepartmentTeachersPage() {
  return (
    <ProtectedRoute>
      <TeachersPageContent />
    </ProtectedRoute>
  );
}

function TeachersPageContent() {
  const [teachers, setTeachers] = useState<DepartmentTeacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadTeachers() {
    try {
      setIsLoading(true);
      const data = await getDepartmentTeachers();
      setTeachers(data as DepartmentTeacher[]);
    } catch (error) {
      console.error("Failed to load teachers:", error);
      toast.error("Failed to load teachers");
    } finally {
      setIsLoading(false);
    }
  }

  // Table columns
  const columns: ColumnDef<DepartmentTeacher>[] = [
    {
      accessorKey: "fullName",
      header: "Teacher Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("fullName")}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "classCount",
      header: "Classes",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("classCount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "studentCount",
      header: "Students",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("studentCount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
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
          onClick={() => window.location.href = `/department/teachers/${row.original.id}`}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingState message="Loading teachers..." fullScreen />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
        <p className="text-muted-foreground">
          Department teachers overview
        </p>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>
            {teachers.length} {teachers.length === 1 ? "teacher" : "teachers"} in your department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={teachers}
            searchKey="fullName"
            pageSize={20}
          />
        </CardContent>
      </Card>
    </div>
  );
}
