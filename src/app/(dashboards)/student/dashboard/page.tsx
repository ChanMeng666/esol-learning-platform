"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { OverviewTabNew as OverviewTab } from "@/components/dashboard/overview-tab-new";
import { useContainerQuery } from "@/hooks/use-container-query";
import { useUserProgress } from "@/lib/store/user-progress";
import { useCEFRProgress } from "@/lib/store/cefr-progress";
import {
  Trophy,
  Clock,
  BookOpen,
  Award,
  Zap,
  Target,
  Mic2,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Calendar
} from "lucide-react";

// Import Server Actions
import { getUserProgress } from "@/actions/user-progress";
import { getCEFRProgress } from "@/actions/cefr-progress";
import { getAggregatedStats } from "@/actions/module-stats";
import { type ColumnDef } from "@tanstack/react-table";

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}

function DashboardPageContent() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isLgUp, isMdUp } = useContainerQuery<HTMLDivElement>();
  const userProgress = useUserProgress();
  const cefrProgress = useCEFRProgress();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load all dashboard data in parallel
        const [nzcelProgress, cefrProgressData, aggregatedStats] = await Promise.all([
          getUserProgress(),
          getCEFRProgress(),
          getAggregatedStats()
        ]);

        setData({
          nzcelProgress,
          cefrProgress: cefrProgressData,
          aggregatedStats
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);


  // Format time helper
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Count completed achievements
  const completedAchievements = userProgress.achievements.filter(a => a.progress >= a.target).length;
  const totalAchievements = userProgress.achievements.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const aggregatedStats = data?.aggregatedStats || {};
  const nzcelProgress = data?.nzcelProgress || {};
  const cefrProgressData = data?.cefrProgress || {};

  return (
    <div ref={ref} className="flex flex-col gap-6 container-responsive">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress across all learning modules
        </p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className={`grid gap-4 ${isLgUp ? "grid-cols-4" : isMdUp ? "grid-cols-2" : "grid-cols-1"}`}>
        <StatCard
          title="Total Points"
          value={aggregatedStats?.totalPoints?.toLocaleString() || userProgress.totalPoints.toLocaleString()}
          description="Lifetime achievement"
          icon={Trophy}
          trend={{
            value: 12,
            label: "+12% this week"
          }}
          variant="warning"
          footer={{
            label: "75% to next milestone"
          }}
        />

        <StatCard
          title="Study Streak"
          value={`${userProgress.streak || 0} days`}
          description="Keep it going!"
          icon={Zap}
          trend={{
            value: userProgress.streak > 0 ? 100 : -100,
            label: userProgress.streak > 0 ? "🔥 On fire!" : "Start today!"
          }}
          variant="success"
          footer={{
            label: "🔥".repeat(Math.min(userProgress.streak || 0, 5)) || "Start your streak!"
          }}
        />

        <StatCard
          title="Questions"
          value={userProgress.completedQuestions.length.toLocaleString()}
          description="Total completed"
          icon={BookOpen}
          trend={{
            value: 8,
            label: "+8% this week"
          }}
          variant="info"
        />

        <StatCard
          title="Study Time"
          value={formatTime(aggregatedStats?.totalTime || 0)}
          description="Total learning time"
          icon={Clock}
          trend={{
            value: 5,
            label: "+5% this week"
          }}
          variant="primary"
        />
      </div>

      {/* Main Overview Content */}
      <div className="space-y-6">
        <OverviewTab />

        {/* Progress Navigation Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left hover:bg-accent transition-colors"
                onClick={() => window.location.href = "/student/progress/nzcel"}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-medium">NZCEL Progress</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Track your NZCEL exam preparation progress
                </p>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left hover:bg-accent transition-colors"
                onClick={() => window.location.href = "/student/progress/general"}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-medium">General English</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Monitor your CEFR level advancement
                </p>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left hover:bg-accent transition-colors"
                onClick={() => window.location.href = "/student/progress/speaking"}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-medium">Speaking Stats</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Review your speaking practice sessions
                </p>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = "/practice"}
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Practice</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = "/speaking"}
            >
              <Mic2 className="h-5 w-5" />
              <span className="text-xs">Speaking</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = "/student/analytics"}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = "/student/achievements"}
            >
              <Award className="h-5 w-5" />
              <span className="text-xs">Awards</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = "/student/schedule"}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Schedule</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = "/diagnostic"}
            >
              <Target className="h-5 w-5" />
              <span className="text-xs">Test</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}