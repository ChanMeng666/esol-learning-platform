"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useInsightsContext } from "./context";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Activity,
  Zap
} from "lucide-react";

export default function TeacherInsightsPage() {
  return (
    <ProtectedRoute>
      <InsightsOverviewContent />
    </ProtectedRoute>
  );
}

function InsightsOverviewContent() {
  const { selectedClass, timeframe, insightsData } = useInsightsContext();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "suggestion":
        return <Lightbulb className="h-5 w-5 text-purple-600" />;
      default:
        return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20";
      case "warning":
        return "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20";
      case "info":
        return "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20";
      case "suggestion":
        return "border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-900/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Key Insights This {timeframe === 'week' ? 'Week' : timeframe === 'month' ? 'Month' : timeframe === 'semester' ? 'Semester' : 'Period'}</h3>
        <div className="grid gap-4">
          {insightsData.map((insight: any) => (
            <Card key={insight.id} className={getInsightBgColor(insight.type)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                    {insight.actionable && (
                      <Button variant="link" className="h-auto p-0 mt-2 text-xs">
                        Take Action →
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Class Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">+12%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall improvement this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Engagement Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">8.5/10</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Above department average</p>
          </CardContent>
        </Card>
      </div>

      {/* Insight Categories Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Insights by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Performance</p>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">insights</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Engagement</p>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">insights</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-600" />
              <p className="text-sm font-medium">Attention</p>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">insights</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Suggestions</p>
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-muted-foreground">insights</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Assignment completion rate increased</p>
                <p className="text-xs text-muted-foreground">85% → 92% in the last week</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">New peak in daily active students</p>
                <p className="text-xs text-muted-foreground">23 out of 25 students active yesterday</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-amber-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Writing practice needs attention</p>
                <p className="text-xs text-muted-foreground">30% below target completion rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}