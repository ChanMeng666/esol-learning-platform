"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/shared/empty-state";
import { useInsightsContext } from "./context";
import {
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

export default function TeacherInsightsPage() {
  return (
    <ProtectedRoute>
      <InsightsOverviewContent />
    </ProtectedRoute>
  );
}

function InsightsOverviewContent() {
  const { selectedClass, insightsData } = useInsightsContext();

  if (!selectedClass) {
    return (
      <EmptyState
        title="No class selected"
        description="Please select a class to view insights"
        icon={<Brain className="w-16 h-16" />}
      />
    );
  }

  const getInsightIcon = (insightType: string) => {
    switch (insightType) {
      case "common_errors":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "difficult_topics":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "student_engagement":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "skill_distribution":
        return <Brain className="h-5 w-5 text-purple-600" />;
      case "recommended_focus_areas":
        return <Lightbulb className="h-5 w-5 text-orange-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightBgColor = (insightType: string) => {
    switch (insightType) {
      case "common_errors":
        return "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20";
      case "student_engagement":
        return "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20";
      case "difficult_topics":
        return "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20";
      case "recommended_focus_areas":
        return "border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20";
      default:
        return "border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-900/20";
    }
  };

  const getInsightTitle = (insightType: string) => {
    switch (insightType) {
      case "common_errors":
        return "Common Errors";
      case "difficult_topics":
        return "Difficult Topics";
      case "student_engagement":
        return "Student Engagement";
      case "skill_distribution":
        return "Skill Distribution";
      case "recommended_focus_areas":
        return "Recommended Focus Areas";
      case "class_performance_summary":
        return "Performance Summary";
      default:
        return "Insight";
    }
  };

  return (
    <div className="space-y-8">
      {/* Insights List */}
      {insightsData.length === 0 ? (
        <EmptyState
          title="No insights available"
          description="Insights will appear here as students practice and complete assignments"
          icon={<Brain className="w-16 h-16" />}
        />
      ) : (
        <div className="grid gap-6">
          {insightsData.map((insight: any) => (
            <Card key={insight.id.toString()} className={getInsightBgColor(insight.insightType)}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {getInsightIcon(insight.insightType)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{getInsightTitle(insight.insightType)}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.scopeType}
                      </Badge>
                    </div>
                    {insight.data?.summary && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {insight.data.summary}
                      </p>
                    )}
                    {insight.data?.recommendations && insight.data.recommendations.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Recommendations:</p>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          {insight.data.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}