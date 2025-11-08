import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherCurriculumPage() {
  return (
    <ComingSoonPage
      title="Curriculum Management"
      description="Access and manage curriculum resources"
      expectedDate="March 2025"
      features={[
        "NZCEL curriculum framework overview",
        "Learning objectives and outcomes",
        "Assessment criteria and rubrics",
        "Curriculum mapping tools",
        "Alignment with national standards",
      ]}
      backUrl="/teacher/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}