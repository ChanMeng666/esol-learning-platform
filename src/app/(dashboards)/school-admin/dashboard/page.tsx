"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  Users,
  GraduationCap,
  Building2,
  ArrowRight,
  BookOpen,
  UserCog,
  School,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { getSchoolAdminStats } from "@/actions/school-admin-stats";

export default function SchoolAdminDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
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

      const data = await getSchoolAdminStats();
      setStats(data);

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
      <h1 className="text-3xl font-bold tracking-tight">School Administration</h1>

      {/* Stats Grid */}
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

      {/* Quick Access Management */}
      <Card>
        <CardHeader>
          <CardTitle>Management Functions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/school-admin/users">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-center justify-between hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <UserCog className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">User Management</h4>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/school-admin/departments">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-center justify-between hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Department Management</h4>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/school-admin/classes">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-center justify-between hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <School className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Class Management</h4>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/school-admin/settings">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-center justify-between hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">School Settings</h4>
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
