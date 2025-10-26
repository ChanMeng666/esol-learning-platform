import { ProtectedRoute } from "@/components/auth/protected-route";
import { StackAccountSettingsContent } from "@/components/content/stack-account-settings-content";

/**
 * Account settings page within system admin dashboard
 * Uses Stack Auth's built-in AccountSettings component
 */
export default function SystemAdminDashboardSettingsPage() {
  return (
    <ProtectedRoute>
      <StackAccountSettingsContent />
    </ProtectedRoute>
  );
}