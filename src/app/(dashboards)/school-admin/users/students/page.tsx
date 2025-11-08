import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function SchoolAdminStudentsPage() {
  return (
    <ComingSoonPage
      title="Student Management"
      description="Manage student accounts and enrollments"
      expectedDate="January 2025"
      features={[
        "Student enrollment and registration",
        "Class assignment and transfers",
        "Academic record management",
        "Student profile administration",
        "Bulk operations for student data",
      ]}
      backUrl="/school-admin/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}