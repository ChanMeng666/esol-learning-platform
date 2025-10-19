"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Award, ChevronRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryFiltersComponent } from "@/components/history/history-filters";
import { EmptyState } from "@/components/history/empty-state";
import { getPracticeSessionsWithFilters } from "@/actions/sessions";
import type { HistoryFilters } from "@/types";

interface PracticeSession {
  id: bigint;
  sessionId: string;
  skill: string;
  level: string;
  startedAt: Date;
  endedAt: Date | null;
  duration: number | null;
  questionsAttempted: number;
  questionsCorrect: number;
  totalPointsEarned: number;
  isCompleted: boolean;
}

export function PracticeHistoryList() {
  const router = useRouter();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [filters, setFilters] = useState<HistoryFilters>({ dateRange: "all" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [filters]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await getPracticeSessionsWithFilters(
        {
          skill: filters.skill,
          level: filters.level,
          dateRange: filters.dateRange,
        },
        50
      );
      console.log("[PracticeHistory] Received data:", data);
      console.log("[PracticeHistory] Data length:", data.length);
      console.log("[PracticeHistory] Data type:", typeof data);
      setSessions(data as PracticeSession[]);
    } catch (error) {
      console.error("[PracticeHistory] Failed to load sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (sessionId: bigint) => {
    router.push(`/practice/session/${sessionId}`);
  };

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case "listening":
        return "🎧";
      case "speaking":
        return "🎤";
      case "reading":
        return "📖";
      case "writing":
        return "✍️";
      default:
        return "📝";
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HistoryFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          showSkillFilter
          showLevelFilter
          showDateRangeFilter
        />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  console.log("[PracticeHistory] Render - sessions.length:", sessions.length);
  console.log("[PracticeHistory] Render - isLoading:", isLoading);

  if (sessions.length === 0) {
    console.log("[PracticeHistory] Showing empty state");
    return (
      <div className="space-y-6">
        <HistoryFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          showSkillFilter
          showLevelFilter
          showDateRangeFilter
        />
        <EmptyState
          icon={BookOpen}
          title="No Practice Sessions Yet"
          description="Start practicing to see your session history here. Your progress will be tracked automatically."
          actionLabel="Start Practicing"
          onAction={() => router.push("/practice")}
        />
      </div>
    );
  }

  console.log("[PracticeHistory] Showing sessions list");

  return (
    <div className="space-y-6">
      <HistoryFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        showSkillFilter
        showLevelFilter
        showDateRangeFilter
      />

      <div className="space-y-4">
        {sessions.map((session) => {
          const accuracy = session.questionsAttempted > 0
            ? Math.round((session.questionsCorrect / session.questionsAttempted) * 100)
            : 0;

          return (
            <Card
              key={session.id.toString()}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleViewDetails(session.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{getSkillIcon(session.skill)}</span>
                      <span className="capitalize">{session.skill}</span>
                      <Badge variant="secondary">{session.level}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(session.startedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(session.duration)}
                      </span>
                    </CardDescription>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{session.questionsAttempted}</p>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{accuracy}%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                      <Award className="h-5 w-5" />
                      {session.totalPointsEarned}
                    </p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>

                {session.isCompleted && (
                  <Badge variant="outline" className="mt-4 w-full justify-center">
                    Completed
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
