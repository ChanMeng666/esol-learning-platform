"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LayoutDashboard, GraduationCap, Globe, Mic } from "lucide-react";
import { OverviewTab } from "@/components/dashboard/overview-tab";
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
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-primary">
                Your Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track your progress across all learning modules
              </p>
            </div>
            {/* Dashboard Animation */}
            <div className="flex justify-center md:justify-end">
              <DotLottieReact
                src="/animations/dashboard.lottie"
                autoplay
                loop
                style={{ width: 150, height: 150 }}
              />
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-auto">
            <TabsTrigger value="overview" className="gap-2 py-3">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger value="nzcel" className="gap-2 py-3">
              <GraduationCap className="w-4 h-4" />
              <span>NZCEL</span>
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2 py-3">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">General Practice</span>
              <span className="sm:hidden">CEFR</span>
            </TabsTrigger>
            <TabsTrigger value="speaking" className="gap-2 py-3">
              <Mic className="w-4 h-4" />
              <span>Speaking</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="nzcel" className="mt-6">
            <NZCELTab />
          </TabsContent>

          <TabsContent value="general" className="mt-6">
            <GeneralPracticeTab />
          </TabsContent>

          <TabsContent value="speaking" className="mt-6">
            <SpeakingTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
