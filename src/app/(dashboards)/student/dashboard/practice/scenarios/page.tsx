import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function ScenariosPage() {
  return (
    <ComingSoonPage
      title="Scenario-Based Learning"
      description="Learn English through real-world scenarios and situations"
      expectedDate="March 2025"
      features={[
        "Workplace communication scenarios",
        "Academic English situations",
        "Daily life conversations",
        "Travel and tourism contexts",
        "Healthcare and emergency situations",
        "Interactive role-playing exercises",
      ]}
      backUrl="/"
      backLabel="Back to Home"
    />
  );
}