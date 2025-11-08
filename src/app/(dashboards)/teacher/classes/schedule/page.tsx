import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherClassSchedulePage() {
  return (
    <ComingSoonPage
      title="Class Schedule"
      description="View and manage your teaching timetable"
      expectedDate="February 2025"
      features={[
        "Weekly and monthly schedule views",
        "Class timing and room assignments",
        "Schedule conflict detection",
        "Substitute teacher management",
        "Schedule export and printing",
      ]}
      backUrl="/teacher/classes"
      backLabel="Back to Classes"
    />
  );
}