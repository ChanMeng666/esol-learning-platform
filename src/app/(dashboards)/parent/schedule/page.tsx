import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function ParentSchedulePage() {
  return (
    <ComingSoonPage
      title="Schedule"
      description="View your children's class schedules and upcoming events"
      expectedDate="February 2025"
      features={[
        "Daily and weekly class schedules",
        "Assignment due dates calendar",
        "School events and activities",
        "Parent-teacher meeting bookings",
        "Exam and test schedules",
      ]}
      backUrl="/parent/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}