import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function StudentAssignmentsPage() {
  return (
    <ComingSoonPage
      title="My Assignments"
      description="View and submit your assignments"
      expectedDate="January 2025"
      features={[
        "View all assigned tasks and homework",
        "Submit assignments online",
        "Track submission status and due dates",
        "View teacher feedback and grades",
        "Download assignment resources",
      ]}
      backUrl="/student/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}