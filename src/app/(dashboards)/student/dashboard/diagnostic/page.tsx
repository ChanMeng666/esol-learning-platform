import { ProtectedRoute } from "@/components/auth/protected-route";
import { DiagnosticContent } from "@/components/content/diagnostic-content";

/**
 * Diagnostic tests page within student dashboard
 */
export default function StudentDashboardDiagnosticPage() {
  return (
    <ProtectedRoute>
      <DiagnosticContent />
    </ProtectedRoute>
  );
}