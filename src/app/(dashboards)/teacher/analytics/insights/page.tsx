"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/shared/empty-state";
import { useAnalyticsContext } from "../context";
import { Lightbulb } from "lucide-react";

export default function TeacherAnalyticsInsightsPage() {
  return (
    <ProtectedRoute>
      <InsightsContent />
    </ProtectedRoute>
  );
}

function InsightsContent() {
  const { selectedClass } = useAnalyticsContext();

  if (!selectedClass) {
    return (
      <EmptyState
        title="No class selected"
        description="Please select a class to view AI-generated insights"
        icon={<Lightbulb className="w-16 h-16" />}
      />
    );
  }

  return (
    <EmptyState
      title="AI insights coming soon"
      description="AI-generated observations, performance predictions, and actionable recommendations will be available soon"
      icon={<Lightbulb className="w-16 h-16" />}
    />
  );
}