"use client";

import { AISpeakingCoach } from "@/components/speaking/ai-coach";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import Link from "next/link";

/**
 * Speaking content component for dashboard integration
 * Extracted from /speaking page without layout wrapper
 */
export function SpeakingContent() {
  return (
    <div className="space-y-6">
      {/* Header with History Link */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Speaking Practice</h2>
          <p className="text-muted-foreground mt-2">
            Real-time voice conversation with AI ESOL coach
          </p>
        </div>
        <Link href="/student/dashboard/speaking/history">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            View History
          </Button>
        </Link>
      </div>

      {/* Main Component */}
      <AISpeakingCoach />
    </div>
  );
}