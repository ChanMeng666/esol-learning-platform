"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/shared/empty-state";
import { useInsightsContext } from "../context";
import { Lightbulb } from "lucide-react";

export default function TeacherInsightsRecommendationsPage() {
  return (
    <ProtectedRoute>
      <RecommendationsContent />
    </ProtectedRoute>
  );
}

function RecommendationsContent() {
  const { selectedClass, insightsData } = useInsightsContext();

  if (!selectedClass) {
    return (
      <EmptyState
        title="No class selected"
        description="Please select a class to view recommendations"
        icon={<Lightbulb className="w-16 h-16" />}
      />
    );
  }

  // Filter insights to show only recommendation-type insights
  const recommendationInsights = insightsData.filter(
    (insight: any) => insight.insightType === "recommended_focus_areas"
  );

  if (recommendationInsights.length === 0) {
    return (
      <EmptyState
        title="No recommendations available yet"
        description="Actionable recommendations will appear here as students practice and complete assignments"
        icon={<Lightbulb className="w-16 h-16" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      {recommendationInsights.map((insight: any) => (
        <Card key={insight.id.toString()}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Lightbulb className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-lg">Recommended Focus Areas</h4>
                  <Badge variant="outline" className="text-xs">
                    {insight.scopeType}
                  </Badge>
                </div>
                {insight.data?.summary && (
                  <p className="text-sm text-muted-foreground">
                    {insight.data.summary}
                  </p>
                )}
                {insight.data?.recommendations && insight.data.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Action Items:</p>
                    <ul className="space-y-2">
                      {insight.data.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <span className="font-medium text-blue-600">{idx + 1}.</span>
                          <span>{rec}</span>
                        </li>
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
  );
}