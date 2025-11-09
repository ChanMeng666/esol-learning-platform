"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { getOrganizationClassesWithStats } from "@/actions/school-admin-stats";
import { toast } from "sonner";
import {
  BookOpen,
  Users,
  GraduationCap,
  Building2,
  Plus,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Class {
  id: bigint;
  name: string;
  teacherName: string | null;
  teacherEmail: string | null;
  departmentName: string | null;
  gradeLevelName: string | null;
  studentCount: number;
  academicYear: string;
  isActive: boolean;
}

export default function SchoolAdminClassesPage() {
  return (
    <ProtectedRoute>
      <ClassesPageContent />
    </ProtectedRoute>
  );
}

function ClassesPageContent() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    try {
      setIsLoading(true);
      const data = await getOrganizationClassesWithStats();
      setClasses(data);
    } catch (error) {
      console.error("Failed to load classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  }

  // Table columns
  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: "name",
      header: "Class Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          {row.original.teacherName && (
            <p className="text-sm text-muted-foreground">
              {row.original.teacherName}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "departmentName",
      header: "Department",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span>{row.original.departmentName || "—"}</span>
        </div>
      ),
    },
    {
      accessorKey: "gradeLevelName",
      header: "Grade",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.gradeLevelName || "—"}</span>
      ),
    },
    {
      accessorKey: "studentCount",
      header: "Students",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{row.getValue("studentCount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "academicYear",
      header: "Academic Year",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("academicYear")}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? (
              <><CheckCircle2 className="w-3 h-3 mr-1" />Active</>
            ) : (
              <><XCircle className="w-3 h-3 mr-1" />Inactive</>
            )}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/school-admin/classes/${row.original.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/school-admin/classes/${row.original.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Calculate statistics
  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);
  const activeClasses = classes.filter((cls) => cls.isActive).length;
  const avgStudentsPerClass = activeClasses > 0 ? Math.round(totalStudents / activeClasses) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
        <Button onClick={() => router.push("/school-admin/classes/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Class
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{classes.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                <p className="text-2xl font-bold">{activeClasses}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg per Class</p>
                <p className="text-2xl font-bold">{avgStudentsPerClass}</p>
              </div>
              <Users className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={classes}
            searchKey="name"
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
