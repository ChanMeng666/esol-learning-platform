"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/shared/empty-state";
import { useAnalyticsContext } from "../context";
import { Activity } from "lucide-react";

export default function TeacherAnalyticsEngagementPage() {
  return (
    <ProtectedRoute>
      <EngagementContent />
    </ProtectedRoute>
  );
}

function EngagementContent() {
  const { selectedClass } = useAnalyticsContext();

  if (!selectedClass) {
    return (
      <EmptyState
        title="No class selected"
        description="Please select a class to view engagement analytics"
        icon={<Activity className="w-16 h-16" />}
      />
    );
  }

  return (
    <EmptyState
      title="Engagement analytics coming soon"
      description="Student engagement metrics, activity patterns, and session duration analytics will be available soon"
      icon={<Activity className="w-16 h-16" />}
    />
  );
}