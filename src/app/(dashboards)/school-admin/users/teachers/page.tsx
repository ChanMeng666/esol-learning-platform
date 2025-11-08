import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function SchoolAdminTeachersPage() {
  return (
    <ComingSoonPage
      title="Teacher Management"
      description="Manage teacher accounts and permissions"
      expectedDate="January 2025"
      features={[
        "Add and remove teacher accounts",
        "Assign teachers to departments",
        "Manage teacher permissions and roles",
        "View teacher performance metrics",
        "Bulk import/export teacher data",
      ]}
      backUrl="/school-admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}