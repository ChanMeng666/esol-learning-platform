"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AISpeakingCoach } from "@/components/speaking/ai-coach";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

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
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              AI Speaking Practice
            </h1>
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
    </div>
  );
}