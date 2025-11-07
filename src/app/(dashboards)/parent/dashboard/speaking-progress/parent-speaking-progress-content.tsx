"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MessageSquare,
  TrendingUp,
  Activity,
  Play,
  Volume2,
  User,
  ArrowLeft,
  Award,
  Target,
} from "lucide-react";
import {
  getChildrenSpeakingStats,
  getChildSpeakingSessions,
  getChildSpeakingSession,
  getChildSpeakingProgress,
} from "@/actions/parent-speaking-access";
import { format } from "date-fns";
import { toast } from "sonner";

interface ChildData {
  childId: string;
  stackAuthId: string;
  name: string | null;
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

interface SpeakingSession {
  id: bigint;
  sessionId: string;
  cefrLevel: string;
  topic: string | null;
  startedAt: string | Date;
  endedAt: string | Date | null;
  duration: number | null;
  totalTurns: number;
  totalUserWords: number;
  totalAiWords: number;
  isCompleted: boolean;
  messageCount?: number;
}

interface SessionMessage {
  id: bigint;
  messageId: string;
  speaker: string;
  content: string;
  audioUrl: string | null;
  timestamp: string | Date;
  assessment: any | null;
}

interface ProgressData {
  date: string;
  count: number;
  totalDuration: number;
  totalWords: number;
}

export function ParentSpeakingProgressContent() {
  // State
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);
  const [childSessions, setChildSessions] = useState<SpeakingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<{
    session: SpeakingSession;
    messages: SessionMessage[];
    child: { id: string; name: string | null; email: string };
  } | null>(null);
  const [progressData, setProgressData] = useState<{
    progressData: ProgressData[];
    metrics: {
      totalSessions: number;
      totalDuration: number;
      totalWords: number;
      averageSessionsPerWeek: number;
      currentLevel: string;
    };
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    loadChildrenData();
  }, []);

  const loadChildrenData = async () => {
    try {
      setIsLoading(true);
      const data = await getChildrenSpeakingStats();
      setChildren(data.children as any);

      // Auto-select first child if only one
      if (data.children.length === 1) {
        handleChildSelect(data.children[0] as any);
      }
    } catch (error) {
      console.error("Failed to load children data:", error);
      toast.error("Failed to load children data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildSelect = async (child: ChildData) => {
    try {
      setSelectedChild(child);
      setIsLoadingSessions(true);
      setIsLoadingProgress(true);
      setSelectedSession(null);

      // Load sessions and progress in parallel
      const [sessions, progress] = await Promise.all([
        getChildSpeakingSessions(child.stackAuthId),
        getChildSpeakingProgress(child.stackAuthId, 30),
      ]);

      setChildSessions(sessions as any);
      setProgressData(progress as any);
    } catch (error) {
      console.error("Failed to load child data:", error);
      toast.error("Failed to load child speaking data");
    } finally {
      setIsLoadingSessions(false);
      setIsLoadingProgress(false);
    }
  };

  const loadSessionDetails = async (sessionId: string) => {
    try {
      setIsLoadingDetails(true);
      const data = await getChildSpeakingSession(sessionId);
      setSelectedSession(data as any);

      // Debug log for parent view
      console.log('[Parent Progress DEBUG] Session loaded:', {
        sessionId,
        childName: data.child.name,
        messageCount: data.messages.length,
        messagesWithAudio: data.messages.filter((m: any) => m.audioUrl).length,
      });
    } catch (error) {
      console.error("Failed to load session details:", error);
      toast.error("Failed to load session details");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Child Speaking Progress</h1>
          <p className="text-muted-foreground">
            Monitor your child's AI speaking practice and pronunciation progress
          </p>
        </div>

        {/* Child Selector if multiple children */}
        {children.length > 1 && (
          <Select
            value={selectedChild?.childId}
            onValueChange={(value) => {
              const child = children.find((c) => c.childId === value);
              if (child) handleChildSelect(child);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.childId} value={child.childId}>
                  {child.name || "Unnamed Child"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* No children message */}
      {children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <DotLottieReact
              src="/animations/dashboard.lottie"
              loop
              autoplay
              style={{ width: 200, height: 200 }}
            />
            <p className="text-muted-foreground mt-4">
              No children linked to your account
            </p>
          </CardContent>
        </Card>
      ) : selectedChild ? (
        <>
          {/* Progress Overview Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedChild.totalSessions}</div>
                <p className="text-xs text-muted-foreground">
                  {selectedChild.completedSessions} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Practice Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(selectedChild.totalDuration / 60)}m
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg {formatDuration(selectedChild.averageSessionDuration)} per session
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedChild.recentSessionCount}</div>
                <p className="text-xs text-muted-foreground">Sessions in last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {progressData?.metrics.currentLevel || "B1"}
                </div>
                <p className="text-xs text-muted-foreground">CEFR Level</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Session List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Sessions</CardTitle>
                  <CardDescription>
                    {selectedChild.name}'s practice history
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {isLoadingSessions ? (
                      <div className="p-4 space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : childSessions.length === 0 ? (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        No speaking sessions yet
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        {childSessions.map((session) => (
                          <div
                            key={session.sessionId}
                            onClick={() => loadSessionDetails(session.sessionId)}
                            className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                              selectedSession?.session.sessionId === session.sessionId
                                ? "bg-muted border-primary"
                                : ""
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {session.cefrLevel}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(session.startedAt), "MMM d, h:mm a")}
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium">
                                    {session.topic || "General Conversation"}
                                  </p>
                                </div>
                                {session.isCompleted && (
                                  <Badge className="text-xs" variant="secondary">
                                    Complete
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {session.messageCount || session.totalTurns * 2} messages
                                </span>
                                {session.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDuration(session.duration)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Conversation Detail */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Conversation Detail</CardTitle>
                  <CardDescription>
                    {selectedSession
                      ? `${selectedSession.session.topic || "General Conversation"} - ${format(
                          new Date(selectedSession.session.startedAt),
                          "PPP"
                        )}`
                      : "Select a session to review the conversation"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingDetails ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : selectedSession ? (
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {selectedSession.messages.map((message, idx) => (
                          <div
                            key={idx}
                            className={`flex ${
                              message.speaker === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-4 ${
                                message.speaker === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium">
                                  {message.speaker === "user"
                                    ? selectedChild.name || "Child"
                                    : "AI Coach"}
                                </span>
                                <span className="text-xs opacity-70">
                                  {format(new Date(message.timestamp), "h:mm a")}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">{message.content}</p>

                              {/* Audio player if available - CRITICAL FOR CHILD AUDIO */}
                              {message.audioUrl && (
                                <div className="mt-3 pt-3 border-t">
                                  <div className="flex items-center gap-3">
                                    <Volume2 className="h-4 w-4" />
                                    <audio
                                      controls
                                      className="max-w-full h-8"
                                      preload="metadata"
                                    >
                                      <source src={message.audioUrl} type="audio/webm" />
                                      <source src={message.audioUrl} type="audio/mp3" />
                                      Your browser does not support the audio element.
                                    </audio>
                                  </div>
                                </div>
                              )}

                              {/* Show basic assessment if available */}
                              {message.assessment && message.speaker === "user" && (
                                <div className="mt-3 pt-3 border-t">
                                  {message.assessment.pronunciationScore !== null && (
                                    <div className="text-xs">
                                      <span className="text-muted-foreground">Pronunciation:</span>{" "}
                                      <Badge variant="outline" className="ml-1">
                                        {message.assessment.pronunciationScore}/100
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <DotLottieReact
                        src="/animations/speaking.lottie"
                        loop
                        autoplay
                        style={{ width: 200, height: 200 }}
                      />
                      <p className="text-muted-foreground mt-4">
                        Select a session to listen to your child's pronunciation practice
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="text-muted-foreground">Select a child to view their progress</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}