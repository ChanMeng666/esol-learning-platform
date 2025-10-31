"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useUserProgress } from "@/lib/store/user-progress";
import { useCEFRProgress } from "@/lib/store/cefr-progress";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import {
  Trophy,
  TrendingUp,
  Target,
  BookOpen,
  Headphones,
  MessageSquare,
  PenTool,
  Mic2,
  GraduationCap,
  Globe,
  ArrowRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  Activity
} from "lucide-react";

// Import Server Actions
import { getUserProgress } from "@/actions/user-progress";
import { getCEFRProgress } from "@/actions/cefr-progress";
import { getModuleProgress } from "@/actions/module-stats";

// Import data
import { NZCEL_LEVELS } from "@/data/nzcel-levels";
import { CEFR_LEVELS } from "@/data/cefr-levels";

interface ModuleProgress {
  id: string;
  name: string;
  icon: React.ElementType;
  currentLevel: string;
  targetLevel: string;
  overallProgress: number;
  skills: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
  questionsCompleted: number;
  timeSpent: number;
  lastActivity: Date;
}

export default function StudentProgressPage() {
  return (
    <ProtectedRoute>
      <ProgressPageContent />
    </ProtectedRoute>
  );
}

function ProgressPageContent() {
  const [modules, setModules] = useState<ModuleProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userProgress = useUserProgress();
  const cefrProgress = useCEFRProgress();

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        // Load all progress data
        const [nzcelData, cefrData, nzcelStats, generalStats] = await Promise.all([
          getUserProgress(),
          getCEFRProgress(),
          getModuleProgress("nzcel"),
          getModuleProgress("general")
        ]);

        // Create module progress objects
        const modulesData: ModuleProgress[] = [
          {
            id: "nzcel",
            name: "NZCEL Exam Prep",
            icon: GraduationCap,
            currentLevel: nzcelData?.currentLevel || userProgress.currentLevel,
            targetLevel: nzcelData?.targetLevel || userProgress.targetLevel,
            overallProgress: calculateOverallProgress({
              listening: nzcelData?.listeningProgress ?? userProgress.skillProgress.listening,
              speaking: nzcelData?.speakingProgress ?? userProgress.skillProgress.speaking,
              reading: nzcelData?.readingProgress ?? userProgress.skillProgress.reading,
              writing: nzcelData?.writingProgress ?? userProgress.skillProgress.writing
            }),
            skills: {
              listening: nzcelData?.listeningProgress ?? userProgress.skillProgress.listening,
              speaking: nzcelData?.speakingProgress ?? userProgress.skillProgress.speaking,
              reading: nzcelData?.readingProgress ?? userProgress.skillProgress.reading,
              writing: nzcelData?.writingProgress ?? userProgress.skillProgress.writing
            },
            questionsCompleted: nzcelData?.questionsCompleted || userProgress.completedQuestions.length,
            timeSpent: nzcelStats?.totalTime || 0,
            lastActivity: nzcelStats?.lastAccessed || new Date()
          },
          {
            id: "general",
            name: "General English (CEFR)",
            icon: Globe,
            currentLevel: cefrData?.currentLevel || cefrProgress.currentLevel,
            targetLevel: cefrData?.targetLevel || cefrProgress.targetLevel,
            overallProgress: calculateOverallProgress(cefrData?.skillProgress || cefrProgress.skillProgress),
            skills: cefrData?.skillProgress || cefrProgress.skillProgress,
            questionsCompleted: cefrData?.questionsCompleted || cefrProgress.questionsCompleted,
            timeSpent: generalStats?.totalTime || 0,
            lastActivity: generalStats?.lastAccessed || new Date()
          }
        ];

        setModules(modulesData);
      } catch (error) {
        console.error("Failed to load progress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressData();
  }, [userProgress, cefrProgress]);

  const calculateOverallProgress = (skills: { listening: number; speaking: number; reading: number; writing: number }) => {
    const values = Object.values(skills) as number[];
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case "listening": return Headphones;
      case "speaking": return Mic2;
      case "reading": return BookOpen;
      case "writing": return PenTool;
      default: return Circle;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-blue-600";
    if (progress >= 40) return "text-amber-600";
    return "text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey across all modules
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{userProgress.totalPoints.toLocaleString()}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Questions Completed</p>
                <p className="text-2xl font-bold">
                  {(userProgress.completedQuestions.length + cefrProgress.questionsCompleted).toLocaleString()}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Time</p>
                <p className="text-2xl font-bold">
                  {formatTime(modules.reduce((sum, m) => sum + m.timeSpent, 0))}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">
                  {Math.round(modules.reduce((sum, m) => sum + m.overallProgress, 0) / modules.length)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {module.currentLevel} → {module.targetLevel}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={getProgressColor(module.overallProgress)}>
                    {module.overallProgress}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{module.overallProgress}%</span>
                  </div>
                  <Progress value={module.overallProgress} className="h-3" />
                </div>

                {/* Skills Breakdown */}
                <div className="space-y-3">
                  {Object.entries(module.skills).map(([skill, progress]) => {
                    const SkillIcon = getSkillIcon(skill);
                    return (
                      <div key={skill} className="flex items-center gap-3">
                        <SkillIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="capitalize">{skill}</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Questions</p>
                    <p className="text-sm font-medium">{module.questionsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time Spent</p>
                    <p className="text-sm font-medium">{formatTime(module.timeSpent)}</p>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    if (module.id === "nzcel") {
                      window.location.href = "/practice/nzcel";
                    } else if (module.id === "general") {
                      window.location.href = "/practice/general";
                    }
                  }}
                >
                  Continue Learning
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Progress Tabs */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="history">Learning History</TabsTrigger>
        </TabsList>

        {/* Skills Analysis */}
        <TabsContent value="skills" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillRadarChart
              data={[
                { skill: "Listening", current: userProgress.skillProgress.listening, target: 85 },
                { skill: "Speaking", current: userProgress.skillProgress.speaking, target: 85 },
                { skill: "Reading", current: userProgress.skillProgress.reading, target: 90 },
                { skill: "Writing", current: userProgress.skillProgress.writing, target: 85 }
              ]}
              title="NZCEL Skills Balance"
              description="Your current proficiency in NZCEL framework"
            />
            <SkillRadarChart
              data={[
                { skill: "Listening", current: cefrProgress.skillProgress.listening, target: 85 },
                { skill: "Speaking", current: cefrProgress.skillProgress.speaking, target: 85 },
                { skill: "Reading", current: cefrProgress.skillProgress.reading, target: 90 },
                { skill: "Writing", current: cefrProgress.skillProgress.writing, target: 85 }
              ]}
              title="CEFR Skills Balance"
              description="Your current proficiency in CEFR framework"
            />
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Skill Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <div className="flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">Writing needs more practice - 15% below target</span>
                  </div>
                  <Button size="sm" variant="ghost">Practice Writing</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2">
                    <Mic2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Speaking is improving rapidly - Keep it up!</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">+8% this week</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Milestones */}
        <TabsContent value="milestones" className="mt-6">
          <div className="space-y-6">
            {/* NZCEL Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>NZCEL Level Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-border"></div>
                  {NZCEL_LEVELS.slice(0, 6).map((level, index) => {
                    const isCompleted = index < 2;
                    const isCurrent = index === 2;
                    return (
                      <div key={level.id} className="relative flex items-center mb-8 last:mb-0">
                        <div
                          className={`absolute left-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-primary text-primary-foreground"
                              : isCurrent
                              ? "bg-primary/20 border-2 border-primary"
                              : "bg-muted"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="ml-16">
                          <h4 className={`font-semibold ${isCurrent ? "text-primary" : ""}`}>
                            {level.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {level.description}
                          </p>
                          {isCurrent && (
                            <div className="mt-2">
                              <Progress value={65} className="h-2 max-w-xs" />
                              <p className="text-xs text-muted-foreground mt-1">65% complete</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CEFR Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>CEFR Level Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {CEFR_LEVELS.map((level, index) => {
                    const isCompleted = index < 2;
                    const isCurrent = index === 2;
                    return (
                      <div
                        key={level.id}
                        className={`text-center p-4 rounded-lg border ${
                          isCompleted
                            ? "bg-primary/10 border-primary"
                            : isCurrent
                            ? "bg-primary/5 border-primary border-dashed"
                            : "bg-muted/50 border-border"
                        }`}
                      >
                        <div
                          className={`text-2xl font-bold ${
                            isCompleted ? "text-primary" : isCurrent ? "text-primary/70" : "text-muted-foreground"
                          }`}
                        >
                          {level.id.toUpperCase()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{level.name}</p>
                        {isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-primary mx-auto mt-2" />
                        )}
                        {isCurrent && (
                          <div className="mt-2">
                            <Progress value={45} className="h-1" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Learning History */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Learning Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: "Today",
                    activities: [
                      { time: "2:30 PM", module: "NZCEL", skill: "Speaking", duration: "25 min", score: 85 },
                      { time: "10:15 AM", module: "General", skill: "Reading", duration: "30 min", score: 92 }
                    ]
                  },
                  {
                    date: "Yesterday",
                    activities: [
                      { time: "7:00 PM", module: "NZCEL", skill: "Writing", duration: "45 min", score: 78 },
                      { time: "3:30 PM", module: "General", skill: "Listening", duration: "20 min", score: 88 }
                    ]
                  },
                  {
                    date: "Monday, Jan 25",
                    activities: [
                      { time: "6:45 PM", module: "NZCEL", skill: "Reading", duration: "35 min", score: 90 },
                      { time: "11:00 AM", module: "General", skill: "Speaking", duration: "15 min", score: 82 }
                    ]
                  }
                ].map((day) => (
                  <div key={day.date}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-3">{day.date}</h4>
                    <div className="space-y-2">
                      {day.activities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-xs text-muted-foreground">{activity.time}</div>
                            <Badge variant="outline" className="text-xs">
                              {activity.module}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {React.createElement(getSkillIcon(activity.skill.toLowerCase()), { className: "h-4 w-4" })}
                              <span className="text-sm">{activity.skill} Practice</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">{activity.duration}</span>
                            <Badge variant={activity.score >= 80 ? "default" : "secondary"}>
                              {activity.score}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}