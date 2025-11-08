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
  BookOpen,
  Headphones,
  MessageSquare,
  PenTool,
  GraduationCap,
  Globe,
  ArrowRight,
  Flame
} from "lucide-react";
import Link from "next/link";

// Import Server Actions
import { getUserProgress } from "@/actions/user-progress";
import { getCEFRProgress } from "@/actions/cefr-progress";

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
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nzcelProgress.totalPoints?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{nzcelProgress.streak || 0}</span>
              <span className="text-sm text-muted-foreground">days</span>
              {(nzcelProgress.streak || 0) > 0 && (
                <span className="text-lg">🔥</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
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
      <div className="grid gap-6 lg:grid-cols-2">
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
                <span className="text-muted-foreground">Current Level</span>
                <span className="font-medium">{nzcelProgress.currentLevel || "Foundation"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Level</span>
                <span className="font-medium">{nzcelProgress.targetLevel || "Level 3"}</span>
              </div>
            </div>
            <Progress value={nzcelOverall} className="h-2" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-muted-foreground" />
                <span>{nzcelProgress.skillProgress?.listening || 0}% Listening</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{nzcelProgress.skillProgress?.speaking || 0}% Speaking</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{nzcelProgress.skillProgress?.reading || 0}% Reading</span>
              </div>
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-muted-foreground" />
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
                <span className="text-muted-foreground">Current Level</span>
                <span className="font-medium">{cefrProgressData.currentLevel || "A2"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Level</span>
                <span className="font-medium">{cefrProgressData.targetLevel || "B2"}</span>
              </div>
            </div>
            <Progress value={cefrOverall} className="h-2" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-muted-foreground" />
                <span>{cefrProgressData.listeningProgress || 0}% Listening</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{cefrProgressData.speakingProgress || 0}% Speaking</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{cefrProgressData.readingProgress || 0}% Reading</span>
              </div>
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-muted-foreground" />
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
      </div>
    </div>
  );
}
