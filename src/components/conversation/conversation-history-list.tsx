"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MessageSquare, ChevronRight, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryFiltersComponent } from "@/components/history/history-filters";
import { EmptyState } from "@/components/history/empty-state";
import { getConversationSessionsWithFilters } from "@/actions/sessions";
import type { HistoryFilters } from "@/types";

interface ConversationSession {
  id: bigint;
  sessionId: string;
  scenarioId: string;
  scenarioTitle: string;
  startedAt: Date;
  endedAt: Date | null;
  isCompleted: boolean;
  targetTurns: number;
  completedTurns: number;
  totalPointsEarned: number;
  averagePronunciationScore: string | null;
  averageFluencyScore: string | null;
}

export function ConversationHistoryList() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [filters, setFilters] = useState<HistoryFilters>({ dateRange: "all" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [filters]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await getConversationSessionsWithFilters(
        {
          scenarioId: filters.scenarioId,
          dateRange: filters.dateRange,
        },
        50
      );
      setSessions(data as ConversationSession[]);
    } catch (error) {
      console.error("[ConversationHistory] Failed to load sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (sessionId: bigint) => {
    router.push(`/conversation/session/${sessionId}`);
  };

  const formatDuration = (startedAt: Date, endedAt: Date | null) => {
    if (!endedAt) return "In progress";
    const duration = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}m ${secs}s`;
  };

  const getCompletionPercentage = (completed: number, target: number) => {
    return target > 0 ? Math.round((completed / target) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HistoryFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          showSkillFilter={false}
          showLevelFilter={false}
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

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <HistoryFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          showSkillFilter={false}
          showLevelFilter={false}
          showDateRangeFilter
        />
        <EmptyState
          icon={MessageSquare}
          title="No Conversation Sessions Yet"
          description="Start a conversation practice session to see your history here. Your conversations will be tracked automatically."
          actionLabel="Start Conversation"
          onAction={() => router.push("/conversation")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HistoryFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        showSkillFilter={false}
        showLevelFilter={false}
        showDateRangeFilter
      />

      <div className="space-y-4">
        {sessions.map((session) => {
          const completionPercentage = getCompletionPercentage(
            session.completedTurns,
            session.targetTurns
          );
          const avgPronunciation = session.averagePronunciationScore
            ? parseFloat(session.averagePronunciationScore)
            : null;
          const avgFluency = session.averageFluencyScore
            ? parseFloat(session.averageFluencyScore)
            : null;

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
                      <MessageSquare className="h-5 w-5" />
                      {session.scenarioTitle}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(session.startedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(session.startedAt, session.endedAt)}
                      </span>
                    </CardDescription>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{session.completedTurns}/{session.targetTurns}</p>
                    <p className="text-xs text-muted-foreground">Turns</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{completionPercentage}%</p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                      <Award className="h-5 w-5" />
                      {session.totalPointsEarned}
                    </p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>

                {(avgPronunciation !== null || avgFluency !== null) && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    {avgPronunciation !== null && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Pronunciation</p>
                        <Badge variant="outline">{avgPronunciation.toFixed(1)}/10</Badge>
                      </div>
                    )}
                    {avgFluency !== null && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Fluency</p>
                        <Badge variant="outline">{avgFluency.toFixed(1)}/10</Badge>
                      </div>
                    )}
                  </div>
                )}

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
