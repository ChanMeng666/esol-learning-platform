import { ProtectedRoute } from "@/components/auth/protected-route";
import { StackAccountSettingsContent } from "@/components/content/stack-account-settings-content";

/**
 * Account settings page within teacher dashboard
 * Uses Stack Auth's built-in AccountSettings component
 */
export default function TeacherDashboardSettingsPage() {
  return (
    <ProtectedRoute>
      <StackAccountSettingsContent />
    </ProtectedRoute>
  );
}