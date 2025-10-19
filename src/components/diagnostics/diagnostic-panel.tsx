"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, RefreshCw, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserDiagnostics, createSampleData } from "@/actions/diagnostics";

interface DiagnosticData {
  currentUserId: string;
  practiceSessionsCount: number;
  recordingsCount: number;
  conversationSessionsCount: number;
}

export function DiagnosticPanel() {
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSample, setIsCreatingSample] = useState(false);

  const loadDiagnostics = async () => {
    setIsLoading(true);
    try {
      const result = await getUserDiagnostics();
      setData(result);
    } catch (error) {
      console.error("[DiagnosticPanel] Failed to load diagnostics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSample = async () => {
    setIsCreatingSample(true);
    try {
      await createSampleData();
      // Reload diagnostics to show new data
      await loadDiagnostics();
      alert("Sample data created successfully! Refresh the History tab to see it.");
    } catch (error) {
      console.error("[DiagnosticPanel] Failed to create sample data:", error);
      alert("Failed to create sample data. Check console for details.");
    } finally {
      setIsCreatingSample(false);
    }
  };

  useEffect(() => {
    loadDiagnostics();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Diagnostics...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const hasData =
    data.practiceSessionsCount > 0 ||
    data.recordingsCount > 0 ||
    data.conversationSessionsCount > 0;

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {hasData ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              )}
              Diagnostic Panel
            </CardTitle>
            <CardDescription>
              {hasData
                ? "Your account has history data"
                : "No history data found for your account"}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDiagnostics}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User ID */}
        <div>
          <p className="text-sm font-medium mb-1">Current User ID:</p>
          <code className="text-xs bg-white px-2 py-1 rounded border">
            {data.currentUserId}
          </code>
        </div>

        {/* Data Counts */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Practice Sessions</p>
            <Badge variant={data.practiceSessionsCount > 0 ? "default" : "secondary"}>
              {data.practiceSessionsCount}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Recordings</p>
            <Badge variant={data.recordingsCount > 0 ? "default" : "secondary"}>
              {data.recordingsCount}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Conversations</p>
            <Badge variant={data.conversationSessionsCount > 0 ? "default" : "secondary"}>
              {data.conversationSessionsCount}
            </Badge>
          </div>
        </div>

        {/* Create Sample Data Button */}
        {!hasData && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              No history data found. Create sample data to test the history feature:
            </p>
            <Button
              onClick={handleCreateSample}
              disabled={isCreatingSample}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreatingSample ? "Creating..." : "Create Sample Data"}
            </Button>
          </div>
        )}

        {/* Info Message */}
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p>
            <strong>Note:</strong> The database contains sessions for user ID{" "}
            <code className="bg-white px-1 py-0.5 rounded">
              d0c0f8eb-7f4e-4d63-b900-a7cae45f5935
            </code>
            . If your user ID doesn&apos;t match, those sessions won&apos;t appear in your history.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
