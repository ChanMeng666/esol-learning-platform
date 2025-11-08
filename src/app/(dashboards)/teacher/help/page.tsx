import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherHelpPage() {
  return (
    <ComingSoonPage
      title="Help & Support"
      description="Resources and support for teachers"
      expectedDate="February 2025"
      features={[
        "Teaching best practices guide",
        "Platform feature tutorials",
        "Professional development resources",
        "Technical support documentation",
        "Community forum for educators",
      ]}
      backUrl="/teacher/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}