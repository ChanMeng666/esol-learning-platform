import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherResourcesPage() {
  return (
    <ComingSoonPage
      title="Teaching Resources"
      description="Access lesson plans, worksheets, and educational materials"
      expectedDate="February 2025"
      features={[
        "Downloadable lesson plans aligned with NZCEL curriculum",
        "Interactive worksheets and activities",
        "Audio and video resources for classroom use",
        "Customizable teaching materials",
        "Resource sharing with other teachers",
      ]}
      backUrl="/teacher/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}