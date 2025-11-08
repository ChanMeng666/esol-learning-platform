import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function ParentHelpPage() {
  return (
    <ComingSoonPage
      title="Help & Support"
      description="Support resources for parents"
      expectedDate="February 2025"
      features={[
        "Parent guide to the platform",
        "How to support your child's learning",
        "Understanding progress reports",
        "Communication with teachers",
        "Technical support and FAQs",
      ]}
      backUrl="/parent/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}