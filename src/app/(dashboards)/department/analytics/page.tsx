"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Target,
  Award,
  BookOpen,
  Activity,
  BarChart3,
  Download,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";

export default function DepartmentAnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}

function AnalyticsPageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  // Mock data
  const [performanceData] = useState([
    { month: "Jan", score: 78, attendance: 92 },
    { month: "Feb", score: 81, attendance: 94 },
    { month: "Mar", score: 83, attendance: 91 },
    { month: "Apr", score: 85, attendance: 93 },
    { month: "May", score: 86, attendance: 95 },
    { month: "Jun", score: 86, attendance: 94 },
  ]);

  const [teacherPerformance] = useState([
    { name: "Dr. Anderson", students: 24, avgScore: 87, satisfaction: 4.8 },
    { name: "Ms. Lee", students: 18, avgScore: 79, satisfaction: 4.5 },
    { name: "Prof. Taylor", students: 22, avgScore: 91, satisfaction: 4.9 },
    { name: "Ms. Chen", students: 20, avgScore: 83, satisfaction: 4.6 },
  ]);

  const [skillsData] = useState([
    { skill: "Listening", score: 85 },
    { skill: "Speaking", score: 78 },
    { skill: "Reading", score: 88 },
    { skill: "Writing", score: 82 },
  ]);

  const [completionData] = useState([
    { week: "Week 1", rate: 82 },
    { week: "Week 2", rate: 85 },
    { week: "Week 3", rate: 88 },
    { week: "Week 4", rate: 86 },
  ]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };
    loadData();
  }, [timeRange]);

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
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Department Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into department performance and trends
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setTimeRange("week")}>
            Week
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange("month")}>
            Month
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange("quarter")}>
            Quarter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">285</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+8% from last month</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold">86%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+3% improvement</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold">94%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+2% this month</span>
                </div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Teachers</p>
                <p className="text-2xl font-bold">12</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">All active</span>
                </div>
              </div>
              <GraduationCap className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Average scores and attendance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Score %"
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Attendance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Performance</CardTitle>
            <CardDescription>Average scores by skill area</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Performance</CardTitle>
          <CardDescription>Individual teacher metrics and effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherPerformance.map(teacher => (
              <div key={teacher.name} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher.students} students • Satisfaction: {teacher.satisfaction}/5.0
                    </p>
                  </div>
                  <Badge variant="default">{teacher.avgScore}%</Badge>
                </div>
                <Progress value={teacher.avgScore} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Completion Rates</CardTitle>
          <CardDescription>Weekly completion trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/10">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Reading</p>
                <p className="text-sm text-muted-foreground">88% average score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-amber-500/10">
                <Activity className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Speaking</p>
                <p className="text-sm text-muted-foreground">78% average score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Improved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-500/10">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Writing</p>
                <p className="text-sm text-muted-foreground">+5% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}