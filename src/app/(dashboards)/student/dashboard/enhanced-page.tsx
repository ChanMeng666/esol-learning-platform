"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { LearningTimeChart } from "@/components/charts/learning-time-chart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useContainerQuery } from "@/hooks/use-container-query";
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
  Mic2
} from "lucide-react";

// Import Server Actions
import { getUserProgress } from "@/actions/user-progress";
import { getCEFRProgress } from "@/actions/cefr-progress";
import { getAggregatedStats } from "@/actions/module-stats";

interface DashboardData {
  nzcelProgress: any;
  cefrProgress: any;
  aggregatedStats: any;
  sessionStats: any;
  weeklyProgress: any[];
  skillBalance: any[];
  studyTime: any[];
}

export default function EnhancedStudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isLgUp, isMdUp } = useContainerQuery<HTMLDivElement>();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load all dashboard data in parallel
        const [nzcelProgress, cefrProgress, aggregatedStats, sessionStats] = await Promise.all([
          getUserProgress(),
          getCEFRProgress(),
          getAggregatedStats(),
          getPracticeSessionStats()
        ]);

        // Generate weekly progress data from session stats
        const weeklyProgress = generateWeeklyProgress(sessionStats);

        // Generate skill balance data
        const skillBalance = generateSkillBalance(nzcelProgress, cefrProgress);

        // Generate study time data
        const studyTime = generateStudyTime(sessionStats);

        setData({
          nzcelProgress,
          cefrProgress,
          aggregatedStats,
          sessionStats,
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
  const generateWeeklyProgress = (sessionStats: any) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date().getDay();

    return days.map((day, index) => {
      // Mock calculation based on session data - in production, use real data
      const dayOffset = index - today;
      const baseValue = 70 + Math.random() * 20;

      return {
        date: day,
        listening: Math.round(baseValue + Math.random() * 10),
        speaking: Math.round(baseValue - 5 + Math.random() * 10),
        reading: Math.round(baseValue + 5 + Math.random() * 10),
        writing: Math.round(baseValue - 2 + Math.random() * 10),
        overall: Math.round(baseValue + Math.random() * 10)
      };
    });
  };

  // Helper function to generate skill balance data
  const generateSkillBalance = (nzcelProgress: any, cefrProgress: any) => {
    const skills = nzcelProgress?.skills || cefrProgress?.skills || {};

    return [
      { skill: "Listening", current: skills.listening || 0, target: 85 },
      { skill: "Speaking", current: skills.speaking || 0, target: 85 },
      { skill: "Reading", current: skills.reading || 0, target: 90 },
      { skill: "Writing", current: skills.writing || 0, target: 85 },
      { skill: "Grammar", current: Math.round((skills.reading + skills.writing) / 2) || 0, target: 88 },
      { skill: "Vocabulary", current: Math.round((skills.reading + skills.listening) / 2) || 0, target: 85 }
    ];
  };

  // Helper function to generate study time data
  const generateStudyTime = (sessionStats: any) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Unable to load dashboard data</p>
      </div>
    );
  }

  const { nzcelProgress, cefrProgress, aggregatedStats } = data;

  return (
    <div ref={ref} className="space-y-8 p-8 container-responsive">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Learning Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress and achievements across all learning modules
        </p>
      </div>

      {/* Enhanced Stats Overview */}
      <div className={`grid gap-4 ${isLgUp ? "grid-cols-4" : isMdUp ? "grid-cols-2" : "grid-cols-1"}`}>
        <StatCard
          title="Total Points"
          value={aggregatedStats?.totalPoints?.toLocaleString() || "0"}
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
          value={`${nzcelProgress?.streak || 0} days`}
          description="Keep it going!"
          icon={Zap}
          trend={{
            value: nzcelProgress?.streak > 0 ? 100 : -100,
            label: nzcelProgress?.streak > 0 ? "🔥 On fire!" : "Start today!"
          }}
          variant="success"
          footer={{
            label: "🔥".repeat(Math.min(nzcelProgress?.streak || 0, 5)) || "Start your streak!"
          }}
        />

        <StatCard
          title="Questions"
          value={(nzcelProgress?.questionsCompleted || 0).toLocaleString()}
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <div className={`grid gap-4 ${isLgUp ? "grid-cols-2" : "grid-cols-1"}`}>
            {/* NZCEL Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>NZCEL Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="text-2xl font-bold">{nzcelProgress?.currentLevel || "Foundation"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Target Level</p>
                    <p className="text-2xl font-bold">{nzcelProgress?.targetLevel || "Level 3"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(nzcelProgress?.skills || {}).map(([skill, value]) => (
                    <div key={skill}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{skill}</span>
                        <span>{value as number}%</span>
                      </div>
                      <Progress value={value as number} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CEFR Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>CEFR Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="text-2xl font-bold">{cefrProgress?.currentLevel || "A1"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Target Level</p>
                    <p className="text-2xl font-bold">{cefrProgress?.targetLevel || "B2"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(cefrProgress?.skills || {}).map(([skill, value]) => (
                    <div key={skill}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{skill}</span>
                        <span>{value as number}%</span>
                      </div>
                      <Progress value={value as number} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Progress Chart */}
          <ProgressLineChart
            data={data.weeklyProgress}
            title="Weekly Progress Trend"
            description="Your skill improvement over the past week"
            className="chart-container"
          />
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <div className={`grid gap-4 ${isLgUp ? "grid-cols-2" : "grid-cols-1"}`}>
            <SkillRadarChart
              data={data.skillBalance}
              title="Skill Balance"
              description="Your current proficiency across all skills"
              className="chart-container"
            />

            <Card>
              <CardHeader>
                <CardTitle>Skill Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.skillBalance.map((skill: any) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {skill.skill === "Listening" && <Headphones className="h-4 w-4 text-orange-500" />}
                        {skill.skill === "Speaking" && <Mic2 className="h-4 w-4 text-green-500" />}
                        {skill.skill === "Reading" && <BookOpen className="h-4 w-4 text-blue-500" />}
                        {skill.skill === "Writing" && <PenTool className="h-4 w-4 text-purple-500" />}
                        {skill.skill === "Grammar" && <Brain className="h-4 w-4 text-pink-500" />}
                        {skill.skill === "Vocabulary" && <MessageSquare className="h-4 w-4 text-indigo-500" />}
                        <span className="font-medium">{skill.skill}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{skill.current}%</span>
                        <span className="text-xs text-muted-foreground">/ {skill.target}%</span>
                      </div>
                    </div>
                    <Progress
                      value={(skill.current / skill.target) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Study Time Chart */}
          <LearningTimeChart
            data={data.studyTime}
            title="Daily Study Time"
            description="Your learning activity this week"
            goalMinutes={30}
            className="chart-container"
          />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nzcelProgress?.achievements?.map((achievement: any) => (
              <Card key={achievement.id} className={achievement.completed ? "border-primary" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Award className={`h-6 w-6 ${achievement.completed ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  <Progress value={achievement.progress} className="h-2" />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {achievement.progress}%
                    </span>
                    {achievement.completed && (
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
                {nzcelProgress?.badges?.map((badge: any) => (
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((nzcelProgress?.correctAnswers || 0) / Math.max(nzcelProgress?.questionsCompleted || 1, 1) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {nzcelProgress?.correctAnswers || 0} correct answers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Best Skill</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.entries(nzcelProgress?.skills || {})
                    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || "Reading"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your strongest area
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  75%
                </div>
                <Progress value={75} className="h-1.5 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  15 of 20 sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  #42
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Top 15% of learners
                </p>
              </CardContent>
            </Card>
          </div>

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
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get practice session stats
async function getPracticeSessionStats() {
  // This would be a real server action in production
  return {
    totalSessions: 45,
    completedSessions: 38,
    averageScore: 82,
    totalTime: 3600 * 12 // 12 hours
  };
}