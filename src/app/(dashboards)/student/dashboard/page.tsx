"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { OverviewTabNew as OverviewTab } from "@/components/dashboard/overview-tab-new";
import { TodoCard } from "@/components/dashboard/student/todo-card";
import { DiagnosticSuggestionsCard } from "@/components/dashboard/student/diagnostic-suggestions";

/**
 * Student Dashboard Page (Optimized)
 *
 * Simplified dashboard focusing on actionable insights:
 * 1. TodoCard - Pending assignments, near-complete achievements, practice recommendations
 * 2. DiagnosticSuggestionsCard - Personalized learning suggestions based on diagnostic results
 * 3. OverviewTab - Comprehensive statistics and learning modules overview
 *
 * Removed redundant elements:
 * - Top-level StatCards (duplicated in OverviewTab)
 * - Progress Navigation buttons (available in sidebar)
 * - Quick Actions (all available in sidebar navigation)
 *
 * Multi-tenant: All data automatically scoped to user's organization
 *
 * @see src/components/dashboard/student/todo-card.tsx
 * @see src/components/dashboard/student/diagnostic-suggestions.tsx
 * @see src/components/dashboard/overview-tab-new.tsx
 */
export default function StudentDashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6 container-responsive">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Your personalized learning hub
          </p>
        </div>

        {/* Priority Section: Todo Items & Diagnostic Suggestions */}
        <div className="grid gap-6 md:grid-cols-2">
          <TodoCard />
          <DiagnosticSuggestionsCard />
        </div>

        {/* Main Overview Section */}
        <OverviewTab />
      </div>
    </ProtectedRoute>
  );
}