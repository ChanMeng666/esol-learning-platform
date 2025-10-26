import { ProtectedRoute } from "@/components/auth/protected-route";
import { PracticeGeneralContent } from "@/components/content/practice-general-content";

/**
 * General practice page within student dashboard
 */
export default function StudentDashboardPracticeGeneralPage() {
  return (
    <ProtectedRoute>
      <PracticeGeneralContent />
    </ProtectedRoute>
  );
}