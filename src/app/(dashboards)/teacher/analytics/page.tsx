"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { Progress } from "@/components/ui/progress";
import { useAnalyticsContext } from "./layout";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  BarChart3,
  Activity
} from "lucide-react";

export default function TeacherAnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPerformanceContent />
    </ProtectedRoute>
  );
}

function AnalyticsPerformanceContent() {
  const { selectedClass, timeRange, isLoading } = useAnalyticsContext();

  // Mock data for charts
  const weeklyProgressData = [
    { date: "Mon", listening: 75, speaking: 70, reading: 80, writing: 72 },
    { date: "Tue", listening: 78, speaking: 73, reading: 82, writing: 75 },
    { date: "Wed", listening: 80, speaking: 75, reading: 85, writing: 77 },
    { date: "Thu", listening: 82, speaking: 78, reading: 87, writing: 80 },
    { date: "Fri", listening: 85, speaking: 80, reading: 88, writing: 82 },
    { date: "Sat", listening: 86, speaking: 82, reading: 90, writing: 84 },
    { date: "Sun", listening: 88, speaking: 85, reading: 92, writing: 86 },
  ];

  const skillDistribution = [
    { skill: "Listening", current: 82, target: 85 },
    { skill: "Speaking", current: 78, target: 85 },
    { skill: "Reading", current: 86, target: 90 },
    { skill: "Writing", current: 79, target: 85 },
    { skill: "Grammar", current: 83, target: 88 },
    { skill: "Vocabulary", current: 81, target: 85 },
  ];

  const engagementData = [
    { name: "Week 1", value: 320, label: "320 activities" },
    { name: "Week 2", value: 380, label: "380 activities" },
    { name: "Week 3", value: 420, label: "420 activities" },
    { name: "Week 4", value: 450, label: "450 activities" },
  ];

  const completionRates = [
    { category: "Assignments", rate: 87, color: "hsl(var(--chart-1))" },
    { category: "Quizzes", rate: 92, color: "hsl(var(--chart-2))" },
    { category: "Practice", rate: 75, color: "hsl(var(--chart-3))" },
    { category: "Speaking", rate: 68, color: "hsl(var(--chart-4))" },
  ];

  const studentPerformance = [
    { range: "90-100%", label: "Excellent", count: 5, percentage: 20 },
    { range: "80-89%", label: "Good", count: 8, percentage: 32 },
    { range: "70-79%", label: "Average", count: 7, percentage: 28 },
    { range: "60-69%", label: "Below Average", count: 3, percentage: 12 },
    { range: "Below 60%", label: "Needs Support", count: 2, percentage: 8 },
  ];

  const topPerformers = [
    { name: "Alex Chen", score: 95, improvement: 8 },
    { name: "Sarah Kim", score: 92, improvement: 5 },
    { name: "James Lee", score: 90, improvement: 12 },
  ];

  const strugglingStudents = [
    { name: "Mike Johnson", score: 62, areas: ["Speaking", "Writing"] },
    { name: "Tom Davis", score: 58, areas: ["Listening", "Grammar"] },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Class Average</p>
                <p className="text-2xl font-bold">82.5%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+3.2% this week</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">78%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+5% this week</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">87%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-600">-2% this week</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">23/25</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">92% active</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressLineChart
              data={weeklyProgressData}
              title="Weekly Skill Progress"
              description="Average skill performance across all students"
            />
            <SkillRadarChart
              data={skillDistribution}
              title="Skill Distribution"
              description="Class average vs target performance"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Performance Distribution</CardTitle>
              <CardDescription>
                How students are performing across different grade ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentPerformance.map((range) => (
                  <div key={range.range} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{range.label}</span>
                        <span className="text-sm text-muted-foreground ml-2">({range.range})</span>
                      </div>
                      <span className="text-sm font-medium">
                        {range.count} students ({range.percentage}%)
                      </span>
                    </div>
                    <Progress value={range.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}