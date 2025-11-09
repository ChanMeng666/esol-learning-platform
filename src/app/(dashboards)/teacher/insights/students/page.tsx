"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/shared/empty-state";
import { useInsightsContext } from "../context";
import { Users } from "lucide-react";

export default function TeacherInsightsStudentsPage() {
  return (
    <ProtectedRoute>
      <StudentsInsightsContent />
    </ProtectedRoute>
  );
}

function StudentsInsightsContent() {
  const { selectedClass } = useInsightsContext();

  if (!selectedClass) {
    return (
      <EmptyState
        title="No class selected"
        description="Please select a class to view student insights"
        icon={<Users className="w-16 h-16" />}
      />
    );
  }

  return (
    <EmptyState
      title="Individual student insights coming soon"
      description="Detailed per-student analytics with strengths, weaknesses, and personalized recommendations will be available soon"
      icon={<Users className="w-16 h-16" />}
    />
  );
}