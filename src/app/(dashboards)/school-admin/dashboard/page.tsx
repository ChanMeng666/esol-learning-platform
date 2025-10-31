"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  GraduationCap,
  Building2,
  ArrowRight,
  TrendingUp,
  Award,
  FileText,
  BarChart3,
  BookOpen,
  Target,
  Activity,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SchoolAdminDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for activity chart
  const [activityData] = useState([
    { month: "Jan", students: 420, teachers: 28 },
    { month: "Feb", students: 445, teachers: 30 },
    { month: "Mar", students: 478, teachers: 32 },
    { month: "Apr", students: 502, teachers: 33 },
    { month: "May", students: 539, teachers: 35 },
    { month: "Jun", students: 539, teachers: 35 },
  ]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">School Administration</h1>
        <p className="text-muted-foreground">
          Manage your entire school, departments, and track overall performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">539</p>
                <p className="text-xs text-green-500 mt-1">+28 this month</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold">35</p>
                <p className="text-xs text-green-500 mt-1">+2 this month</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground mt-1">All active</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold">84.3%</p>
                <p className="text-xs text-green-500 mt-1">+2.1% improvement</p>
              </div>
              <Target className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Trend */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Growth</CardTitle>
            <CardDescription>Student and teacher enrollment trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Students"
                />
                <Line
                  type="monotone"
                  dataKey="teachers"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Teachers"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Performance across all departments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">English Language</span>
                <span className="text-muted-foreground">86%</span>
              </div>
              <Progress value={86} />
            </div>
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">ESOL Foundation</span>
                <span className="text-muted-foreground">79%</span>
              </div>
              <Progress value={79} />
            </div>
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">Advanced Studies</span>
                <span className="text-muted-foreground">91%</span>
              </div>
              <Progress value={91} />
            </div>
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">Business English</span>
                <span className="text-muted-foreground">82%</span>
              </div>
              <Progress value={82} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access key management areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push("/school-admin/departments")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Manage Departments
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push("/school-admin/users")}
            >
              <Users className="mr-2 h-4 w-4" />
              User Management
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push("/school-admin/classes")}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Class Management
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push("/school-admin/analytics")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push("/school-admin/reports")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push("/school-admin/dashboard/settings")}
            >
              <Activity className="mr-2 h-4 w-4" />
              School Settings
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="default">New</Badge>
              <span className="text-sm">New teacher onboarded: Sarah Johnson</span>
              <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default">Update</Badge>
              <span className="text-sm">Department meeting scheduled for tomorrow</span>
              <span className="text-xs text-muted-foreground ml-auto">5 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Report</Badge>
              <span className="text-sm">Monthly performance report generated</span>
              <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default">Achievement</Badge>
              <span className="text-sm">Advanced Studies achieved 91% average score</span>
              <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}