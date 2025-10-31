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
  GraduationCap,
  Users,
  Star,
  BookOpen,
  Clock,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Award,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  specialization: string;
  status: "active" | "on-leave" | "part-time";
  classCount: number;
  studentCount: number;
  averageScore: number;
  attendanceRate: number;
  satisfaction: number;
  joinedDate: Date;
  lastActive?: Date;
}

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "on-leave", label: "On Leave" },
      { value: "part-time", label: "Part-time" },
    ],
  },
  {
    id: "specialization",
    label: "Specialization",
    type: "multiselect",
    options: [
      { value: "listening", label: "Listening" },
      { value: "speaking", label: "Speaking" },
      { value: "reading", label: "Reading" },
      { value: "writing", label: "Writing" },
    ],
  },
];

export default function DepartmentTeachersPage() {
  return (
    <ProtectedRoute>
      <TeachersPageContent />
    </ProtectedRoute>
  );
}

function TeachersPageContent() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        // Mock data - replace with actual API call
        const mockTeachers: Teacher[] = [
          {
            id: "t1",
            name: "Dr. Michael Anderson",
            email: "m.anderson@school.edu",
            phone: "(555) 123-4567",
            specialization: "speaking",
            status: "active",
            classCount: 3,
            studentCount: 72,
            averageScore: 87,
            attendanceRate: 94,
            satisfaction: 4.8,
            joinedDate: new Date(2023, 0, 15),
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            id: "t2",
            name: "Ms. Jennifer Lee",
            email: "j.lee@school.edu",
            phone: "(555) 234-5678",
            specialization: "writing",
            status: "active",
            classCount: 2,
            studentCount: 48,
            averageScore: 79,
            attendanceRate: 88,
            satisfaction: 4.5,
            joinedDate: new Date(2023, 2, 10),
            lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
          },
          {
            id: "t3",
            name: "Prof. Robert Taylor",
            email: "r.taylor@school.edu",
            phone: "(555) 345-6789",
            specialization: "reading",
            status: "active",
            classCount: 4,
            studentCount: 96,
            averageScore: 91,
            attendanceRate: 96,
            satisfaction: 4.9,
            joinedDate: new Date(2022, 8, 5),
            lastActive: new Date(Date.now() - 30 * 60 * 1000),
          },
          {
            id: "t4",
            name: "Ms. Sarah Chen",
            email: "s.chen@school.edu",
            specialization: "listening",
            status: "part-time",
            classCount: 2,
            studentCount: 44,
            averageScore: 83,
            attendanceRate: 91,
            satisfaction: 4.6,
            joinedDate: new Date(2023, 5, 20),
            lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
          },
        ];

        setTeachers(mockTeachers);
      } catch (error) {
        console.error("Failed to load teachers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeachers();
  }, []);

  // Table columns
  const columns: ColumnDef<Teacher>[] = [
    {
      accessorKey: "name",
      header: "Teacher",
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
      accessorKey: "specialization",
      header: "Specialization",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("specialization")}
        </Badge>
      ),
    },
    {
      accessorKey: "classCount",
      header: "Classes",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <span>{row.getValue("classCount")}</span>
        </div>
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
      accessorKey: "averageScore",
      header: "Avg Score",
      cell: ({ row }) => {
        const score = row.getValue("averageScore") as number;
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{score}%</span>
            </div>
            <Progress value={score} className="h-1.5" />
          </div>
        );
      },
    },
    {
      accessorKey: "satisfaction",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">{row.getValue("satisfaction")}</span>
          <span className="text-muted-foreground text-sm">/5.0</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const icons = {
          active: <CheckCircle2 className="w-3 h-3 mr-1" />,
          "on-leave": <Clock className="w-3 h-3 mr-1" />,
          "part-time": <AlertCircle className="w-3 h-3 mr-1" />,
        };
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          active: "default",
          "on-leave": "secondary",
          "part-time": "outline",
        };
        return (
          <Badge variant={variants[status]}>
            {icons[status]}
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
            onClick={() => router.push(`/department/teachers/${row.original.id}`)}
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
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.status === "active").length;
  const totalStudents = teachers.reduce((sum, t) => sum + t.studentCount, 0);
  const avgSatisfaction = teachers.length > 0
    ? (teachers.reduce((sum, t) => sum + t.satisfaction, 0) / teachers.length).toFixed(1)
    : "0.0";
  const avgScore = teachers.length > 0
    ? Math.round(teachers.reduce((sum, t) => sum + t.averageScore, 0) / teachers.length)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Department Teachers</h1>
          <p className="text-muted-foreground">
            Manage and monitor teacher performance in your department
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold">{totalTeachers}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeTeachers}</p>
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
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{avgSatisfaction}</p>
              </div>
              <Star className="h-8 w-8 text-amber-500" />
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
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teachers.filter(t => t.status === "active").map(teacher => (
          <Card key={teacher.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/department/teachers/${teacher.id}`)}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={teacher.avatar} />
                  <AvatarFallback>
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-base">{teacher.name}</CardTitle>
                  <CardDescription className="capitalize">{teacher.specialization}</CardDescription>
                </div>
                <Badge variant={teacher.status === "active" ? "default" : "secondary"}>
                  {teacher.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Classes</span>
                <span className="font-medium">{teacher.classCount} classes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Students</span>
                <span className="font-medium">{teacher.studentCount} students</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{teacher.satisfaction}/5.0</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg Score</span>
                  <span className="font-medium">{teacher.averageScore}%</span>
                </div>
                <Progress value={teacher.averageScore} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>
            Complete list of all department teachers
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
            data={teachers}
            searchKey="name"
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
