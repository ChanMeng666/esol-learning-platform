import { ProtectedRoute } from "@/components/auth/protected-route";
import { StackAccountSettingsContent } from "@/components/content/stack-account-settings-content";

/**
 * Account settings page within school admin dashboard
 * Uses Stack Auth's built-in AccountSettings component
 */
export default function SchoolAdminDashboardSettingsPage() {
  return (
    <ProtectedRoute>
      <StackAccountSettingsContent />
    </ProtectedRoute>
  );
}