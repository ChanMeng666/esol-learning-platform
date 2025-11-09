"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { getDepartmentsWithStats } from "@/actions/school-admin-stats";
import { toast } from "sonner";
import {
  Building2,
  Users,
  Plus,
  Edit,
  Eye,
  BookOpen,
} from "lucide-react";

interface Department {
  id: bigint;
  name: string;
  headName: string | null;
  headEmail: string | null;
  teacherCount: number;
  classCount: number;
}

export default function SchoolAdminDepartmentsPage() {
  return (
    <ProtectedRoute>
      <DepartmentsPageContent />
    </ProtectedRoute>
  );
}

function DepartmentsPageContent() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await getDepartmentsWithStats();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to load departments:", error);
        toast.error("Failed to load departments");
      } finally {
        setIsLoading(false);
      }
    };

    loadDepartments();
  }, []);

  // Table columns
  const columns: ColumnDef<Department>[] = [
    {
      accessorKey: "name",
      header: "Department",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          {row.original.headName && (
            <p className="text-sm text-muted-foreground">
              Head: {row.original.headName}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "headEmail",
      header: "Contact",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.headEmail || "—"}
        </span>
      ),
    },
    {
      accessorKey: "teacherCount",
      header: "Teachers",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          {row.getValue("teacherCount")}
        </div>
      ),
    },
    {
      accessorKey: "classCount",
      header: "Classes",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          {row.getValue("classCount")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/school-admin/departments/${row.original.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/school-admin/departments/${row.original.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Calculate statistics
  const totalTeachers = departments.reduce((sum, dept) => sum + dept.teacherCount, 0);
  const totalClasses = departments.reduce((sum, dept) => sum + dept.classCount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <Button onClick={() => router.push("/school-admin/departments/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Department
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold">{totalTeachers}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{totalClasses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={departments}
            searchKey="name"
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
