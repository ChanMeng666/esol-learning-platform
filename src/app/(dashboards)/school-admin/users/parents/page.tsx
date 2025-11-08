import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function SchoolAdminParentsPage() {
  return (
    <ComingSoonPage
      title="Parent Management"
      description="Manage parent accounts and relationships"
      expectedDate="January 2025"
      features={[
        "Parent account creation and management",
        "Link parents to student accounts",
        "Parent communication preferences",
        "Access control and permissions",
        "Parent engagement analytics",
      ]}
      backUrl="/school-admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}