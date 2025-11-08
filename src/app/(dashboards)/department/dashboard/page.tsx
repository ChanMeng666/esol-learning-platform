"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  Users,
  GraduationCap,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  FileText,
  BarChart3,
  Target,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function DepartmentDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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
        <h1 className="text-3xl font-bold tracking-tight">Department Dashboard</h1>
        <p className="text-muted-foreground">
          Oversee your department's performance and manage resources
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-green-500 mt-1">+2 from last month</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">285</p>
                <p className="text-xs text-green-500 mt-1">+18 this semester</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                <p className="text-2xl font-bold">28</p>
                <p className="text-xs text-muted-foreground mt-1">Across all levels</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold">86%</p>
                <p className="text-xs text-green-500 mt-1">+3% improvement</p>
              </div>
              <Target className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your department</CardDescription>
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
                <span className="text-sm">Curriculum update: Level 3 materials revised</span>
                <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Completed</Badge>
                <span className="text-sm">Performance review: Q2 assessments finalized</span>
                <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="default">Achievement</Badge>
                <span className="text-sm">Department achieved 86% average performance</span>
                <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Important deadlines and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">Department Meeting</p>
                  <p className="text-xs text-muted-foreground">Tomorrow at 2:00 PM</p>
                </div>
                <Badge variant="destructive">Tomorrow</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">Budget Review</p>
                  <p className="text-xs text-muted-foreground">Friday, Dec 15</p>
                </div>
                <Badge variant="secondary">This Week</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">Teacher Evaluations Due</p>
                  <p className="text-xs text-muted-foreground">Dec 20</p>
                </div>
                <Badge variant="outline">Next Week</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Highlights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/10">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">ENG-401</p>
                <p className="text-sm text-muted-foreground">87% average score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Best Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-500/10">
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">READ-201</p>
                <p className="text-sm text-muted-foreground">97% attendance rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Active Teacher</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-purple-500/10">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Dr. Anderson</p>
                <p className="text-sm text-muted-foreground">4.8 satisfaction rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
