import { ProtectedRoute } from "@/components/auth/protected-route";
import { PracticeNZCELContent } from "@/components/content/practice-nzcel-content";

/**
 * NZCEL practice page within student dashboard
 */
export default function StudentDashboardPracticeNZCELPage() {
  return (
    <ProtectedRoute>
      <PracticeNZCELContent />
    </ProtectedRoute>
  );
}