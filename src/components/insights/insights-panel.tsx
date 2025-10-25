"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingState } from "@/components/shared/loading-state";
import {
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Info,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";

interface Insight {
  type?: "success" | "warning" | "alert" | "info";
  title: string;
  description: string;
}

interface MetricsData {
  skills?: {
    [key: string]: number;
  };
  engagement?: {
    totalSessions?: number;
    avgAccuracy?: number;
    streak?: number;
  };
}

interface InsightsPanelProps {
  title?: string;
  description?: string;
  summary?: string;
  insights: Insight[];
  recommendations?: string[];
  strengths?: Insight[];
  challenges?: Insight[];
  metrics?: MetricsData;
  onRefresh?: () => Promise<void>;
  showMetrics?: boolean;
  isLoading?: boolean;
}

export function InsightsPanel({
  title = "AI Insights",
  description = "Intelligent analysis and recommendations",
  summary,
  insights,
  recommendations = [],
  strengths = [],
  challenges = [],
  metrics,
  onRefresh,
  showMetrics = true,
  isLoading = false,
}: InsightsPanelProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    try {
      setRefreshing(true);
      await onRefresh();
      toast.success("Insights refreshed");
    } catch (error) {
      console.error("Error refreshing insights:", error);
      toast.error("Failed to refresh insights");
    } finally {
      setRefreshing(false);
    }
  };

  function getInsightIcon(type?: string) {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  }

  function getInsightVariant(type?: string): "default" | "destructive" {
    return type === "alert" ? "destructive" : "default";
  }

  if (isLoading) {
    return <LoadingState message="Generating insights..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            )}
          </div>
        </CardHeader>
        {summary && (
          <CardContent>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Summary</AlertTitle>
              <AlertDescription>{summary}</AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* Metrics Overview */}
      {showMetrics && metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.skills && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">Skills Progress</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(metrics.skills).map(([skill, value]) => (
                    <div
                      key={skill}
                      className="p-3 bg-muted rounded-lg text-center"
                    >
                      <p className="text-xs text-muted-foreground capitalize mb-1">
                        {skill}
                      </p>
                      <p className="text-2xl font-bold">{value as number}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metrics.engagement && (
              <div className="space-y-3 mt-6">
                <h4 className="font-semibold text-sm text-muted-foreground">Engagement</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {metrics.engagement.totalSessions !== undefined && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Sessions</p>
                      <p className="text-xl font-bold">{metrics.engagement.totalSessions}</p>
                    </div>
                  )}
                  {metrics.engagement.avgAccuracy !== undefined && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="text-xl font-bold">{metrics.engagement.avgAccuracy}%</p>
                    </div>
                  )}
                  {metrics.engagement.streak !== undefined && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Streak</p>
                      <p className="text-xl font-bold">{metrics.engagement.streak} days</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {strengths.map((strength, index) => (
              <div
                key={index}
                className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  {strength.title}
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  {strength.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Challenges */}
      {challenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {challenges.map((challenge, index) => (
              <div
                key={index}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              >
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  {challenge.title}
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {challenge.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* General Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="w-5 h-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <Alert key={index} variant={getInsightVariant(insight.type)}>
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <AlertTitle>{insight.title}</AlertTitle>
                    <AlertDescription>{insight.description}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-primary" />
              Recommendations
            </CardTitle>
            <CardDescription>Actionable steps to improve outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm flex-1">{recommendation}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {insights.length === 0 &&
        recommendations.length === 0 &&
        strengths.length === 0 &&
        challenges.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Insights Available</h3>
              <p className="text-muted-foreground mb-4">
                There is not enough data yet to generate meaningful insights.
              </p>
              {onRefresh && (
                <Button onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  Try Again
                </Button>
              )}
            </CardContent>
          </Card>
        )}
    </div>
  );
}
