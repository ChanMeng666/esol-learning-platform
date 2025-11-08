"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function StudentSchedulePage() {
  return (
    <ProtectedRoute>
      <ComingSoonPage
        title="Class Schedule"
        description="View and manage your classes, assignments, and learning activities in one place."
        expectedDate="Q1 2025"
        features={[
          "View all your scheduled classes and sessions",
          "Track assignment due dates and exam schedules",
          "Get reminders for upcoming events",
          "Join online classes with one click",
          "Sync with your calendar app"
        ]}
        backUrl="/student/dashboard"
        backLabel="Back to Dashboard"
      />
    </ProtectedRoute>
  );
}
