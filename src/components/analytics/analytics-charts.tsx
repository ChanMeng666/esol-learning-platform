"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Target,
} from "lucide-react";

interface SkillData {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
}

interface AnalyticsChartsProps {
  title?: string;
  skills?: SkillData;
  engagement?: {
    totalSessions?: number;
    avgAccuracy?: number;
    avgStreak?: number;
    activeStudents?: number;
    totalStudents?: number;
  };
  trends?: {
    skill: string;
    current: number;
    previous: number;
    change: number;
  }[];
  showSkillsRadar?: boolean;
  showTrends?: boolean;
  showEngagement?: boolean;
}

export function AnalyticsCharts({
  title = "Performance Analytics",
  skills,
  engagement,
  trends = [],
  showSkillsRadar = true,
  showTrends = true,
  showEngagement = true,
}: AnalyticsChartsProps) {
  function getTrendIcon(change: number) {
    if (change > 5) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < -5) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  }

  function getTrendBadgeVariant(change: number): "default" | "secondary" | "destructive" {
    if (change > 5) return "default";
    if (change < -5) return "destructive";
    return "secondary";
  }

  function getProgressColor(value: number): string {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-blue-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-red-500";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {/* Skills Progress */}
      {showSkillsRadar && skills && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Skills Progress
            </CardTitle>
            <CardDescription>Performance across four key skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Listening */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-medium">Listening</span>
                  </div>
                  <span className="text-2xl font-bold">{skills.listening}%</span>
                </div>
                <div className="relative">
                  <Progress value={skills.listening} className="h-3" />
                  <div
                    className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(
                      skills.listening
                    )}`}
                    style={{ width: `${skills.listening}%` }}
                  />
                </div>
              </div>

              {/* Speaking */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-medium">Speaking</span>
                  </div>
                  <span className="text-2xl font-bold">{skills.speaking}%</span>
                </div>
                <div className="relative">
                  <Progress value={skills.speaking} className="h-3" />
                  <div
                    className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(
                      skills.speaking
                    )}`}
                    style={{ width: `${skills.speaking}%` }}
                  />
                </div>
              </div>

              {/* Reading */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="font-medium">Reading</span>
                  </div>
                  <span className="text-2xl font-bold">{skills.reading}%</span>
                </div>
                <div className="relative">
                  <Progress value={skills.reading} className="h-3" />
                  <div
                    className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(
                      skills.reading
                    )}`}
                    style={{ width: `${skills.reading}%` }}
                  />
                </div>
              </div>

              {/* Writing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="font-medium">Writing</span>
                  </div>
                  <span className="text-2xl font-bold">{skills.writing}%</span>
                </div>
                <div className="relative">
                  <Progress value={skills.writing} className="h-3" />
                  <div
                    className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(
                      skills.writing
                    )}`}
                    style={{ width: `${skills.writing}%` }}
                  />
                </div>
              </div>

              {/* Average */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Overall Average</span>
                  <span className="text-3xl font-bold">
                    {Math.round(
                      (skills.listening + skills.speaking + skills.reading + skills.writing) / 4
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engagement Metrics */}
      {showEngagement && engagement && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Engagement Metrics
            </CardTitle>
            <CardDescription>Activity and participation statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {engagement.totalSessions !== undefined && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {engagement.totalSessions}
                  </p>
                </div>
              )}

              {engagement.avgAccuracy !== undefined && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Avg Accuracy</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {engagement.avgAccuracy}%
                  </p>
                </div>
              )}

              {engagement.avgStreak !== undefined && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Avg Streak</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {engagement.avgStreak}
                  </p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
              )}

              {engagement.activeStudents !== undefined && engagement.totalStudents !== undefined && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Active Rate</p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {engagement.totalStudents > 0
                      ? Math.round((engagement.activeStudents / engagement.totalStudents) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {engagement.activeStudents}/{engagement.totalStudents}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trends */}
      {showTrends && trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Trends
            </CardTitle>
            <CardDescription>Comparing current to previous period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trends.map((trend, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getTrendIcon(trend.change)}
                    <div>
                      <p className="font-medium capitalize">{trend.skill}</p>
                      <p className="text-sm text-muted-foreground">
                        Previous: {trend.previous}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold">{trend.current}%</p>
                      <Badge variant={getTrendBadgeVariant(trend.change)}>
                        {trend.change > 0 ? "+" : ""}
                        {trend.change}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills Distribution Pie Chart (Simple Visual) */}
      {skills && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Skills Distribution
            </CardTitle>
            <CardDescription>Visual breakdown of skill proficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple bar chart visualization */}
              <div className="grid grid-cols-4 gap-2 h-48">
                {/* Listening */}
                <div className="flex flex-col items-center justify-end">
                  <div
                    className="w-full bg-blue-500 rounded-t-lg transition-all"
                    style={{ height: `${skills.listening}%` }}
                  />
                  <p className="text-xs font-medium mt-2">Listening</p>
                  <p className="text-xs text-muted-foreground">{skills.listening}%</p>
                </div>

                {/* Speaking */}
                <div className="flex flex-col items-center justify-end">
                  <div
                    className="w-full bg-green-500 rounded-t-lg transition-all"
                    style={{ height: `${skills.speaking}%` }}
                  />
                  <p className="text-xs font-medium mt-2">Speaking</p>
                  <p className="text-xs text-muted-foreground">{skills.speaking}%</p>
                </div>

                {/* Reading */}
                <div className="flex flex-col items-center justify-end">
                  <div
                    className="w-full bg-purple-500 rounded-t-lg transition-all"
                    style={{ height: `${skills.reading}%` }}
                  />
                  <p className="text-xs font-medium mt-2">Reading</p>
                  <p className="text-xs text-muted-foreground">{skills.reading}%</p>
                </div>

                {/* Writing */}
                <div className="flex flex-col items-center justify-end">
                  <div
                    className="w-full bg-orange-500 rounded-t-lg transition-all"
                    style={{ height: `${skills.writing}%` }}
                  />
                  <p className="text-xs font-medium mt-2">Writing</p>
                  <p className="text-xs text-muted-foreground">{skills.writing}%</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-sm">Listening</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span className="text-sm">Speaking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-purple-500" />
                  <span className="text-sm">Reading</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-500" />
                  <span className="text-sm">Writing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
