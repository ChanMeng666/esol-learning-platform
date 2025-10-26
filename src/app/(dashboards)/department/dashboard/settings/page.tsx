import { ProtectedRoute } from "@/components/auth/protected-route";
import { StackAccountSettingsContent } from "@/components/content/stack-account-settings-content";

/**
 * Account settings page within department head dashboard
 * Uses Stack Auth's built-in AccountSettings component
 */
export default function DepartmentDashboardSettingsPage() {
  return (
    <ProtectedRoute>
      <StackAccountSettingsContent />
    </ProtectedRoute>
  );
}