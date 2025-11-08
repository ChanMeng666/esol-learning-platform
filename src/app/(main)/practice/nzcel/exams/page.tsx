import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function MockExamsPage() {
  return (
    <ComingSoonPage
      title="Mock Exams"
      description="Practice with full-length NZCEL mock examinations"
      expectedDate="March 2025"
      features={[
        "Full-length timed mock exams for each NZCEL level",
        "Authentic exam format and question types",
        "Instant scoring and detailed feedback",
        "Performance analytics and weak area identification",
        "Certificate of completion for each mock exam",
      ]}
      backUrl="/practice/nzcel"
      backLabel="Back to NZCEL Practice"
    />
  );
}