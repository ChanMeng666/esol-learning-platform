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
import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive";
import {
  Users,
  Clock,
  BookOpen,
  ArrowRight,
  Mail,
  Calendar,
  Award,
  Target,
} from "lucide-react";
import { toast } from "sonner";

// Mock data - replace with actual API calls
interface Child {
  id: string;
  name: string;
  avatar?: string;
  class: string;
  currentLevel: string;
  overallScore: number;
  studyTime: number; // in hours
  activeAssignments: number;
  recentActivity: string;
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
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
      const mockChildren: Child[] = [
        {
          id: "1",
          name: "Emma Chen",
          class: "Level 3 - General",
          currentLevel: "B1",
          overallScore: 85,
          studyTime: 12.5,
          activeAssignments: 3,
          recentActivity: "Completed speaking exercise 2 hours ago",
        },
        {
          id: "2",
          name: "James Chen",
          class: "Level 2",
          currentLevel: "A2",
          overallScore: 78,
          studyTime: 8.3,
          activeAssignments: 2,
          recentActivity: "Submitted reading assignment yesterday",
        },
      ];

      setChildren(mockChildren);
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

  // Calculate statistics
  const totalChildren = children.length;
  const averageScore = totalChildren > 0
    ? Math.round(children.reduce((sum, child) => sum + child.overallScore, 0) / totalChildren)
    : 0;
  const totalStudyTime = children.reduce((sum, child) => sum + child.studyTime, 0);
  const totalActiveAssignments = children.reduce((sum, child) => sum + child.activeAssignments, 0);

  // Mock trends (replace with real data from API)
  const mockTrends = {
    children: { value: 0, label: "no change" },
    score: { value: 8.3, label: "vs last month" },
    studyTime: { value: 12.5, label: "vs last week" },
    assignments: { value: -15.2, label: "vs last week" },
  };

  // Generate performance comparison data for bar chart
  const performanceData = children.map((child) => ({
    label: child.name,
    score: child.overallScore,
    studyHours: child.studyTime,
  }));

  const performanceConfig = {
    score: {
      label: "Overall Score",
      color: "hsl(var(--chart-1))",
    },
    studyHours: {
      label: "Study Hours",
      color: "hsl(var(--chart-2))",
    },
  };

  // Generate activity timeline data for area chart
  const activityData = [
    { date: "2024-01-20", Emma: 45, James: 32 },
    { date: "2024-01-21", Emma: 52, James: 28 },
    { date: "2024-01-22", Emma: 48, James: 35 },
    { date: "2024-01-23", Emma: 61, James: 42 },
    { date: "2024-01-24", Emma: 55, James: 38 },
    { date: "2024-01-25", Emma: 67, James: 45 },
    { date: "2024-01-26", Emma: 58, James: 40 },
  ];

  const activityConfig = {
    Emma: {
      label: "Emma Chen",
      color: "hsl(var(--chart-1))",
    },
    James: {
      label: "James Chen",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-muted-foreground">
          Track your children's learning progress and stay connected with their education
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Children"
          value={totalChildren}
          description="Total children enrolled"
          icon={Users}
          trend={mockTrends.children}
          variant="primary"
        />
        <StatCard
          title="Average Score"
          value={`${averageScore}%`}
          description="Across all children"
          icon={Award}
          trend={mockTrends.score}
          variant="success"
        />
        <StatCard
          title="Total Study Time"
          value={`${totalStudyTime.toFixed(1)}h`}
          description="This week"
          icon={Clock}
          trend={mockTrends.studyTime}
          variant="warning"
        />
        <StatCard
          title="Active Assignments"
          value={totalActiveAssignments}
          description="Pending submissions"
          icon={BookOpen}
          trend={mockTrends.assignments}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      {children.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <ChartAreaInteractive
            title="Learning Activity"
            description="Daily activity points across all children"
            data={activityData}
            config={activityConfig}
            defaultTimeRange="7d"
            timeRanges={[
              { value: "7d", label: "Last 7 days", days: 7 },
              { value: "30d", label: "Last 30 days", days: 30 },
            ]}
          />
          <ChartRevenue
            title="Performance Overview"
            description="Compare children's scores and study hours"
            data={performanceData}
            config={performanceConfig}
            stacked={false}
            footerDescription="Current week statistics"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Children Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Children Progress</CardTitle>
                <CardDescription>Individual performance overview</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/parent/children")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <EmptyState
                title="No children enrolled"
                description="Contact your school administrator to enroll your children"
              />
            ) : (
              <div className="space-y-4">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/parent/children/${child.id}`)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={child.avatar} alt={child.name} />
                      <AvatarFallback>
                        {child.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold leading-none">{child.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {child.class}
                          </p>
                        </div>
                        <Badge variant={child.overallScore >= 80 ? "default" : "secondary"}>
                          {child.overallScore}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Level: {child.currentLevel}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {child.studyTime}h this week
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {child.recentActivity}
                      </div>
                      {child.activeAssignments > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {child.activeAssignments} active assignment{child.activeAssignments > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Updates</CardTitle>
                <CardDescription>Latest notifications and messages</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/parent/notifications")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Mock notifications - replace with actual data */}
              <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Parent-Teacher Meeting Scheduled</p>
                  <p className="text-xs text-muted-foreground">
                    Meeting with Ms. Johnson scheduled for Jan 30, 2024 at 3:00 PM
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Award className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Achievement Unlocked</p>
                  <p className="text-xs text-muted-foreground">
                    Emma earned "Speaking Master" badge for completing 50 speaking exercises
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New Assignment Posted</p>
                  <p className="text-xs text-muted-foreground">
                    Reading comprehension assignment due on Feb 5, 2024
                  </p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Mail className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Teacher Feedback Received</p>
                  <p className="text-xs text-muted-foreground">
                    Ms. Johnson provided feedback on James's writing assignment
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={() => router.push("/parent/children")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">View All Children</div>
                <div className="text-sm text-muted-foreground mt-1">
                  See detailed progress reports
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/parent/messages")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Message Teachers</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Contact your children's teachers
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/parent/schedule")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">View Schedule</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Check class schedules and events
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
