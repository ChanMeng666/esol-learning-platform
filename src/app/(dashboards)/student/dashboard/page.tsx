"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { LearningTimeChart } from "@/components/charts/learning-time-chart";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { OverviewTabNew as OverviewTab } from "@/components/dashboard/overview-tab-new";
import { NZCELTab } from "@/components/dashboard/nzcel-tab";
import { GeneralPracticeTab } from "@/components/dashboard/general-practice-tab";
import { SpeakingTab } from "@/components/dashboard/speaking-tab";
import { ClassScheduleCalendar } from "@/components/calendar/fullcalendar-schedule";
import { useContainerQuery } from "@/hooks/use-container-query";
import { useUserProgress } from "@/lib/store/user-progress";
import { useCEFRProgress } from "@/lib/store/cefr-progress";
import {
  Trophy,
  Clock,
  BookOpen,
  TrendingUp,
  Target,
  Award,
  Zap,
  Brain,
  Headphones,
  MessageSquare,
  PenTool,
  Mic2,
  LayoutDashboard,
  GraduationCap,
  Globe,
  Mic,
  Flame,
  BarChart3,
  Calendar,
  FileSpreadsheet
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

        // Generate weekly progress data
        const weeklyProgress = generateWeeklyProgress();

        // Generate skill balance data
        const skillBalance = generateSkillBalance(nzcelProgress, cefrProgressData);

        // Generate study time data
        const studyTime = generateStudyTime();

        setData({
          nzcelProgress,
          cefrProgress: cefrProgressData,
          aggregatedStats,
          weeklyProgress,
          skillBalance,
          studyTime
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Helper function to generate weekly progress data
  const generateWeeklyProgress = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({
      date: day,
      listening: Math.round(70 + Math.random() * 20),
      speaking: Math.round(65 + Math.random() * 20),
      reading: Math.round(75 + Math.random() * 20),
      writing: Math.round(68 + Math.random() * 20),
      overall: Math.round(70 + Math.random() * 20)
    }));
  };

  // Helper function to generate skill balance data
  const generateSkillBalance = (nzcelProgress: any, cefrProgress: any) => {
    const skills = nzcelProgress?.skillProgress || cefrProgress?.skillProgress || userProgress.skillProgress || {
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0
    };
    return [
      { skill: "Listening", current: skills.listening || 0, target: 85 },
      { skill: "Speaking", current: skills.speaking || 0, target: 85 },
      { skill: "Reading", current: skills.reading || 0, target: 90 },
      { skill: "Writing", current: skills.writing || 0, target: 85 },
      { skill: "Grammar", current: Math.round(((skills.reading || 0) + (skills.writing || 0)) / 2), target: 88 },
      { skill: "Vocabulary", current: Math.round(((skills.reading || 0) + (skills.listening || 0)) / 2), target: 85 }
    ];
  };

  // Helper function to generate study time data
  const generateStudyTime = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => ({
      day,
      time: Math.round(20 + Math.random() * 40),
      sessions: Math.round(1 + Math.random() * 3)
    }));
  };

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

      {/* Main Tabs with Enhanced Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 h-auto">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">All</span>
          </TabsTrigger>
          <TabsTrigger value="nzcel" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>NZCEL</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
            <span className="sm:hidden">CEFR</span>
          </TabsTrigger>
          <TabsTrigger value="speaking" className="gap-2">
            <Mic className="h-4 w-4" />
            <span>Speaking</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Award className="h-4 w-4" />
            <span>Awards</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="nzcel" className="mt-6 space-y-4">
          <NZCELTab />
        </TabsContent>

        <TabsContent value="general" className="mt-6 space-y-4">
          <GeneralPracticeTab />
        </TabsContent>

        <TabsContent value="speaking" className="mt-6 space-y-4">
          <SpeakingTab />
        </TabsContent>

        {/* Analytics Tab with Charts */}
        <TabsContent value="analytics" className="mt-6 space-y-4">
          {data && (
            <>
              <div className={`grid gap-4 ${isLgUp ? "grid-cols-2" : "grid-cols-1"}`}>
                <ProgressLineChart
                  data={data.weeklyProgress}
                  title="Weekly Progress Trend"
                  description="Your skill improvement over the past week"
                  className="chart-container"
                />
                <SkillRadarChart
                  data={data.skillBalance}
                  title="Skill Balance"
                  description="Your current proficiency across all skills"
                  className="chart-container"
                />
              </div>

              <LearningTimeChart
                data={data.studyTime}
                title="Daily Study Time"
                description="Your learning activity this week"
                goalMinutes={30}
                className="chart-container"
              />

              {/* Learning Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Strong improvement in Speaking (+15% this week)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">On track to reach B2 level by March 2025</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">Consider more Writing practice to balance skills</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProgress.achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.progress >= achievement.target ? "border-primary" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Award className={`h-6 w-6 ${achievement.progress >= achievement.target ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {achievement.progress}/{achievement.target}
                    </span>
                    {achievement.progress >= achievement.target && (
                      <Badge variant="default" className="text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle>Earned Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {userProgress.badges.map((badge) => (
                  <div key={badge.id} className="text-center">
                    <div className="text-3xl mb-1">{badge.icon}</div>
                    <p className="text-xs font-medium">{badge.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {badge.rarity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="mt-6">
          <ClassScheduleCalendar
            organizationId={BigInt(1)}
            userId="student-user"
            userRole="student"
            className="w-full"
          />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              onClick={() => window.location.href = "/diagnostic"}
            >
              <Target className="h-5 w-5" />
              <span className="text-xs">Test</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = "/student/dashboard/enhanced-page"}
            >
              <Zap className="h-5 w-5" />
              <span className="text-xs">Enhanced</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}