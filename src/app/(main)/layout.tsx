import { Suspense } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-16 border-b border-border/40 bg-background" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
