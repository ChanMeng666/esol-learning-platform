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
  Building2,
  ArrowRight,
  BookOpen,
  Info,
  UserCog,
  School,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SchoolAdminDashboardPage() {
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
    totalStudents: 0,
    totalTeachers: 0,
    totalDepartments: 0,
    totalClasses: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // TODO: Implement API calls to fetch real data
      // const data = await getSchoolAdminStats();
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
        <h1 className="text-3xl font-bold tracking-tight">School Administration</h1>
        <p className="text-muted-foreground">
          Manage your school, users, departments, and classes
        </p>
      </div>

      {/* Development Notice */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          School admin dashboard is currently displaying basic statistics.
          Use the management pages below to access full administrative features.
        </AlertDescription>
      </Alert>

      {/* Simplified Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          description="Enrolled students"
          icon={Users}
          variant="info"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          description="Active teachers"
          icon={GraduationCap}
          variant="success"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          description="Active departments"
          icon={Building2}
          variant="warning"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          description="Active classes"
          icon={BookOpen}
          variant="primary"
        />
      </div>

      {/* Quick Access Management Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Management Functions</CardTitle>
          <CardDescription>
            Quick access to key administrative features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/school-admin/users">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <UserCog className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">User Management</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Manage students, teachers, and staff accounts
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/school-admin/departments">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Department Management</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Organize and manage academic departments
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/school-admin/classes">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <School className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Class Management</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create and manage classes, assign teachers
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/school-admin/settings">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Settings className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">School Settings</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure school-wide settings and preferences
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
