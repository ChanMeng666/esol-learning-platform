"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Users, Mic, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getParentDashboardStats } from "@/actions/parent-dashboard";

export default function ParentDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalSpeakingSessions: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const data = await getParentDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading your dashboard..." fullScreen />;
  }

  // Show empty state if no children linked
  if (stats.totalChildren === 0) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
        </div>

        <EmptyState
          title="No Children Linked"
          description="You don't have any children linked to your account yet. Please contact your school administrator to link your children's accounts."
          icon={<Users className="w-16 h-16" />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
      </div>

      {/* Core Stats - Only 2 cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              My Children
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalChildren}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Speaking Practice
            </CardTitle>
            <Mic className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSpeakingSessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total sessions completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/parent/children")}
            className="flex-1"
          >
            View Children
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={() => router.push("/parent/dashboard/speaking-progress")}
            variant="outline"
            className="flex-1"
          >
            View Speaking Progress
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
