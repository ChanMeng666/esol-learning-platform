"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { Progress } from "@/components/ui/progress";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  MoreVertical,
  Award,
  Activity,
  BookOpen,
  Target,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  headName: string;
  headEmail: string;
  teacherCount: number;
  studentCount: number;
  classCount: number;
  averageScore: number;
  completionRate: number;
  status: "excellent" | "good" | "needs_attention";
  budget: number;
  budgetUsed: number;
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
        // Mock data - replace with actual API call
        const mockDepartments: Department[] = [
          {
            id: "1",
            name: "English Language Department",
            headName: "Dr. Michael Anderson",
            headEmail: "m.anderson@school.edu",
            teacherCount: 12,
            studentCount: 285,
            classCount: 18,
            averageScore: 86,
            completionRate: 92,
            status: "excellent",
            budget: 150000,
            budgetUsed: 98000,
          },
          {
            id: "2",
            name: "ESOL Foundation",
            headName: "Ms. Jennifer Lee",
            headEmail: "j.lee@school.edu",
            teacherCount: 8,
            studentCount: 156,
            classCount: 12,
            averageScore: 79,
            completionRate: 85,
            status: "good",
            budget: 100000,
            budgetUsed: 72000,
          },
          {
            id: "3",
            name: "Advanced Studies",
            headName: "Prof. Robert Taylor",
            headEmail: "r.taylor@school.edu",
            teacherCount: 6,
            studentCount: 98,
            classCount: 8,
            averageScore: 91,
            completionRate: 95,
            status: "excellent",
            budget: 80000,
            budgetUsed: 54000,
          },
          {
            id: "4",
            name: "Business English",
            headName: "Ms. Sarah Chen",
            headEmail: "s.chen@school.edu",
            teacherCount: 9,
            studentCount: 124,
            classCount: 10,
            averageScore: 82,
            completionRate: 88,
            status: "good",
            budget: 120000,
            budgetUsed: 89000,
          },
        ];

        setDepartments(mockDepartments);
      } catch (error) {
        console.error("Failed to load departments:", error);
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
          <p className="text-sm text-muted-foreground">
            Head: {row.original.headName}
          </p>
        </div>
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
      accessorKey: "studentCount",
      header: "Students",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
          {row.getValue("studentCount")}
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
      accessorKey: "averageScore",
      header: "Avg Score",
      cell: ({ row }) => {
        const score = row.getValue("averageScore") as number;
        const color = score >= 85 ? "text-green-500" : score >= 75 ? "text-amber-500" : "text-red-500";
        return (
          <span className={`font-medium ${color}`}>
            {score}%
          </span>
        );
      },
    },
    {
      accessorKey: "completionRate",
      header: "Completion",
      cell: ({ row }) => (
        <div className="w-full">
          <div className="flex justify-between mb-1 text-xs">
            <span>{row.getValue("completionRate")}%</span>
          </div>
          <Progress value={row.getValue("completionRate")} className="h-2" />
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
          excellent: "default",
          good: "secondary",
          needs_attention: "destructive",
        };
        const icons = {
          excellent: <CheckCircle2 className="w-3 h-3 mr-1" />,
          good: <Activity className="w-3 h-3 mr-1" />,
          needs_attention: <AlertCircle className="w-3 h-3 mr-1" />,
        };
        return (
          <Badge variant={variants[status]}>
            {icons[status]}
            {status.replace('_', ' ')}
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
  const totalStudents = departments.reduce((sum, dept) => sum + dept.studentCount, 0);
  const totalClasses = departments.reduce((sum, dept) => sum + dept.classCount, 0);
  const avgScore = departments.length > 0
    ? departments.reduce((sum, dept) => sum + dept.averageScore, 0) / departments.length
    : 0;
  const avgCompletion = departments.length > 0
    ? departments.reduce((sum, dept) => sum + dept.completionRate, 0) / departments.length
    : 0;

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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage all school departments and their resources
          </p>
        </div>
        <Button onClick={() => router.push("/school-admin/departments/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Department
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{avgScore.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">{avgCompletion.toFixed(0)}%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {departments.map(dept => (
          <Card key={dept.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/school-admin/departments/${dept.id}`)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{dept.name}</CardTitle>
                  <CardDescription>{dept.headName}</CardDescription>
                </div>
                <Badge variant={
                  dept.status === "excellent" ? "default" :
                  dept.status === "good" ? "secondary" :
                  "destructive"
                }>
                  {dept.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-2xl font-bold">{dept.teacherCount}</p>
                  <p className="text-xs text-muted-foreground">Teachers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{dept.studentCount}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{dept.classCount}</p>
                  <p className="text-xs text-muted-foreground">Classes</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="font-medium">{dept.averageScore}%</span>
                </div>
                <Progress value={dept.averageScore} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Used</span>
                  <span className="font-medium">
                    ${(dept.budgetUsed / 1000).toFixed(0)}K / ${(dept.budget / 1000).toFixed(0)}K
                  </span>
                </div>
                <Progress value={(dept.budgetUsed / dept.budget) * 100} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
          <CardDescription>
            Detailed view of all departments and their metrics
          </CardDescription>
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