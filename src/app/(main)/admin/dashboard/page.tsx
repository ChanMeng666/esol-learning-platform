"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartRevenue } from "@/components/charts/chart-revenue";
import { ChartVisitors } from "@/components/charts/chart-visitors";
import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive";
import {
  Users,
  GraduationCap,
  Building2,
  ArrowRight,
  UserCheck,
  Award,
  AlertCircle,
  CheckCircle2,
  Settings,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

// Mock data - replace with actual API calls
interface Department {
  id: string;
  name: string;
  headName: string;
  teacherCount: number;
  studentCount: number;
  classCount: number;
  averageScore: number;
  status: "excellent" | "good" | "needs_attention";
}

interface SystemAlert {
  id: string;
  type: "info" | "warning" | "success";
  title: string;
  description: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
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
      const mockDepartments: Department[] = [
        {
          id: "1",
          name: "English Language Department",
          headName: "Dr. Michael Anderson",
          teacherCount: 12,
          studentCount: 285,
          classCount: 18,
          averageScore: 86,
          status: "excellent",
        },
        {
          id: "2",
          name: "ESOL Foundation",
          headName: "Ms. Jennifer Lee",
          teacherCount: 8,
          studentCount: 156,
          classCount: 12,
          averageScore: 79,
          status: "good",
        },
        {
          id: "3",
          name: "Advanced Studies",
          headName: "Prof. Robert Taylor",
          teacherCount: 6,
          studentCount: 98,
          classCount: 8,
          averageScore: 91,
          status: "excellent",
        },
      ];

      const mockAlerts: SystemAlert[] = [
        {
          id: "1",
          type: "success",
          title: "System Backup Completed",
          description: "Weekly automated backup completed successfully",
          timestamp: "2 hours ago",
        },
        {
          id: "2",
          type: "warning",
          title: "Teacher Absence Notification",
          description: "3 teachers have reported absence for tomorrow",
          timestamp: "5 hours ago",
        },
        {
          id: "3",
          type: "info",
          title: "New Enrollment Period Starting",
          description: "Spring semester enrollment opens in 5 days",
          timestamp: "Yesterday",
        },
      ];

      setDepartments(mockDepartments);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading school dashboard..." fullScreen />;
  }

  // Calculate statistics
  const totalDepartments = departments.length;
  const totalTeachers = departments.reduce((sum, dept) => sum + dept.teacherCount, 0);
  const totalStudents = departments.reduce((sum, dept) => sum + dept.studentCount, 0);
  const overallScore = departments.length > 0
    ? Math.round(departments.reduce((sum, dept) => sum + dept.averageScore, 0) / departments.length)
    : 0;

  // Mock trends (replace with real data from API)
  const mockTrends = {
    departments: { value: 0, label: "no change" },
    teachers: { value: 6.2, label: "vs last year" },
    students: { value: 12.5, label: "vs last semester" },
    score: { value: 3.8, label: "vs last month" },
  };

  // Generate department performance data for bar chart
  const departmentPerformanceData = departments.map((dept) => ({
    label: dept.name.split(" ")[0], // First word of department name
    students: dept.studentCount,
    avgScore: dept.averageScore,
  }));

  const departmentPerformanceConfig = {
    students: {
      label: "Total Students",
      color: "hsl(var(--chart-1))",
    },
    avgScore: {
      label: "Avg Score",
      color: "hsl(var(--chart-2))",
    },
  };

  // Generate department status distribution for pie chart
  const statusDistribution = departments.reduce((acc, dept) => {
    const statusLabels = {
      excellent: "Excellent",
      good: "Good",
      needs_attention: "Needs Attention",
    };
    const existing = acc.find((item) => item.category === statusLabels[dept.status]);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        category: statusLabels[dept.status],
        value: 1,
        fill: `hsl(var(--chart-${acc.length + 1}))`,
      });
    }
    return acc;
  }, [] as Array<{ category: string; value: number; fill: string }>);

  const statusDistributionConfig = {
    Excellent: {
      label: "Excellent",
      color: "hsl(var(--chart-1))",
    },
    Good: {
      label: "Good",
      color: "hsl(var(--chart-2))",
    },
    "Needs Attention": {
      label: "Needs Attention",
      color: "hsl(var(--chart-3))",
    },
  };

  // Generate school-wide enrollment trend data for area chart
  const enrollmentData = [
    { date: "2023-09-01", students: 480, teachers: 22 },
    { date: "2023-10-01", students: 492, teachers: 23 },
    { date: "2023-11-01", students: 505, teachers: 24 },
    { date: "2023-12-01", students: 515, teachers: 25 },
    { date: "2024-01-01", students: 539, teachers: 26 },
  ];

  const enrollmentConfig = {
    students: {
      label: "Total Students",
      color: "hsl(var(--chart-1))",
    },
    teachers: {
      label: "Total Teachers",
      color: "hsl(var(--chart-2))",
    },
  };

  const getStatusBadgeVariant = (status: Department["status"]) => {
    switch (status) {
      case "excellent":
        return "default";
      case "good":
        return "secondary";
      case "needs_attention":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getAlertIcon = (type: SystemAlert["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "info":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAlertBgColor = (type: SystemAlert["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500/10";
      case "warning":
        return "bg-orange-500/10";
      case "info":
        return "bg-blue-500/10";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">School Dashboard</h1>
        <p className="text-muted-foreground">
          Oversee school-wide operations, manage departments, and monitor overall performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Departments"
          value={totalDepartments}
          description="Active departments"
          icon={Building2}
          trend={mockTrends.departments}
          variant="primary"
        />
        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          description="Across all departments"
          icon={UserCheck}
          trend={mockTrends.teachers}
          variant="success"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          description="Currently enrolled"
          icon={Users}
          trend={mockTrends.students}
          variant="warning"
        />
        <StatCard
          title="Overall Score"
          value={`${overallScore}%`}
          description="School-wide average"
          icon={Award}
          trend={mockTrends.score}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartAreaInteractive
          title="School Growth Trend"
          description="Track students and teachers over time"
          data={enrollmentData}
          config={enrollmentConfig}
          defaultTimeRange="90d"
          timeRanges={[
            { value: "30d", label: "Last 30 days", days: 30 },
            { value: "90d", label: "Last 90 days", days: 90 },
          ]}
        />
        <ChartVisitors
          title="Department Performance"
          description="Status distribution"
          data={statusDistribution}
          config={statusDistributionConfig}
          showSelector={false}
          centerLabel="Departments"
        />
      </div>

      {/* Department Performance Chart */}
      {departments.length > 0 && (
        <ChartRevenue
          title="Department Comparison"
          description="Compare department sizes and performance"
          data={departmentPerformanceData}
          config={departmentPerformanceConfig}
          stacked={false}
          footerDescription="Current academic year statistics"
        />
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Departments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Departments</CardTitle>
                <CardDescription>Overview of all departments</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/departments")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {departments.length === 0 ? (
              <EmptyState
                title="No departments found"
                description="Create your first department to get started"
                action={{
                  label: "Create Department",
                  onClick: () => router.push("/admin/departments/new"),
                }}
              />
            ) : (
              <div className="space-y-3">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/admin/departments/${dept.id}`)}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold leading-none">{dept.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Head: {dept.headName}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(dept.status)}>
                          {dept.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <UserCheck className="w-3 h-3 inline mr-1" />
                          {dept.teacherCount} teachers
                        </div>
                        <div>
                          <Users className="w-3 h-3 inline mr-1" />
                          {dept.studentCount} students
                        </div>
                        <div>
                          <GraduationCap className="w-3 h-3 inline mr-1" />
                          {dept.classCount} classes
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${dept.averageScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{dept.averageScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent notifications and updates</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/notifications")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <EmptyState
                  title="No alerts"
                  description="System alerts will appear here"
                />
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 border border-border rounded-lg"
                  >
                    <div className={`p-2 rounded-lg ${getAlertBgColor(alert.type)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.description}
                      </p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={() => router.push("/admin/reports")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Generate Reports</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Access comprehensive analytics
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/admin/departments")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Manage Departments</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Oversee all departments
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/admin/settings")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">School Settings</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Configure school parameters
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
