"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { NZCELTab } from "@/components/dashboard/nzcel-tab";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NZCELProgressPage() {
  return (
    <ProtectedRoute>
      <NZCELProgressContent />
    </ProtectedRoute>
  );
}

function NZCELProgressContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/student/progress">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Progress
          </Button>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">NZCEL Progress</h1>
        <p className="text-muted-foreground">
          Track your exam preparation
        </p>
      </div>

      {/* NZCEL Tab Content */}
      <NZCELTab />
    </div>
  );
}