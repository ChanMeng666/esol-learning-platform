"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAnalyticsContext } from "../context";
import { AlertTriangle, Info, Zap } from "lucide-react";

export default function TeacherAnalyticsInsightsPage() {
  return (
    <ProtectedRoute>
      <InsightsContent />
    </ProtectedRoute>
  );
}

function InsightsContent() {
  const { selectedClass, timeRange } = useAnalyticsContext();

  return (
    <div className="space-y-6">
      {/* Key Insights and Recommendations */}
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

              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Info className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Learning Style Insight</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Visual learners in your class respond better to video content
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

              <div className="p-3 border rounded-lg space-y-2">
                <p className="text-sm font-medium">Adjust Deadlines</p>
                <p className="text-xs text-muted-foreground">
                  Consider moving assignment deadlines to earlier in the day for better completion rates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Prediction */}
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

      {/* Learning Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Trends</CardTitle>
          <CardDescription>Patterns observed over {timeRange === 'week' ? 'this week' : timeRange === 'month' ? 'this month' : timeRange === 'semester' ? 'this semester' : 'this year'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Positive Trends</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className="text-sm">Consistent improvement in listening comprehension</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className="text-sm">Higher engagement in group activities</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className="text-sm">Better time management skills</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Areas for Improvement</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <p className="text-sm">Grammar accuracy needs attention</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <p className="text-sm">Vocabulary retention could be better</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <p className="text-sm">Written expression requires more practice</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Action Items</CardTitle>
          <CardDescription>Prioritized recommendations for immediate impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 font-bold text-sm">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Contact struggling students</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Reach out to Mike Johnson and Tom Davis to offer additional support
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 font-bold text-sm">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Review Module 4 content</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Module 4 has low completion rate - consider simplifying or breaking it down
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 font-bold text-sm">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Celebrate top performers</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recognize Alex Chen, Sarah Kim, and James Lee for their excellent progress
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}