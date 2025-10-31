"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { AdvancedFilter, type FilterConfig, type FilterValue } from "@/components/filters/advanced-filter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Target,
  Award,
  Eye,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  class: string;
  level: string;
  status: "active" | "at-risk" | "on-leave";
  averageScore: number;
  attendanceRate: number;
  completedActivities: number;
  totalActivities: number;
  trend: "up" | "down" | "stable";
  lastActive: Date;
}

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "at-risk", label: "At Risk" },
      { value: "on-leave", label: "On Leave" },
    ],
  },
  {
    id: "level",
    label: "Level",
    type: "multiselect",
    options: [
      { value: "foundation", label: "Foundation" },
      { value: "level-1", label: "Level 1" },
      { value: "level-2", label: "Level 2" },
      { value: "level-3", label: "Level 3" },
      { value: "level-4", label: "Level 4" },
    ],
  },
  {
    id: "class",
    label: "Class",
    type: "multiselect",
    options: [
      { value: "eng-401", label: "ENG-401" },
      { value: "esol-101", label: "ESOL-101" },
      { value: "bus-301", label: "BUS-301" },
      { value: "read-201", label: "READ-201" },
    ],
  },
];

export default function DepartmentStudentsPage() {
  return (
    <ProtectedRoute>
      <StudentsPageContent />
    </ProtectedRoute>
  );
}

function StudentsPageContent() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        // Mock data - replace with actual API call
        const mockStudents: Student[] = [
          {
            id: "s1",
            name: "Alice Johnson",
            email: "alice.j@student.edu",
            class: "ENG-401",
            level: "level-4",
            status: "active",
            averageScore: 87,
            attendanceRate: 95,
            completedActivities: 42,
            totalActivities: 50,
            trend: "up",
            lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
          },
          {
            id: "s2",
            name: "Bob Smith",
            email: "bob.s@student.edu",
            class: "ESOL-101",
            level: "foundation",
            status: "active",
            averageScore: 76,
            attendanceRate: 88,
            completedActivities: 35,
            totalActivities: 50,
            trend: "stable",
            lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
          },
          {
            id: "s3",
            name: "Charlie Davis",
            email: "charlie.d@student.edu",
            class: "BUS-301",
            level: "level-3",
            status: "at-risk",
            averageScore: 62,
            attendanceRate: 72,
            completedActivities: 28,
            totalActivities: 50,
            trend: "down",
            lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
          {
            id: "s4",
            name: "Diana Martinez",
            email: "diana.m@student.edu",
            class: "READ-201",
            level: "level-2",
            status: "active",
            averageScore: 91,
            attendanceRate: 97,
            completedActivities: 48,
            totalActivities: 50,
            trend: "up",
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            id: "s5",
            name: "Ethan Wilson",
            email: "ethan.w@student.edu",
            class: "ENG-401",
            level: "level-4",
            status: "active",
            averageScore: 83,
            attendanceRate: 92,
            completedActivities: 40,
            totalActivities: 50,
            trend: "stable",
            lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
          },
        ];

        setStudents(mockStudents);
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Table columns
  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: "Student",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback>
              {row.original.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.getValue("name")}</p>
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "class",
      header: "Class",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue("class")}
        </Badge>
      ),
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.getValue("level")}
        </Badge>
      ),
    },
    {
      accessorKey: "averageScore",
      header: "Avg Score",
      cell: ({ row }) => {
        const score = row.getValue("averageScore") as number;
        const trend = row.original.trend;
        const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{score}%</span>
              {TrendIcon && <TrendIcon className={`w-3 h-3 ${trend === "up" ? "text-green-500" : "text-red-500"}`} />}
            </div>
            <Progress value={score} className="h-1.5" />
          </div>
        );
      },
    },
    {
      accessorKey: "attendanceRate",
      header: "Attendance",
      cell: ({ row }) => {
        const rate = row.getValue("attendanceRate") as number;
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{rate}%</span>
            {rate >= 90 ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : rate >= 75 ? (
              <Clock className="w-4 h-4 text-amber-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "completedActivities",
      header: "Progress",
      cell: ({ row }) => {
        const completed = row.original.completedActivities;
        const total = row.original.totalActivities;
        const percentage = (completed / total) * 100;
        return (
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {completed}/{total}
            </div>
            <Progress value={percentage} className="h-1.5" />
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
          active: "default",
          "at-risk": "destructive",
          "on-leave": "secondary",
        };
        return (
          <Badge variant={variants[status]} className="capitalize">
            {status}
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
            onClick={() => router.push(`/department/students/${row.original.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = `mailto:${row.original.email}`}
          >
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  const atRiskStudents = students.filter(s => s.status === "at-risk").length;
  const avgScore = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)
    : 0;
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Department Students</h1>
          <p className="text-muted-foreground">
            Monitor and support student progress in your department
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeStudents}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold">{atRiskStudents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{avgScore}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold">{avgAttendance}%</p>
              </div>
              <GraduationCap className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Students Alert */}
      {atRiskStudents > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <CardTitle className="text-base">Students Needing Attention</CardTitle>
                <CardDescription>
                  {atRiskStudents} student{atRiskStudents > 1 ? "s" : ""} may need additional support
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {students.filter(s => s.status === "at-risk").map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Score: {student.averageScore}% • Attendance: {student.attendanceRate}%
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => router.push(`/department/students/${student.id}`)}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Students with highest performance this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {students
              .filter(s => s.status === "active")
              .sort((a, b) => b.averageScore - a.averageScore)
              .slice(0, 3)
              .map((student, index) => (
                <div key={student.id} className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                     onClick={() => router.push(`/department/students/${student.id}`)}>
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className="text-lg font-bold">
                      #{index + 1}
                    </Badge>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-500 font-medium">{student.averageScore}%</span>
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            Complete list of all department students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdvancedFilter
            filters={filterConfig}
            values={filterValues}
            onChange={setFilterValues}
            onApply={(values) => console.log("Filters applied:", values)}
            onReset={() => setFilterValues({})}
          />
          <DataTable
            columns={columns}
            data={students}
            searchKey="name"
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
