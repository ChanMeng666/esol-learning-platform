"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { useActivityContext } from "../context";
import {
  Trophy,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Clock,
  Calendar,
  Activity,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ParentActivitySummaryPage() {
  return (
    <ProtectedRoute>
      <SummaryContent />
    </ProtectedRoute>
  );
}

function SummaryContent() {
  const { activityData, attendanceData, children, timeRange } = useActivityContext();

  // Calculate summary statistics
  const totalActivities = activityData.length;
  const completedActivities = activityData.filter(a => a.status === "completed").length;
  const inProgressActivities = activityData.filter(a => a.status === "in_progress").length;

  // Group activities by type
  const activitiesByType = {
    achievement: activityData.filter(a => a.type === "achievement").length,
    practice: activityData.filter(a => a.type === "practice").length,
    test: activityData.filter(a => a.type === "test").length,
    attendance: activityData.filter(a => a.type === "attendance").length,
    alert: activityData.filter(a => a.type === "alert").length,
  };

  // Calculate attendance summary
  const presentDays = attendanceData.filter(a => a.status === "present").length;
  const totalAttendanceDays = attendanceData.length / children.length;
  const attendanceRate = totalAttendanceDays > 0 ? Math.round((presentDays / attendanceData.length) * 100) : 0;

  // Generate weekly progress data
  const generateWeeklyData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => ({
      date: day,
      activities: Math.round(3 + Math.random() * 7),
      attendance: Math.round(80 + Math.random() * 20),
      studyTime: Math.round(30 + Math.random() * 90),
    }));
  };

  const weeklyData = generateWeeklyData();

  // Calculate child-specific metrics
  const childMetrics = children.map(child => {
    const childActivities = activityData.filter(a => a.childName === child.name);
    const childAttendance = attendanceData.filter(a => a.childName === child.name);
    const childPresent = childAttendance.filter(a => a.status === "present").length;
    const childAttendanceRate = childAttendance.length > 0
      ? Math.round((childPresent / childAttendance.length) * 100)
      : 0;

    return {
      name: child.name,
      totalActivities: childActivities.length,
      completedActivities: childActivities.filter(a => a.status === "completed").length,
      achievements: childActivities.filter(a => a.type === "achievement").length,
      attendanceRate: childAttendanceRate,
      lastActive: childActivities[0]?.timestamp || new Date(),
    };
  });

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 dark:border-green-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">{completedActivities} of {totalActivities}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressActivities}</p>
                <p className="text-xs text-muted-foreground">In progress</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold text-purple-600">{activitiesByType.achievement}</p>
                <p className="text-xs text-muted-foreground">This {timeRange}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Sessions</p>
                <p className="text-2xl font-bold text-amber-600">{activitiesByType.practice}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <BookOpen className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Distribution</CardTitle>
          <CardDescription>
            Breakdown of activities by type for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(activitiesByType).map(([type, count]) => {
              const percentage = totalActivities > 0 ? Math.round((count / totalActivities) * 100) : 0;
              const icons = {
                achievement: <Award className="h-4 w-4 text-amber-500" />,
                practice: <BookOpen className="h-4 w-4 text-blue-500" />,
                test: <BarChart3 className="h-4 w-4 text-purple-500" />,
                attendance: <Calendar className="h-4 w-4 text-green-500" />,
                alert: <AlertCircle className="h-4 w-4 text-red-500" />,
              };

              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {icons[type as keyof typeof icons]}
                      <span className="text-sm font-medium capitalize">{type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count} activities</span>
                      <Badge variant="secondary">{percentage}%</Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <ProgressLineChart
        data={weeklyData.map(d => ({
          date: d.date,
          activities: d.activities,
          attendance: d.attendance,
          overall: Math.round((d.activities * 10 + d.attendance) / 2),
        }))}
        title="Weekly Activity Trends"
        description="Activity and attendance patterns over the week"
      />

      {/* Children Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Children Performance Comparison</CardTitle>
          <CardDescription>
            Side-by-side comparison of each child's activity metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {childMetrics.map(child => (
              <div key={child.name} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">{child.name}</h4>
                  <Badge variant="outline">
                    Last active: {new Date(child.lastActive).toLocaleDateString()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Activities</p>
                    <p className="text-xl font-bold">{child.totalActivities}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-xl font-bold text-green-600">{child.completedActivities}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                    <p className="text-xl font-bold text-amber-600">{child.achievements}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance</p>
                    <p className="text-xl font-bold text-blue-600">{child.attendanceRate}%</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-medium">
                      {child.completedActivities > 0
                        ? Math.round((child.completedActivities / child.totalActivities) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress
                    value={child.completedActivities > 0
                      ? Math.round((child.completedActivities / child.totalActivities) * 100)
                      : 0}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>
            AI-generated observations and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Strong Performance</p>
              <p className="text-sm text-muted-foreground">
                {attendanceRate}% attendance rate shows excellent consistency
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Focus Area</p>
              <p className="text-sm text-muted-foreground">
                Consider increasing practice sessions for better skill development
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
            <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Time Management</p>
              <p className="text-sm text-muted-foreground">
                Peak activity times are between 3-5 PM on weekdays
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}