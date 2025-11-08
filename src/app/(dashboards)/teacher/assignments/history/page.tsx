import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherAssignmentHistoryPage() {
  return (
    <ComingSoonPage
      title="Assignment History"
      description="View past assignments and student performance"
      expectedDate="February 2025"
      features={[
        "Archive of all past assignments",
        "Historical grade distributions",
        "Student performance trends",
        "Re-use previous assignments",
        "Export historical data",
      ]}
      backUrl="/teacher/assignments"
      backLabel="Back to Assignments"
    />
  );
}