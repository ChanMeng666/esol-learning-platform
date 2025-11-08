import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherAssignmentGradePage() {
  return (
    <ComingSoonPage
      title="Grade Assignments"
      description="Review and grade student submissions"
      expectedDate="January 2025"
      features={[
        "Queue-based grading workflow",
        "Rubric-based assessment tools",
        "Inline feedback and annotations",
        "Grade distribution analytics",
        "Batch grading for similar answers",
      ]}
      backUrl="/teacher/assignments"
      backLabel="Back to Assignments"
    />
  );
}