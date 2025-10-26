import { ProtectedRoute } from "@/components/auth/protected-route";
import { SpeakingContent } from "@/components/content/speaking-content";

/**
 * Speaking practice page within student dashboard
 */
export default function StudentDashboardSpeakingPage() {
  return (
    <ProtectedRoute>
      <SpeakingContent />
    </ProtectedRoute>
  );
}