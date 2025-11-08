import { ComingSoonPage } from "@/components/shared/coming-soon-page";

export default function TeacherClassMaterialsPage() {
  return (
    <ComingSoonPage
      title="Class Materials"
      description="Manage and share educational materials with your classes"
      expectedDate="February 2025"
      features={[
        "Upload and organize course materials",
        "Share documents with students",
        "Create material collections by topic",
        "Track material access and downloads",
        "Version control for updated materials",
      ]}
      backUrl="/teacher/classes"
      backLabel="Back to Classes"
    />
  );
}