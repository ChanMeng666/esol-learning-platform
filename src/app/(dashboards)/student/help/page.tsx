import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function StudentHelpPage() {
  return (
    <ComingSoonPage
      title="Help & Support"
      description="Get help with your learning journey"
      expectedDate="February 2025"
      features={[
        "Interactive help center with FAQs",
        "Video tutorials for platform features",
        "Live chat support with tutors",
        "Technical troubleshooting guides",
        "Learning tips and study strategies",
      ]}
      backUrl="/student/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}