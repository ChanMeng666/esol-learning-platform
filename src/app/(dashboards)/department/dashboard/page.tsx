"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "@/components/shared/loading-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  Users,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Target,
  Info,
  UserCheck,
  School,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function DepartmentDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalClasses: 0,
    averagePerformance: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // TODO: Implement API calls to fetch real data
      // const data = await getDepartmentStats();
      // setStats(data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading dashboard..." fullScreen />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Department Dashboard</h1>
        <p className="text-muted-foreground">
          Oversee your department's performance and manage resources
        </p>
      </div>

      {/* Development Notice */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          Department dashboard is currently displaying basic statistics.
          Full analytics and reporting features are in development.
        </AlertDescription>
      </Alert>

      {/* Simplified Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          description="In your department"
          icon={GraduationCap}
          variant="info"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          description="Currently enrolled"
          icon={Users}
          variant="success"
        />
        <StatCard
          title="Active Classes"
          value={stats.totalClasses}
          description="Across all levels"
          icon={BookOpen}
          variant="warning"
        />
        <StatCard
          title="Avg Performance"
          value={`${stats.averagePerformance}%`}
          description="Department average"
          icon={Target}
          variant="primary"
        />
      </div>

      {/* Quick Access Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
          <CardDescription>
            Quick access to department features and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/department/teachers">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Teacher Management</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      View and manage department teachers
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/department/classes">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <School className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Class Overview</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monitor department classes and schedules
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/department/students">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Student Overview</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Track student enrollment and progress
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/department/reports">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <BarChart3 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Performance Reports</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      View analytics and performance metrics
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
