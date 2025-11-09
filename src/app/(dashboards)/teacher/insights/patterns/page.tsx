"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/shared/empty-state";
import { useInsightsContext } from "../context";
import { Brain } from "lucide-react";

export default function TeacherInsightsPatternsPage() {
  return (
    <ProtectedRoute>
      <PatternsContent />
    </ProtectedRoute>
  );
}

function PatternsContent() {
  const { selectedClass } = useInsightsContext();

  if (!selectedClass) {
    return (
      <EmptyState
        title="No class selected"
        description="Please select a class to view learning patterns"
        icon={<Brain className="w-16 h-16" />}
      />
    );
  }

  return (
    <EmptyState
      title="Learning pattern analysis coming soon"
      description="Time-based patterns, engagement analytics, and learning style distribution will be available soon"
      icon={<Brain className="w-16 h-16" />}
    />
  );
}