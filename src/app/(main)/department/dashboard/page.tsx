"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartRevenue } from "@/components/charts/chart-revenue";
import { ChartVisitors } from "@/components/charts/chart-visitors";
import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive";
import {
  Users,
  GraduationCap,
  TrendingUp,
  BookOpen,
  ArrowRight,
  UserCheck,
  Award,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

// Mock data - replace with actual API calls
interface Teacher {
  id: string;
  name: string;
  avatar?: string;
  totalClasses: number;
  totalStudents: number;
  averageScore: number;
  activeAssignments: number;
}

interface DepartmentClass {
  id: string;
  name: string;
  teacher: string;
  studentCount: number;
  averageScore: number;
  level: string;
}

export default function DepartmentDashboardPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<DepartmentClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      const mockTeachers: Teacher[] = [
        {
          id: "1",
          name: "Ms. Sarah Johnson",
          totalClasses: 4,
          totalStudents: 68,
          averageScore: 87,
          activeAssignments: 12,
        },
        {
          id: "2",
          name: "Mr. David Chen",
          totalClasses: 3,
          totalStudents: 52,
          averageScore: 82,
          activeAssignments: 9,
        },
        {
          id: "3",
          name: "Ms. Emily Brown",
          totalClasses: 3,
          totalStudents: 45,
          averageScore: 85,
          activeAssignments: 8,
        },
      ];

      const mockClasses: DepartmentClass[] = [
        {
          id: "1",
          name: "Advanced English Level 5",
          teacher: "Ms. Sarah Johnson",
          studentCount: 22,
          averageScore: 88,
          level: "Level 5",
        },
        {
          id: "2",
          name: "Intermediate English Level 3",
          teacher: "Mr. David Chen",
          studentCount: 25,
          averageScore: 81,
          level: "Level 3",
        },
        {
          id: "3",
          name: "General English Level 4",
          teacher: "Ms. Emily Brown",
          studentCount: 20,
          averageScore: 85,
          level: "Level 4",
        },
      ];

      setTeachers(mockTeachers);
      setClasses(mockClasses);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading department dashboard..." fullScreen />;
  }

  // Calculate statistics
  const totalTeachers = teachers.length;
  const totalStudents = teachers.reduce((sum, teacher) => sum + teacher.totalStudents, 0);
  const totalClasses = classes.length;
  const averageScore = classes.length > 0
    ? Math.round(classes.reduce((sum, cls) => sum + cls.averageScore, 0) / classes.length)
    : 0;

  // Mock trends (replace with real data from API)
  const mockTrends = {
    teachers: { value: 0, label: "no change" },
    students: { value: 8.5, label: "vs last semester" },
    classes: { value: 12.3, label: "vs last semester" },
    score: { value: 5.2, label: "vs last month" },
  };

  // Generate teacher performance data for bar chart
  const teacherPerformanceData = teachers.map((teacher) => ({
    label: teacher.name.split(" ").slice(-1)[0], // Last name only
    students: teacher.totalStudents,
    avgScore: teacher.averageScore,
  }));

  const teacherPerformanceConfig = {
    students: {
      label: "Total Students",
      color: "hsl(var(--chart-1))",
    },
    avgScore: {
      label: "Avg Score",
      color: "hsl(var(--chart-2))",
    },
  };

  // Generate class distribution data for pie chart
  const levelDistribution = classes.reduce((acc, cls) => {
    const existing = acc.find((item) => item.category === cls.level);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        category: cls.level,
        value: 1,
        fill: `hsl(var(--chart-${acc.length + 1}))`,
      });
    }
    return acc;
  }, [] as Array<{ category: string; value: number; fill: string }>);

  const levelDistributionConfig = levelDistribution.reduce((config, item, index) => {
    config[item.category] = {
      label: item.category,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  // Generate enrollment trend data for area chart
  const enrollmentData = [
    { date: "2024-01-15", enrolled: 145, active: 138 },
    { date: "2024-01-20", enrolled: 152, active: 145 },
    { date: "2024-01-25", enrolled: 158, active: 150 },
    { date: "2024-01-30", enrolled: 163, active: 155 },
    { date: "2024-02-04", enrolled: 165, active: 158 },
  ];

  const enrollmentConfig = {
    enrolled: {
      label: "Total Enrolled",
      color: "hsl(var(--chart-1))",
    },
    active: {
      label: "Active Students",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Department Dashboard</h1>
        <p className="text-muted-foreground">
          Oversee department performance, manage teachers, and track student outcomes
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          description="Active teaching staff"
          icon={UserCheck}
          trend={mockTrends.teachers}
          variant="primary"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          description="Across all classes"
          icon={Users}
          trend={mockTrends.students}
          variant="success"
        />
        <StatCard
          title="Total Classes"
          value={totalClasses}
          description="Active classes"
          icon={GraduationCap}
          trend={mockTrends.classes}
          variant="warning"
        />
        <StatCard
          title="Average Score"
          value={`${averageScore}%`}
          description="Department-wide"
          icon={Award}
          trend={mockTrends.score}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartAreaInteractive
          title="Student Enrollment Trend"
          description="Track enrollment and active students over time"
          data={enrollmentData}
          config={enrollmentConfig}
          defaultTimeRange="30d"
          timeRanges={[
            { value: "7d", label: "Last 7 days", days: 7 },
            { value: "30d", label: "Last 30 days", days: 30 },
          ]}
        />
        <ChartVisitors
          title="Class Distribution"
          description="Classes by level"
          data={levelDistribution}
          config={levelDistributionConfig}
          showSelector={false}
          centerLabel="Classes"
        />
      </div>

      {/* Teacher Performance Chart */}
      {teachers.length > 0 && (
        <ChartRevenue
          title="Teacher Performance Overview"
          description="Compare teacher workload and student outcomes"
          data={teacherPerformanceData}
          config={teacherPerformanceConfig}
          stacked={false}
          footerDescription="Current semester statistics"
        />
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Teaching Staff */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Teaching Staff</CardTitle>
                <CardDescription>Performance overview of your teachers</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/department/teachers")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {teachers.length === 0 ? (
              <EmptyState
                title="No teachers assigned"
                description="Contact your school administrator to assign teachers to your department"
              />
            ) : (
              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/department/teachers/${teacher.id}`)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={teacher.avatar} alt={teacher.name} />
                      <AvatarFallback>
                        {teacher.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold leading-none">{teacher.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {teacher.totalClasses} classes, {teacher.totalStudents} students
                          </p>
                        </div>
                        <Badge variant={teacher.averageScore >= 85 ? "default" : "secondary"}>
                          {teacher.averageScore}% avg
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {teacher.activeAssignments} active assignments
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Classes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Department Classes</CardTitle>
                <CardDescription>Overview of all active classes</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/department/classes")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <EmptyState
                title="No classes found"
                description="Classes will appear here once they are created"
              />
            ) : (
              <div className="space-y-3">
                {classes.slice(0, 5).map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/department/classes/${cls.id}`)}
                  >
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold leading-none">{cls.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Teacher: {cls.teacher}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold">{cls.studentCount}</p>
                        <p className="text-xs text-muted-foreground">students</p>
                      </div>
                      <Badge variant={cls.averageScore >= 85 ? "default" : "secondary"}>
                        {cls.averageScore}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common department management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={() => router.push("/department/reports")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">View Reports</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Access detailed analytics
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/department/teachers")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Manage Teachers</div>
                <div className="text-sm text-muted-foreground mt-1">
                  View and manage teaching staff
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/department/performance")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Performance Metrics</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Track department outcomes
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
