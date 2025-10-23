"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { RealtimeTest } from "@/components/test/realtime-test";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, AlertTriangle } from "lucide-react";

/**
 * ⚠️ DEVELOPMENT TESTING PAGE - NOT FOR PRODUCTION USE ⚠️
 *
 * Test page for OpenAI Realtime API with ESOL Speaking Coach
 *
 * This page provides a testing interface for the OpenAI Realtime API
 * using the Agents SDK. It includes voice conversation, transcript display,
 * debug information, and session parameter controls.
 *
 * For production use, see: /speaking
 */
export default function TestRealtimePage() {
  return (
    <ProtectedRoute>
      <TestRealtimePageContent />
    </ProtectedRoute>
  );
}

function TestRealtimePageContent() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Development Warning */}
        <Card className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900 dark:text-orange-100">
                Development Testing Page
              </CardTitle>
            </div>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              This page is for development and testing purposes only. It includes debug information and advanced controls.
              For the production user experience, visit{" "}
              <a href="/speaking" className="underline font-semibold hover:text-orange-900 dark:hover:text-orange-100">
                /speaking
              </a>
              .
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Mic className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary">
                Realtime Voice Test
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                OpenAI Realtime API with ESOL Speaking Coach
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary">OpenAI Agents SDK</Badge>
            <Badge variant="outline">GA API</Badge>
            <Badge variant="outline">gpt-realtime</Badge>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">About This Test</CardTitle>
            <CardDescription>
              This page demonstrates the OpenAI Realtime API integration with the ESOL Speaking Coach prompt.
              Click &quot;Start Session&quot; to begin a voice conversation with the AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-24">Features:</span>
              <span className="text-muted-foreground">
                Real-time voice conversation, transcript history, debug logs, parameter controls
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-24">Prompt:</span>
              <span className="text-muted-foreground">
                ESOL Speaking Coach for CEFR-aligned English practice (A1-C2 levels)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-24">Requirements:</span>
              <span className="text-muted-foreground">
                Microphone access required for voice input
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Realtime Test Component */}
        <RealtimeTest />
      </div>
    </div>
  );
}
