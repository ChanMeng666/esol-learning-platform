import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function ParentFeedbackPage() {
  return (
    <ComingSoonPage
      title="Teacher Feedback"
      description="View feedback and comments from your child's teachers"
      expectedDate="January 2025"
      features={[
        "Real-time teacher feedback on assignments",
        "Behavioral and participation notes",
        "Areas of improvement suggestions",
        "Praise and recognition highlights",
        "Direct messaging with teachers",
      ]}
      backUrl="/parent/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}