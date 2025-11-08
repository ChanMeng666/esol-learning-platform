import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function ParentReportsPage() {
  return (
    <ComingSoonPage
      title="Progress Reports"
      description="View detailed progress reports for your children"
      expectedDate="January 2025"
      features={[
        "Monthly and quarterly progress reports",
        "Skill-based performance analysis",
        "Comparison with grade-level benchmarks",
        "Teacher comments and recommendations",
        "Export reports as PDF",
      ]}
      backUrl="/parent/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}