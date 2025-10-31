"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { ChartRevenue } from "@/components/charts/chart-revenue";
import { ChartVisitors } from "@/components/charts/chart-visitors";
import { Progress } from "@/components/ui/progress";
import { getTeacherClasses } from "@/actions/classes";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Target,
  Award,
  AlertTriangle,
  Info,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from "lucide-react";

export default function TeacherAnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}

function AnalyticsPageContent() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("week");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const classData = await getTeacherClasses();
        setClasses(classData || []);
        if (classData && classData.length > 0) {
          setSelectedClass(classData[0]);
        }
      } catch (error) {
        console.error("Failed to load analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Teaching Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into student performance and engagement
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedClass?.id?.toString()} onValueChange={(value) => {
          const classItem = classes.find(c => c.id.toString() === value);
          setSelectedClass(classItem);
        }}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classItem) => (
              <SelectItem key={classItem.id.toString()} value={classItem.id.toString()}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="semester">This Semester</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-6 space-y-6">
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
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartRevenue
              title="Weekly Engagement Trend"
              description="Student activity levels over time"
              data={engagementData}
              config={{
                value: { label: "Activities", color: "hsl(var(--chart-1))" }
              }}
              stacked={false}
            />
            <ChartVisitors
              title="Activity Type Distribution"
              description="Breakdown by activity type"
              data={completionRates.map(item => ({
                category: item.category,
                value: item.rate,
                fill: item.color
              }))}
              config={completionRates.reduce((acc, item) => ({
                ...acc,
                [item.category]: {
                  label: item.category,
                  color: item.color
                }
              }), {})}
              centerLabel="Avg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Most Engaged Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2-4 PM</div>
                <p className="text-xs text-muted-foreground mt-1">Peak activity window</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Avg. Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38 min</div>
                <p className="text-xs text-green-600 mt-1">+5 min from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Weekly Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2</div>
                <p className="text-xs text-muted-foreground mt-1">Per student average</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Top Performers</CardTitle>
                </div>
                <CardDescription>Students showing excellent progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((student, index) => (
                    <div key={student.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">Score: {student.score}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">+{student.improvement}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Students Needing Support */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <CardTitle>Needs Support</CardTitle>
                </div>
                <CardDescription>Students who may benefit from extra help</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {strugglingStudents.map((student) => (
                    <div key={student.name} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{student.name}</p>
                        <Badge variant="destructive">{student.score}%</Badge>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs text-muted-foreground">Weak areas:</span>
                        {student.areas.map(area => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Completion Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Module Completion Status</CardTitle>
              <CardDescription>Track progress through course modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { module: "Module 1: Introduction", completed: 100, status: "completed" },
                  { module: "Module 2: Basic Grammar", completed: 100, status: "completed" },
                  { module: "Module 3: Vocabulary Building", completed: 85, status: "in-progress" },
                  { module: "Module 4: Speaking Practice", completed: 45, status: "in-progress" },
                  { module: "Module 5: Writing Skills", completed: 0, status: "not-started" },
                ].map((module) => (
                  <div key={module.module} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{module.module}</span>
                      <Badge variant={
                        module.status === "completed" ? "default" :
                        module.status === "in-progress" ? "secondary" :
                        "outline"
                      }>
                        {module.completed}%
                      </Badge>
                    </div>
                    <Progress value={module.completed} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>AI-generated observations about your class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Strong Improvement</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Speaking skills have improved by 15% over the past month
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Attention Needed</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Writing assignments have a 25% lower completion rate than other activities
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Pattern Detected</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Students perform 20% better on assignments submitted before 6 PM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Suggested actions to improve class performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg space-y-2">
                    <p className="text-sm font-medium">Schedule Review Sessions</p>
                    <p className="text-xs text-muted-foreground">
                      Consider adding optional review sessions for grammar topics where students struggle
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg space-y-2">
                    <p className="text-sm font-medium">Increase Speaking Practice</p>
                    <p className="text-xs text-muted-foreground">
                      Add more pair work activities to boost speaking confidence
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg space-y-2">
                    <p className="text-sm font-medium">Provide Writing Templates</p>
                    <p className="text-xs text-muted-foreground">
                      Offer structured templates to help students with writing assignments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prediction */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Prediction</CardTitle>
              <CardDescription>Expected outcomes based on current trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Expected Pass Rate</p>
                  <p className="text-3xl font-bold mt-2">92%</p>
                  <p className="text-xs text-green-600 mt-1">Above target</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. Final Score</p>
                  <p className="text-3xl font-bold mt-2">83%</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on current progress</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">At-Risk Students</p>
                  <p className="text-3xl font-bold mt-2">2</p>
                  <p className="text-xs text-amber-600 mt-1">Need intervention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}