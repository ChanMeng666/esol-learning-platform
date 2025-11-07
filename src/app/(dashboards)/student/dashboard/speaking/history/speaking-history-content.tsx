"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Calendar,
  Clock,
  MessageSquare,
  ChevronRight,
  Download,
  Trash2,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import { getUserSpeakingSessions, getSpeakingSession, deleteSpeakingSession } from "@/actions/speaking-sessions";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";

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

export function SpeakingHistoryContent() {
  const [sessions, setSessions] = useState<SpeakingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<{
    session: SpeakingSession;
    messages: SessionMessage[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isDeletingSession, setIsDeletingSession] = useState<string | null>(null);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await getUserSpeakingSessions(20, 0);
      setSessions(data as any);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      toast.error("Failed to load speaking history");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionDetails = async (sessionId: string) => {
    try {
      setIsLoadingMessages(true);
      const data = await getSpeakingSession(sessionId);
      setSelectedSession(data as any);
    } catch (error) {
      console.error("Failed to load session details:", error);
      toast.error("Failed to load session details");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeletingSession(sessionId);
      await deleteSpeakingSession(sessionId);

      // Remove from local state
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));

      // Clear selected session if it was deleted
      if (selectedSession?.session.sessionId === sessionId) {
        setSelectedSession(null);
      }

      toast.success("Session deleted successfully");
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast.error("Failed to delete session");
    } finally {
      setIsDeletingSession(null);
    }
  };

  const exportTranscript = (session: SpeakingSession, messages: SessionMessage[]) => {
    const transcript = messages
      .map(msg => `${msg.speaker === "user" ? "You" : "AI Coach"}: ${msg.content}`)
      .join("\n\n");

    const metadata = `Speaking Practice Session
Date: ${format(new Date(session.startedAt), "PPP")}
Duration: ${session.duration ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : "N/A"}
CEFR Level: ${session.cefrLevel}
Topic: ${session.topic || "General Conversation"}
Total Turns: ${session.totalTurns}

---

`;

    const fullContent = metadata + transcript;
    const blob = new Blob([fullContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `speaking-session-${format(new Date(session.startedAt), "yyyy-MM-dd-HHmm")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Speaking History</h1>
          <p className="text-muted-foreground">
            Review your past AI Speaking Coach conversations
          </p>
        </div>
        <Link href="/student/dashboard/speaking">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Practice
          </Button>
        </Link>
      </div>

      {/* Sessions List */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Session List Column */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Past Sessions</CardTitle>
              <CardDescription>
                Select a session to view the conversation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <DotLottieReact
                      src="/animations/speaking.lottie"
                      loop
                      autoplay
                      style={{ width: 150, height: 150 }}
                    />
                    <p className="text-sm text-muted-foreground mt-4">
                      No speaking sessions yet. Start practicing to see your history here!
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.sessionId}
                        onClick={() => {
                          if (isDeletingSession !== session.sessionId) {
                            loadSessionDetails(session.sessionId);
                          }
                        }}
                        className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                          selectedSession?.session.sessionId === session.sessionId
                            ? "bg-muted border-primary"
                            : ""
                        } ${isDeletingSession === session.sessionId ? "opacity-50 cursor-not-allowed" : ""}`}
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
                                {Math.floor(session.duration / 60)}m
                              </span>
                            )}
                          </div>

                          {/* Delete button */}
                          {isDeletingSession === session.sessionId ? (
                            <div className="flex justify-end">
                              <span className="text-xs text-muted-foreground">Deleting...</span>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session.sessionId);
                                }}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Conversation Detail Column */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              {selectedSession ? (
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {selectedSession.session.topic || "General Conversation"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(selectedSession.session.startedAt), "PPP")}
                        </span>
                        {selectedSession.session.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {Math.floor(selectedSession.session.duration / 60)}m {selectedSession.session.duration % 60}s
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        exportTranscript(selectedSession.session, selectedSession.messages)
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <CardTitle className="text-lg">Select a Session</CardTitle>
                  <CardDescription>
                    Choose a session from the list to view the conversation
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent>
              {isLoadingMessages ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : selectedSession ? (
                <ScrollArea className="h-[500px] pr-4">
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
                              {message.speaker === "user" ? "You" : "AI Coach"}
                            </span>
                            <span className="text-xs opacity-70">
                              {format(new Date(message.timestamp), "h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{message.content}</p>

                          {/* Audio player if available */}
                          {message.audioUrl && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-3">
                                <Volume2 className="h-4 w-4 text-muted-foreground" />
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

                          {/* Show assessment if available */}
                          {message.assessment && (
                            <div className="mt-3 pt-3 border-t space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {message.assessment.pronunciationScore !== null && (
                                  <div>
                                    <span className="text-muted-foreground">Pronunciation:</span>{" "}
                                    <Badge variant="outline" className="ml-1">
                                      {message.assessment.pronunciationScore}/100
                                    </Badge>
                                  </div>
                                )}
                                {message.assessment.fluencyScore !== null && (
                                  <div>
                                    <span className="text-muted-foreground">Fluency:</span>{" "}
                                    <Badge variant="outline" className="ml-1">
                                      {message.assessment.fluencyScore}/100
                                    </Badge>
                                  </div>
                                )}
                                {message.assessment.grammarScore !== null && (
                                  <div>
                                    <span className="text-muted-foreground">Grammar:</span>{" "}
                                    <Badge variant="outline" className="ml-1">
                                      {message.assessment.grammarScore}/100
                                    </Badge>
                                  </div>
                                )}
                                {message.assessment.vocabularyScore !== null && (
                                  <div>
                                    <span className="text-muted-foreground">Vocabulary:</span>{" "}
                                    <Badge variant="outline" className="ml-1">
                                      {message.assessment.vocabularyScore}/100
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              {message.assessment.feedback && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {message.assessment.feedback}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center">
                  <DotLottieReact
                    src="/animations/dashboard.lottie"
                    loop
                    autoplay
                    style={{ width: 200, height: 200 }}
                  />
                  <p className="text-muted-foreground mt-4">
                    Select a session to view the conversation details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}