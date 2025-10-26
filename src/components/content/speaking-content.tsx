"use client";

import { AISpeakingCoach } from "@/components/speaking/ai-coach";

/**
 * Speaking content component for dashboard integration
 * Extracted from /speaking page without layout wrapper
 */
export function SpeakingContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Speaking Practice</h2>
        <p className="text-muted-foreground mt-2">
          Real-time voice conversation with AI ESOL coach
        </p>
      </div>

      {/* Main Component */}
      <AISpeakingCoach />
    </div>
  );
}