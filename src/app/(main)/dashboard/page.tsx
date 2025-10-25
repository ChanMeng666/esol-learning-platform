"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LayoutDashboard, GraduationCap, Globe, Mic } from "lucide-react";
import { OverviewTabNew as OverviewTab } from "@/components/dashboard/overview-tab-new";
import { NZCELTab } from "@/components/dashboard/nzcel-tab";
import { GeneralPracticeTab } from "@/components/dashboard/general-practice-tab";
import { SpeakingTab } from "@/components/dashboard/speaking-tab";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}

function DashboardPageContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress across all learning modules
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">All</span>
          </TabsTrigger>
          <TabsTrigger value="nzcel" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>NZCEL</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
            <span className="sm:hidden">CEFR</span>
          </TabsTrigger>
          <TabsTrigger value="speaking" className="gap-2">
            <Mic className="h-4 w-4" />
            <span>Speaking</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="nzcel" className="mt-6 space-y-4">
          <NZCELTab />
        </TabsContent>

        <TabsContent value="general" className="mt-6 space-y-4">
          <GeneralPracticeTab />
        </TabsContent>

        <TabsContent value="speaking" className="mt-6 space-y-4">
          <SpeakingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
