"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Users, Clock, ChevronRight, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { getChildrenSpeakingStats } from "@/actions/parent-speaking-access";

interface ChildData {
  childId: string;
  stackAuthId: string;
  name: string;
  email: string;
  relationshipType: string;
  isPrimary: boolean;
  totalSessions: number;
  completedSessions: number;
  totalDuration: number;
  lastPractice: Date | null;
  recentSessionCount: number;
  averageSessionDuration: number;
  className: string | null;
}

export default function ParentChildrenPage() {
  return (
    <ProtectedRoute>
      <ChildrenPageContent />
    </ProtectedRoute>
  );
}

function ChildrenPageContent() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    try {
      setIsLoading(true);
      const data = await getChildrenSpeakingStats();
      setChildren(data.children as ChildData[]);
    } catch (error) {
      console.error("Failed to load children:", error);
      toast.error("Failed to load children data");
    } finally {
      setIsLoading(false);
    }
  }

  function formatLastPractice(lastPractice: Date | null): string {
    if (!lastPractice) return "No practice yet";

    const now = new Date();
    const diffMs = now.getTime() - lastPractice.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return "Just now";
  }

  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  if (isLoading) {
    return <LoadingState message="Loading children information..." fullScreen />;
  }

  if (children.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">My Children</h1>
        </div>

        <EmptyState
          title="No Children Found"
          description="No children are linked to your account. Please contact your school administrator to link your children's accounts."
          icon={<Users className="w-16 h-16" />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Children</h1>
        <p className="text-muted-foreground">
          {children.length} {children.length === 1 ? 'child' : 'children'} enrolled
        </p>
      </div>

      {/* Children Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children.map((child) => (
          <Card key={child.childId} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              {/* Child Header */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {child.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{child.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{child.email}</p>
                </div>
              </div>

              {/* Class Info */}
              {child.className && (
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{child.className}</span>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Speaking Sessions</span>
                  <Badge variant="secondary">{child.completedSessions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Practice Time</span>
                  <span className="text-sm font-medium">
                    {formatDuration(child.totalDuration)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last Practice
                  </span>
                  <span className="text-sm font-medium">
                    {formatLastPractice(child.lastPractice)}
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/parent/dashboard/speaking-progress?child=${child.stackAuthId}`)}
              >
                View Progress
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
