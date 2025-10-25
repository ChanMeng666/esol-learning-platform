"use client";

import { useEffect, useState } from "react";
import { Trophy, Clock, BookOpen, TrendingUp, Mic, GraduationCap, Globe, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive";
import { ChartVisitors } from "@/components/charts/chart-visitors";
import { getAggregatedStats } from "@/actions/module-stats";

interface ModuleProgressData {
  moduleType: string;
  totalTime: number;
  questionsCompleted: number;
  pointsEarned: number;
  lastAccessed: Date | null;
}

interface ProgressData {
  currentLevel: string;
  targetLevel: string | null;
  totalPoints: number;
  questionsCompleted?: number;
}

interface AggregatedStats {
  totalPoints: number;
  totalTime: number;
  totalQuestions: number;
  modules: ModuleProgressData[];
  nzcel: ProgressData | null;
  cefr: ProgressData | null;
  speaking: {
    totalSessions: number;
    completedSessions: number;
    totalTurns: number;
    averageDuration: number;
  };
  mostActiveModule: ModuleProgressData | null;
}

export function OverviewTabNew() {
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAggregatedStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load aggregated stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Format time in hours and minutes
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Calculate trend (mock data for now - you can replace with real historical data)
  const mockTrend = {
    points: { value: 12.5, label: "vs last week" },
    time: { value: 8.3, label: "vs last week" },
    questions: { value: 15.7, label: "vs last week" },
  };

  // Generate mock activity data for the area chart (last 30 days)
  const generateActivityData = () => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split("T")[0],
        questions: Math.floor(Math.random() * 20) + 5,
        time: Math.floor(Math.random() * 60) + 10,
      });
    }
    return data;
  };

  const activityChartConfig = {
    questions: {
      label: "Questions",
      color: "hsl(var(--chart-1))",
    },
    time: {
      label: "Minutes",
      color: "hsl(var(--chart-2))",
    },
  };

  // Skills distribution data for pie chart
  const skillsData = [
    {
      category: "listening",
      value: stats.nzcel?.questionsCompleted ? Math.floor(stats.nzcel.questionsCompleted * 0.25) : 10,
      fill: "hsl(var(--chart-1))",
    },
    {
      category: "speaking",
      value: stats.nzcel?.questionsCompleted ? Math.floor(stats.nzcel.questionsCompleted * 0.30) : 15,
      fill: "hsl(var(--chart-2))",
    },
    {
      category: "reading",
      value: stats.nzcel?.questionsCompleted ? Math.floor(stats.nzcel.questionsCompleted * 0.25) : 12,
      fill: "hsl(var(--chart-3))",
    },
    {
      category: "writing",
      value: stats.nzcel?.questionsCompleted ? Math.floor(stats.nzcel.questionsCompleted * 0.20) : 8,
      fill: "hsl(var(--chart-4))",
    },
  ];

  const skillsChartConfig = {
    listening: {
      label: "Listening",
      color: "hsl(var(--chart-1))",
    },
    speaking: {
      label: "Speaking",
      color: "hsl(var(--chart-2))",
    },
    reading: {
      label: "Reading",
      color: "hsl(var(--chart-3))",
    },
    writing: {
      label: "Writing",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Points"
          value={stats.totalPoints.toLocaleString()}
          description="Across all modules"
          icon={Trophy}
          trend={mockTrend.points}
          variant="primary"
        />
        <StatCard
          title="Study Time"
          value={formatTime(stats.totalTime)}
          description="Total learning hours"
          icon={Clock}
          trend={mockTrend.time}
          variant="success"
        />
        <StatCard
          title="Questions Completed"
          value={stats.totalQuestions.toLocaleString()}
          description="Practice exercises done"
          icon={BookOpen}
          trend={mockTrend.questions}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartAreaInteractive
          title="Learning Activity"
          description="Your daily study pattern over the last 30 days"
          data={generateActivityData()}
          config={activityChartConfig}
          defaultTimeRange="30d"
        />
        <ChartVisitors
          title="Skills Distribution"
          description="Questions completed by skill type"
          data={skillsData}
          config={skillsChartConfig}
          centerLabel="Questions"
        />
      </div>

      {/* Learning Modules Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Learning Modules
          </CardTitle>
          <CardDescription>Your activity across different learning paths</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* General Practice Module */}
            <Card className="border-2 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <Globe className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">General Practice</h4>
                    <p className="text-xs text-muted-foreground">CEFR A1-C2</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-semibold">
                      {stats.modules.find((m) => m.moduleType === "general")?.pointsEarned || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-semibold">
                      {stats.modules.find((m) => m.moduleType === "general")?.questionsCompleted || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-semibold">
                      {formatTime(stats.modules.find((m) => m.moduleType === "general")?.totalTime || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NZCEL Module */}
            <Card className="border-2 hover:border-green-500/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <GraduationCap className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">NZCEL Prep</h4>
                    <p className="text-xs text-muted-foreground">13 Levels</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-semibold">
                      {stats.modules.find((m) => m.moduleType === "nzcel")?.pointsEarned || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-semibold">
                      {stats.modules.find((m) => m.moduleType === "nzcel")?.questionsCompleted || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-semibold">
                      {formatTime(stats.modules.find((m) => m.moduleType === "nzcel")?.totalTime || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Speaking Module */}
            <Card className="border-2 hover:border-blue-500/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Mic className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Speaking Coach</h4>
                    <p className="text-xs text-muted-foreground">AI-Powered</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="font-semibold">{stats.speaking.totalSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-semibold">{stats.speaking.completedSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Turns</span>
                    <span className="font-semibold">{stats.speaking.totalTurns}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Most Active Module */}
      {stats.mostActiveModule && (
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Most Active Module
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  {stats.mostActiveModule.moduleType === "general"
                    ? "General Practice"
                    : stats.mostActiveModule.moduleType === "nzcel"
                    ? "NZCEL Exam Prep"
                    : "AI Speaking Coach"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Last accessed:{" "}
                  {stats.mostActiveModule.lastAccessed
                    ? new Date(stats.mostActiveModule.lastAccessed).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {stats.mostActiveModule.pointsEarned} points
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
