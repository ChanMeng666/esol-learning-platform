import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherStudentsPage() {
  return (
    <ComingSoonPage
      title="Student Progress"
      description="Track and monitor individual student performance"
      expectedDate="January 2025"
      features={[
        "Individual student progress tracking",
        "Skill-based performance analytics",
        "Learning path recommendations",
        "Progress reports generation",
        "Parent communication tools",
      ]}
      backUrl="/teacher/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}