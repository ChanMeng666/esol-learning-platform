import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherAssignmentCreatePage() {
  return (
    <ComingSoonPage
      title="Create New Assignment"
      description="Design and distribute assignments to your students"
      expectedDate="January 2025"
      features={[
        "Rich text editor for assignment instructions",
        "Multiple question types support",
        "Attach files and resources",
        "Set due dates and submission rules",
        "Auto-save draft assignments",
      ]}
      backUrl="/teacher/assignments"
      backLabel="Back to Assignments"
    />
  );
}