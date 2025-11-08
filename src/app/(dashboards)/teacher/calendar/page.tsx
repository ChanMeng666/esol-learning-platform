import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherCalendarPage() {
  return (
    <ComingSoonPage
      title="Calendar"
      description="Manage your teaching schedule and important dates"
      expectedDate="February 2025"
      features={[
        "Class schedule overview",
        "Assignment due dates tracking",
        "School events and holidays",
        "Parent-teacher meeting scheduling",
        "Sync with personal calendar",
      ]}
      backUrl="/teacher/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}