"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LayoutDashboard, GraduationCap, Globe, Mic, Trophy, Flame, Award, Target } from "lucide-react";
import { OverviewTabNew as OverviewTab } from "@/components/dashboard/overview-tab-new";
import { NZCELTab } from "@/components/dashboard/nzcel-tab";
import { GeneralPracticeTab } from "@/components/dashboard/general-practice-tab";
import { SpeakingTab } from "@/components/dashboard/speaking-tab";
import { useUserProgress } from "@/lib/store/user-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}

function DashboardPageContent() {
  const { totalPoints, streak, badges, achievements } = useUserProgress();

  // Count completed achievements
  const completedAchievements = achievements.filter(a => a.progress >= a.target).length;
  const totalAchievements = achievements.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress across all learning modules
        </p>
      </div>

      {/* Gamification Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Points Card */}
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="border-2 hover:border-orange-500/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <p className="text-2xl font-bold">{streak}</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Card */}
        <Card className="border-2 hover:border-purple-500/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold">{badges.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card className="border-2 hover:border-green-500/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold">{completedAchievements}/{totalAchievements}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <Target className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
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
      </Tabs>
    </div>
  );
}
