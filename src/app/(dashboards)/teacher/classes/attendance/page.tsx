import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherClassAttendancePage() {
  return (
    <ComingSoonPage
      title="Attendance Management"
      description="Track and manage student attendance"
      expectedDate="January 2025"
      features={[
        "Daily attendance marking",
        "Attendance history and patterns",
        "Automatic parent notifications",
        "Attendance reports generation",
        "Integration with school systems",
      ]}
      backUrl="/teacher/classes"
      backLabel="Back to Classes"
    />
  );
}