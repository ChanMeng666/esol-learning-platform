import { ProtectedRoute } from "@/components/auth/protected-route";
import { StackAccountSettingsContent } from "@/components/content/stack-account-settings-content";

/**
 * Account settings page within student dashboard
 * Uses Stack Auth's built-in AccountSettings component
 */
export default function StudentDashboardSettingsPage() {
  return (
    <ProtectedRoute>
      <StackAccountSettingsContent />
    </ProtectedRoute>
  );
}