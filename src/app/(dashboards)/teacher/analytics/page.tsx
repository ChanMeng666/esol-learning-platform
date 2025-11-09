"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { EmptyState } from "@/components/shared/empty-state";
import { useAnalyticsContext } from "./context";
import { BarChart3 } from "lucide-react";

export default function TeacherAnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPerformanceContent />
    </ProtectedRoute>
  );
}

function AnalyticsPerformanceContent() {
  const { selectedClass, analyticsData } = useAnalyticsContext();

  // No analytics data available
  if (!selectedClass) {
    return (
      <EmptyState
        title="No class selected"
        description="Please select a class to view analytics"
        icon={<BarChart3 className="w-16 h-16" />}
      />
    );
  }

  if (!analyticsData) {
    return (
      <EmptyState
        title="No analytics data available"
        description="Analytics data will appear here once students start practicing"
        icon={<BarChart3 className="w-16 h-16" />}
      />
    );
  }

  // Prepare skill distribution data from real analytics
  const skillDistribution = [
    {
      skill: "Listening",
      current: parseFloat(analyticsData.avgListeningProgress || "0"),
      target: 85
    },
    {
      skill: "Speaking",
      current: parseFloat(analyticsData.avgSpeakingProgress || "0"),
      target: 85
    },
    {
      skill: "Reading",
      current: parseFloat(analyticsData.avgReadingProgress || "0"),
      target: 85
    },
    {
      skill: "Writing",
      current: parseFloat(analyticsData.avgWritingProgress || "0"),
      target: 85
    },
  ];

  // Calculate average accuracy as percentage
  const avgAccuracy = analyticsData.averageAccuracy
    ? parseFloat(analyticsData.averageAccuracy) * 100
    : 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Simplified Key Metrics - Only 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.totalStudents || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {analyticsData.activeStudents || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Questions Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.totalQuestionsCompleted || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round(avgAccuracy)}% accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Skill Distribution Chart */}
      <SkillRadarChart
        data={skillDistribution}
        title="Skill Distribution"
        description="Average progress across all skills"
      />
    </div>
  );
}