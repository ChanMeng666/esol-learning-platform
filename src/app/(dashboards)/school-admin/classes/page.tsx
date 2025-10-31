"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { AdvancedFilter, type FilterConfig, type FilterValue } from "@/components/filters/advanced-filter";
import { Progress } from "@/components/ui/progress";
import { type ColumnDef } from "@tanstack/react-table";
import {
  GraduationCap,
  Users,
  User,
  Calendar,
  Clock,
  Plus,
  Edit,
  Eye,
  BookOpen,
  Target,
  Activity,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Class {
  id: string;
  name: string;
  code: string;
  department: string;
  teacher: string;
  teacherEmail: string;
  level: string;
  studentCount: number;
  maxCapacity: number;
  schedule: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "upcoming" | "completed";
  averageScore: number;
  attendanceRate: number;
}

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    id: "department",
    label: "Department",
    type: "multiselect",
    options: [
      { value: "english", label: "English Language" },
      { value: "esol", label: "ESOL Foundation" },
      { value: "advanced", label: "Advanced Studies" },
      { value: "business", label: "Business English" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "upcoming", label: "Upcoming" },
      { value: "completed", label: "Completed" },
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
];

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
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        // Mock data - replace with actual API call
        const mockClasses: Class[] = [
          {
            id: "1",
            name: "Advanced English Conversation",
            code: "ENG-401",
            department: "english",
            teacher: "Dr. Michael Anderson",
            teacherEmail: "m.anderson@school.edu",
            level: "level-4",
            studentCount: 24,
            maxCapacity: 30,
            schedule: "Mon/Wed/Fri 10:00-11:30",
            startDate: new Date(2024, 0, 15),
            endDate: new Date(2024, 5, 30),
            status: "active",
            averageScore: 87,
            attendanceRate: 94,
          },
          {
            id: "2",
            name: "ESOL Foundation Writing",
            code: "ESOL-101",
            department: "esol",
            teacher: "Ms. Jennifer Lee",
            teacherEmail: "j.lee@school.edu",
            level: "foundation",
            studentCount: 18,
            maxCapacity: 25,
            schedule: "Tue/Thu 9:00-10:30",
            startDate: new Date(2024, 0, 20),
            endDate: new Date(2024, 5, 25),
            status: "active",
            averageScore: 79,
            attendanceRate: 88,
          },
          {
            id: "3",
            name: "Business English Communication",
            code: "BUS-301",
            department: "business",
            teacher: "Ms. Sarah Chen",
            teacherEmail: "s.chen@school.edu",
            level: "level-3",
            studentCount: 20,
            maxCapacity: 25,
            schedule: "Mon/Thu 2:00-3:30",
            startDate: new Date(2024, 1, 1),
            endDate: new Date(2024, 6, 15),
            status: "active",
            averageScore: 83,
            attendanceRate: 91,
          },
          {
            id: "4",
            name: "Academic Reading Level 2",
            code: "READ-201",
            department: "english",
            teacher: "Prof. Robert Taylor",
            teacherEmail: "r.taylor@school.edu",
            level: "level-2",
            studentCount: 22,
            maxCapacity: 30,
            schedule: "Tue/Fri 1:00-2:30",
            startDate: new Date(2024, 2, 1),
            endDate: new Date(2024, 7, 15),
            status: "upcoming",
            averageScore: 0,
            attendanceRate: 0,
          },
        ];

        setClasses(mockClasses);
      } catch (error) {
        console.error("Failed to load classes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

  // Table columns
  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: "name",
      header: "Class",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          <p className="text-sm text-muted-foreground">{row.original.code}</p>
        </div>
      ),
    },
    {
      accessorKey: "teacher",
      header: "Teacher",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("teacher")}</span>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("department")}
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
      accessorKey: "studentCount",
      header: "Students",
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {row.original.studentCount}/{row.original.maxCapacity}
            </span>
          </div>
          <Progress
            value={(row.original.studentCount / row.original.maxCapacity) * 100}
            className="h-1.5"
          />
        </div>
      ),
    },
    {
      accessorKey: "schedule",
      header: "Schedule",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs">{row.getValue("schedule")}</span>
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
          upcoming: <Clock className="w-3 h-3 mr-1" />,
          completed: <CheckCircle2 className="w-3 h-3 mr-1" />,
        };
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          active: "default",
          upcoming: "secondary",
          completed: "outline",
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
  const totalClasses = classes.length;
  const activeClasses = classes.filter(c => c.status === "active").length;
  const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0);
  const avgAttendance = classes.length > 0
    ? classes.filter(c => c.status === "active").reduce((sum, c) => sum + c.attendanceRate, 0) / activeClasses
    : 0;
  const avgScore = classes.length > 0
    ? classes.filter(c => c.status === "active" && c.averageScore > 0).reduce((sum, c) => sum + c.averageScore, 0) /
      classes.filter(c => c.status === "active" && c.averageScore > 0).length
    : 0;

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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
          <p className="text-muted-foreground">
            Manage all school classes and schedules
          </p>
        </div>
        <Button onClick={() => router.push("/school-admin/classes/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Class
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{totalClasses}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
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
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enrolled Students</p>
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
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold">{avgAttendance.toFixed(0)}%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{avgScore.toFixed(0)}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.filter(c => c.status === "active").slice(0, 3).map(cls => (
          <Card key={cls.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/school-admin/classes/${cls.id}`)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{cls.name}</CardTitle>
                  <CardDescription>{cls.code}</CardDescription>
                </div>
                <Badge variant={cls.status === "active" ? "default" : "secondary"}>
                  {cls.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Teacher</span>
                <span className="font-medium">{cls.teacher}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Students</span>
                <span className="font-medium">{cls.studentCount}/{cls.maxCapacity}</span>
              </div>
              <Progress value={(cls.studentCount / cls.maxCapacity) * 100} />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {cls.schedule}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
          <CardDescription>
            Complete list of all school classes
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
            data={classes}
            searchKey="name"
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}