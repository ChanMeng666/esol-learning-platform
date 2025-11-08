"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "@/components/shared/loading-state";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Clock,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export default function ParentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChildren: 0,
    activeAssignments: 0,
    completedTasks: 0,
    averageProgress: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // TODO: Implement API calls to fetch real data
      // const data = await getParentDashboardStats();
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
    return <LoadingState message="Loading your dashboard..." fullScreen />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your children's learning progress
        </p>
      </div>

      {/* Development Notice */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          Parent dashboard is currently in development. Full features including children management,
          assignment tracking, and teacher communication will be available soon.
        </AlertDescription>
      </Alert>

      {/* Simplified Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Children"
          value={stats.totalChildren}
          description="Currently enrolled"
          icon={Users}
          variant="info"
        />
        <StatCard
          title="Active Assignments"
          value={stats.activeAssignments}
          description="Assigned to children"
          icon={BookOpen}
          variant="warning"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          description="This month"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Average Progress"
          value={`${stats.averageProgress}%`}
          description="Across all children"
          icon={TrendingUp}
          variant="primary"
        />
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Features</CardTitle>
          <CardDescription>
            We're working on bringing you comprehensive parent dashboard features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Children Management</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  View and manage all your children's profiles and progress
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Assignment Tracking</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitor assignments, deadlines, and completion status
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Progress Reports</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Detailed reports on learning progress and achievements
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Teacher Communication</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Direct messaging and updates from teachers
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
