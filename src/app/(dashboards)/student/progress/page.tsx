"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useUserProgress } from "@/lib/store/user-progress";
import { useCEFRProgress } from "@/lib/store/cefr-progress";
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
  Clock,
  CheckCircle2,
  Activity
} from "lucide-react";
import Link from "next/link";

// Import Server Actions
import { getUserProgress } from "@/actions/user-progress";
import { getCEFRProgress } from "@/actions/cefr-progress";
import { getModuleProgress } from "@/actions/module-stats";

export default function StudentProgressPage() {
  return (
    <ProtectedRoute>
      <ProgressPageContent />
    </ProtectedRoute>
  );
}

function ProgressPageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState<any>(null);
  const userProgress = useUserProgress();
  const cefrProgress = useCEFRProgress();

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const [nzcelData, cefrData] = await Promise.all([
          getUserProgress(),
          getCEFRProgress(),
        ]);

        setProgressData({ nzcel: nzcelData, cefr: cefrData });
      } catch (error) {
        console.error("Failed to load progress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading progress data...</p>
        </div>
      </div>
    );
  }

  const nzcelProgress = progressData?.nzcel || userProgress;
  const cefrProgressData = progressData?.cefr || cefrProgress;

  // Calculate overall progress for each module
  const calculateOverallProgress = (skills: any) => {
    const values = Object.values(skills).filter(v => typeof v === 'number') as number[];
    return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  };

  const nzcelOverall = calculateOverallProgress(nzcelProgress.skillProgress || {});
  const cefrOverall = calculateOverallProgress({
    listening: cefrProgressData.listeningProgress || 0,
    speaking: cefrProgressData.speakingProgress || 0,
    reading: cefrProgressData.readingProgress || 0,
    writing: cefrProgressData.writingProgress || 0
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
        <p className="text-muted-foreground">
          Track your advancement across all learning modules
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{nzcelProgress.totalPoints?.toLocaleString() || 0}</span>
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                +12%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{nzcelProgress.streak || 0} days</span>
              {(nzcelProgress.streak || 0) > 0 && (
                <span className="text-sm">🔥</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {nzcelProgress.achievements?.filter((a: any) => a.progress >= a.target).length || 0}
              </span>
              <span className="text-sm text-muted-foreground">
                / {nzcelProgress.achievements?.length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Progress Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* NZCEL Progress Card */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-base">NZCEL Progress</CardTitle>
                  <CardDescription>Exam Preparation</CardDescription>
                </div>
              </div>
              <Badge variant="outline">{nzcelOverall}%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Level</span>
                <span className="font-medium">{nzcelProgress.currentLevel || "Foundation"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Target Level</span>
                <span className="font-medium">{nzcelProgress.targetLevel || "Level 3"}</span>
              </div>
            </div>
            <Progress value={nzcelOverall} className="h-2" />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Headphones className="h-3 w-3" />
                <span>{nzcelProgress.skillProgress?.listening || 0}% Listening</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{nzcelProgress.skillProgress?.speaking || 0}% Speaking</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{nzcelProgress.skillProgress?.reading || 0}% Reading</span>
              </div>
              <div className="flex items-center gap-1">
                <PenTool className="h-3 w-3" />
                <span>{nzcelProgress.skillProgress?.writing || 0}% Writing</span>
              </div>
            </div>
            <Link href="/student/progress/nzcel">
              <Button className="w-full" variant="outline">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* General English Progress Card */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-base">General English</CardTitle>
                  <CardDescription>CEFR Aligned</CardDescription>
                </div>
              </div>
              <Badge variant="outline">{cefrOverall}%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Level</span>
                <span className="font-medium">{cefrProgressData.currentLevel || "A2"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Target Level</span>
                <span className="font-medium">{cefrProgressData.targetLevel || "B2"}</span>
              </div>
            </div>
            <Progress value={cefrOverall} className="h-2" />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Headphones className="h-3 w-3" />
                <span>{cefrProgressData.listeningProgress || 0}% Listening</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{cefrProgressData.speakingProgress || 0}% Speaking</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{cefrProgressData.readingProgress || 0}% Reading</span>
              </div>
              <div className="flex items-center gap-1">
                <PenTool className="h-3 w-3" />
                <span>{cefrProgressData.writingProgress || 0}% Writing</span>
              </div>
            </div>
            <Link href="/student/progress/general">
              <Button className="w-full" variant="outline">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Speaking Stats Card */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Mic2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Speaking Stats</CardTitle>
                  <CardDescription>AI Coach Sessions</CardDescription>
                </div>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Sessions</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg Score</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Practice Time</span>
                <span className="font-medium">3h 24m</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Fluency</span>
                <span>82%</span>
              </div>
              <Progress value={82} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pronunciation</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Vocabulary</span>
                <span>79%</span>
              </div>
              <Progress value={79} className="h-1.5" />
            </div>
            <Link href="/student/progress/speaking">
              <Button className="w-full" variant="outline">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your learning activity from the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Completed NZCEL Level 2 Practice Test</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="secondary">+250 pts</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full">
                <Mic2 className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Speaking Practice with AI Coach</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
              <Badge variant="secondary">+100 pts</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Achievement Unlocked: 7-Day Streak</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
              <Badge variant="secondary">+500 pts</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}