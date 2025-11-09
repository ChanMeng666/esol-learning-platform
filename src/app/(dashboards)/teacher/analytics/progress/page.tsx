"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/shared/empty-state";
import { useAnalyticsContext } from "../context";
import { TrendingUp } from "lucide-react";

export default function TeacherAnalyticsProgressPage() {
  return (
    <ProtectedRoute>
      <ProgressContent />
    </ProtectedRoute>
  );
}

function ProgressContent() {
  const { selectedClass } = useAnalyticsContext();

  if (!selectedClass) {
    return (
      <EmptyState
        title="No class selected"
        description="Please select a class to view progress tracking"
        icon={<TrendingUp className="w-16 h-16" />}
      />
    );
  }

  return (
    <EmptyState
      title="Progress tracking coming soon"
      description="Student progress tracking, top performers, and module completion analytics will be available soon"
      icon={<TrendingUp className="w-16 h-16" />}
    />
  );
}