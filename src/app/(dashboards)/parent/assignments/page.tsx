"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen, CheckCircle2 } from "lucide-react";

export default function ParentAssignmentsPage() {
  return (
    <ProtectedRoute>
      <AssignmentsContent />
    </ProtectedRoute>
  );
}

function AssignmentsContent() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
      </div>

      {/* Stats Cards - Simplified to 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assignments
            </CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all children
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No Assignments Yet"
            description="Assignment tracking is currently being developed. Check back soon to monitor your children's homework and projects."
            icon={<BookOpen className="w-16 h-16" />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
