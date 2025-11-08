import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherAssignmentsPage() {
  return (
    <ComingSoonPage
      title="Assignments"
      description="Create, manage, and grade student assignments"
      expectedDate="January 2025"
      features={[
        "Assignment creation and distribution",
        "Automated grading for objective questions",
        "Manual grading tools for essays",
        "Rubric-based assessment",
        "Assignment analytics and insights",
      ]}
      backUrl="/teacher/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}