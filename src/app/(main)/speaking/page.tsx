"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AISpeakingCoach } from "@/components/speaking/ai-coach";

/**
 * AI Speaking Practice Page
 *
 * Real-time voice conversation with AI ESOL coach
 * Provides interactive speaking practice with instant feedback
 */
export default function SpeakingPage() {
  return (
    <ProtectedRoute>
      <SpeakingPageContent />
    </ProtectedRoute>
  );
}

function SpeakingPageContent() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            AI Speaking Practice
          </h1>
          <p className="text-muted-foreground">
            Real-time conversation practice with AI ESOL Coach
          </p>
        </div>

        {/* Main Component */}
        <AISpeakingCoach />
      </div>
    </div>
  );
}
