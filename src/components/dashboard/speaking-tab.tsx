"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Clock, MessageCircle, CheckCircle, PlayCircle, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSpeakingStats } from "@/actions/module-stats";

interface SpeakingStats {
  totalSessions: number;
  completedSessions: number;
  totalTurns: number;
  averageDuration: number;
  recentSessions: Array<{
    conversationId: string;
    scenario: string | null;
    level: string;
    targetTurns: number;
    isCompleted: boolean;
    durationSeconds: number | null;
    createdAt: Date;
  }>;
}

export function SpeakingTab() {
  const router = useRouter();
  const [stats, setStats] = useState<SpeakingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getSpeakingStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load speaking stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Calculate completion rate
  const completionRate = stats && stats.totalSessions > 0
    ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading speaking statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No speaking data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-2 justify-end">
        <Button onClick={() => router.push("/speaking")} variant="default">
          <Mic className="mr-2 h-4 w-4" />
          Start Speaking Practice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardContent className="p-6">
            <Mic className="w-6 h-6 text-blue-500 mb-3" />
            <p className="text-2xl font-bold mb-1">{stats.totalSessions}</p>
            <p className="text-sm text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CheckCircle className="w-6 h-6 text-green-500 mb-3" />
            <p className="text-2xl font-bold mb-1">{stats.completedSessions}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <MessageCircle className="w-6 h-6 text-purple-500 mb-3" />
            <p className="text-2xl font-bold mb-1">{stats.totalTurns}</p>
            <p className="text-sm text-muted-foreground">Total Turns</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Clock className="w-6 h-6 text-orange-500 mb-3" />
            <p className="text-2xl font-bold mb-1">
              {stats.averageDuration > 0 ? formatTime(stats.averageDuration) : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">Avg Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Completion Rate
            </CardTitle>
            <CardDescription>
              Percentage of completed speaking sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-primary mb-2">
                {completionRate}%
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.completedSessions} of {stats.totalSessions} sessions completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Conversation Activity
            </CardTitle>
            <CardDescription>
              Your speaking practice insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Conversations</span>
                <Badge variant="secondary">{stats.totalTurns} turns</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average per Session</span>
                <Badge variant="outline">
                  {stats.totalSessions > 0
                    ? Math.round(stats.totalTurns / stats.totalSessions)
                    : 0} turns
                </Badge>
              </div>
              {stats.averageDuration > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Practice Time</span>
                  <Badge variant="outline">
                    {formatTime(stats.averageDuration * stats.completedSessions)}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Recent Sessions
          </CardTitle>
          <CardDescription>
            Your latest speaking practice sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentSessions && stats.recentSessions.length > 0 ? (
            <div className="space-y-4">
              {stats.recentSessions.map((session) => (
                <Card key={session.conversationId} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">
                            {session.scenario || "Conversation Practice"}
                          </h4>
                          {session.isCompleted ? (
                            <Badge variant="default" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              In Progress
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-xs">{session.level}</Badge>
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {session.targetTurns} turns
                          </span>
                          {session.durationSeconds && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(session.durationSeconds)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No speaking sessions yet</p>
              <Button onClick={() => router.push("/speaking")}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Your First Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips and Encouragement */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle>Speaking Practice Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full mt-1">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Practice Regularly</h4>
                <p className="text-sm text-muted-foreground">
                  Consistent daily practice improves fluency faster than occasional long sessions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full mt-1">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Don&apos;t Fear Mistakes</h4>
                <p className="text-sm text-muted-foreground">
                  Making mistakes is part of learning - our AI coach provides supportive feedback
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full mt-1">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Complete Full Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  Completing the target number of turns helps build conversation stamina
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
