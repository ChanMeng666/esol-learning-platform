"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { LoadingState } from "@/components/shared/loading-state";
import { type ColumnDef } from "@tanstack/react-table";
import { Users, User, Clock, Eye, CheckCircle2 } from "lucide-react";
import { getDepartmentClasses } from "@/actions/department-data";
import { toast } from "sonner";

interface DepartmentClass {
  id: bigint;
  organizationId: bigint;
  name: string;
  code: string | null;
  schedule: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  departmentId: bigint | null;
  gradeLevelId: bigint | null;
  teacherId: bigint | null;
  academicYear: string | null;
  createdAt: Date;
  updatedAt: Date;
  studentCount: number;
  teacherName: string;
  status: string;
}

export default function DepartmentClassesPage() {
  return (
    <ProtectedRoute>
      <ClassesPageContent />
    </ProtectedRoute>
  );
}

function ClassesPageContent() {
  const [classes, setClasses] = useState<DepartmentClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    try {
      setIsLoading(true);
      const data = await getDepartmentClasses();
      setClasses(data as DepartmentClass[]);
    } catch (error) {
      console.error("Failed to load classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  }

  // Table columns
  const columns: ColumnDef<DepartmentClass>[] = [
    {
      accessorKey: "name",
      header: "Class Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          {row.original.code && (
            <p className="text-sm text-muted-foreground">{row.original.code}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "teacherName",
      header: "Teacher",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("teacherName")}</span>
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
      accessorKey: "schedule",
      header: "Schedule",
      cell: ({ row }) => {
        const schedule = row.getValue("schedule") as string | null;
        return schedule ? (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs">{schedule}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Not scheduled</span>
        );
      },
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
              <>
                <Clock className="w-3 h-3 mr-1" />
                Inactive
              </>
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
          onClick={() => window.location.href = `/department/classes/${row.original.id}`}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingState message="Loading classes..." fullScreen />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
        <p className="text-muted-foreground">
          Department classes overview
        </p>
      </div>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
          <CardDescription>
            {classes.length} {classes.length === 1 ? "class" : "classes"} in your department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={classes}
            searchKey="name"
            pageSize={20}
          />
        </CardContent>
      </Card>
    </div>
  );
}
