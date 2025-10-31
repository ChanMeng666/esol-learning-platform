"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { LearningTimeChart } from "@/components/charts/learning-time-chart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useContainerQuery } from "@/hooks/use-container-query";
import { useUserProgress } from "@/lib/store/user-progress";
import { useCEFRProgress } from "@/lib/store/cefr-progress";
import {
  TrendingUp,
  Target,
  Brain,
  Activity,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

// Import Server Actions
import { getUserProgress } from "@/actions/user-progress";
import { getCEFRProgress } from "@/actions/cefr-progress";
import { getAggregatedStats } from "@/actions/module-stats";

export default function StudentAnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}

function AnalyticsPageContent() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isLgUp, isMdUp } = useContainerQuery<HTMLDivElement>();
  const userProgress = useUserProgress();
  const cefrProgress = useCEFRProgress();

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        // Load all analytics data in parallel
        const [nzcelProgress, cefrProgressData, aggregatedStats] = await Promise.all([
          getUserProgress(),
          getCEFRProgress(),
          getAggregatedStats()
        ]);

        // Generate analytics data
        const weeklyProgress = generateWeeklyProgress();
        const skillBalance = generateSkillBalance(nzcelProgress, cefrProgressData);
        const studyTime = generateStudyTime();
        const monthlyTrend = generateMonthlyTrend();
        const skillComparison = generateSkillComparison(nzcelProgress, cefrProgressData);

        setData({
          nzcelProgress,
          cefrProgress: cefrProgressData,
          aggregatedStats,
          weeklyProgress,
          skillBalance,
          studyTime,
          monthlyTrend,
          skillComparison
        });
      } catch (error) {
        console.error("Failed to load analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  // Helper functions for generating data
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

  const generateStudyTime = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => ({
      day,
      time: Math.round(20 + Math.random() * 40),
      sessions: Math.round(1 + Math.random() * 3)
    }));
  };

  const generateMonthlyTrend = () => {
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map(month => ({
      month,
      nzcel: Math.round(60 + Math.random() * 30),
      cefr: Math.round(55 + Math.random() * 35),
      overall: Math.round(58 + Math.random() * 32)
    }));
  };

  const generateSkillComparison = (nzcelProgress: any, cefrProgress: any) => {
    const nzcelSkills = nzcelProgress?.skillProgress || {};
    const cefrSkills = cefrProgress?.skillProgress || {};

    return [
      {
        skill: "Listening",
        nzcel: nzcelSkills.listening || 0,
        cefr: cefrSkills.listening || 0,
        difference: (nzcelSkills.listening || 0) - (cefrSkills.listening || 0)
      },
      {
        skill: "Speaking",
        nzcel: nzcelSkills.speaking || 0,
        cefr: cefrSkills.speaking || 0,
        difference: (nzcelSkills.speaking || 0) - (cefrSkills.speaking || 0)
      },
      {
        skill: "Reading",
        nzcel: nzcelSkills.reading || 0,
        cefr: cefrSkills.reading || 0,
        difference: (nzcelSkills.reading || 0) - (cefrSkills.reading || 0)
      },
      {
        skill: "Writing",
        nzcel: nzcelSkills.writing || 0,
        cefr: cefrSkills.writing || 0,
        difference: (nzcelSkills.writing || 0) - (cefrSkills.writing || 0)
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Analytics</h1>
        <p className="text-muted-foreground">
          Deep insights into your learning progress and performance
        </p>
      </div>

      {/* Main Charts */}
      <div className={`grid gap-4 ${isLgUp ? "grid-cols-2" : "grid-cols-1"}`}>
        <ProgressLineChart
          data={data.weeklyProgress}
          title="Weekly Progress Trend"
          description="Your skill improvement over the past week"
        />
        <SkillRadarChart
          data={data.skillBalance}
          title="Skill Balance"
          description="Your current proficiency across all skills"
        />
      </div>

      {/* Study Time Analysis */}
      <LearningTimeChart
        data={data.studyTime}
        title="Daily Study Time"
        description="Your learning activity this week"
        goalMinutes={30}
      />

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>6-Month Progress Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.monthlyTrend.map((month: any, index: number) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{month.month}</span>
                  <span className="text-muted-foreground">{month.overall}%</span>
                </div>
                <Progress value={month.overall} className="h-2" />
                {index > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {month.overall > data.monthlyTrend[index - 1].overall ? (
                      <>
                        <ArrowUp className="h-3 w-3 text-green-600" />
                        <span>+{month.overall - data.monthlyTrend[index - 1].overall}% from last month</span>
                      </>
                    ) : month.overall < data.monthlyTrend[index - 1].overall ? (
                      <>
                        <ArrowDown className="h-3 w-3 text-red-600" />
                        <span>{data.monthlyTrend[index - 1].overall - month.overall}% from last month</span>
                      </>
                    ) : (
                      <>
                        <Minus className="h-3 w-3" />
                        <span>No change from last month</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm">Strong improvement in Speaking (+15% this week)</span>
            </div>
            <Badge variant="secondary" className="text-xs">Excellent</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm">On track to reach B2 level by March 2025</span>
            </div>
            <Badge variant="secondary" className="text-xs">On Track</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-amber-600" />
              <span className="text-sm">Consider more Writing practice to balance skills</span>
            </div>
            <Badge variant="secondary" className="text-xs">Recommendation</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Peak performance time: 7-9 PM (based on your history)</span>
            </div>
            <Badge variant="secondary" className="text-xs">Pattern</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Skill Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>NZCEL vs CEFR Progress Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.skillComparison.map((item: any) => (
              <div key={item.skill} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.skill}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">NZCEL:</span>
                      <Progress value={item.nzcel} className="w-20 h-2" />
                      <span className="text-xs font-medium">{item.nzcel}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">CEFR:</span>
                      <Progress value={item.cefr} className="w-20 h-2" />
                      <span className="text-xs font-medium">{item.cefr}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {item.difference > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  ) : item.difference < 0 ? (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm font-medium ${
                    item.difference > 0 ? "text-green-600" :
                    item.difference < 0 ? "text-red-600" :
                    "text-muted-foreground"
                  }`}>
                    {Math.abs(item.difference)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Grid */}
      <div className={`grid gap-4 ${isLgUp ? "grid-cols-4" : isMdUp ? "grid-cols-2" : "grid-cols-1"}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Accuracy Rate</p>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mt-2">87.3%</p>
            <p className="text-xs text-green-600 mt-1">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mt-2">18.5s</p>
            <p className="text-xs text-green-600 mt-1">-3.2s improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mt-2">92.1%</p>
            <p className="text-xs text-amber-600 mt-1">-0.8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Focus Score</p>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mt-2">8.7/10</p>
            <p className="text-xs text-green-600 mt-1">+0.3 points</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}