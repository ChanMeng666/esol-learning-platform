"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AISpeakingCoach } from "@/components/speaking/ai-coach";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Sparkles, TrendingUp } from "lucide-react";

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
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
              <Mic className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary">
                AI Speaking Practice
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time conversation practice with AI ESOL Coach
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              AI-Powered
            </Badge>
            <Badge variant="outline">Real-time Voice</Badge>
            <Badge variant="outline">CEFR-Aligned Feedback</Badge>
            <Badge variant="outline">A1 - C2 Levels</Badge>
          </div>
        </div>

        {/* Feature Overview */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-lg">What to Expect</CardTitle>
            <CardDescription>
              An interactive voice conversation session with an AI coach specialized in ESOL teaching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mic className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Natural Conversation</h3>
                  <p className="text-xs text-muted-foreground">
                    Speak naturally and get real-time voice responses from the AI
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Instant Feedback</h3>
                  <p className="text-xs text-muted-foreground">
                    Receive constructive feedback on coherence, fluency, vocabulary, and accuracy
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Adaptive Learning</h3>
                  <p className="text-xs text-muted-foreground">
                    AI adjusts to your CEFR level and provides personalized practice
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Component */}
        <AISpeakingCoach />

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Note:</strong> This feature uses OpenAI&apos;s Realtime API for natural voice conversations.
            Your practice sessions are not stored and are used only for real-time interaction.
            Make sure to allow microphone access when prompted.
          </p>
        </div>
      </div>
    </div>
  );
}
