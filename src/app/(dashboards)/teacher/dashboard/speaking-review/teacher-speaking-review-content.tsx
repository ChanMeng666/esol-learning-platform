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
  Users,
  Activity,
  Play,
  Volume2,
  User,
  ArrowLeft,
} from "lucide-react";
import {
  getClassStudentsSpeaking,
  getStudentSpeakingSessions,
  getStudentSpeakingSession,
} from "@/actions/teacher-speaking-access";
import { format } from "date-fns";
import { toast } from "sonner";

interface ClassData {
  id: bigint;
  name: string;
}

interface StudentData {
  studentId: string;
  stackAuthId: string;
  name: string | null;
  email: string;
  totalSessions: number;
  completedSessions: number;
  totalDuration: number;
  lastPractice: Date | null;
  classes: string[];
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

export function TeacherSpeakingReviewContent() {
  // State
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [studentSessions, setStudentSessions] = useState<SpeakingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<{
    session: SpeakingSession;
    messages: SessionMessage[];
    student: { id: string; name: string | null; email: string };
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    loadClassStudents();
  }, []);

  const loadClassStudents = async () => {
    try {
      setIsLoading(true);
      const data = await getClassStudentsSpeaking();
      setClasses(data.classes as any);
      setStudents(data.students as any);
    } catch (error) {
      console.error("Failed to load class students:", error);
      toast.error("Failed to load student data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSelect = async (student: StudentData) => {
    try {
      setSelectedStudent(student);
      setIsLoadingSessions(true);
      setSelectedSession(null);

      const sessions = await getStudentSpeakingSessions(student.stackAuthId);
      setStudentSessions(sessions as any);
    } catch (error) {
      console.error("Failed to load student sessions:", error);
      toast.error("Failed to load student speaking sessions");
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadSessionDetails = async (sessionId: string) => {
    try {
      setIsLoadingDetails(true);
      const data = await getStudentSpeakingSession(sessionId);
      setSelectedSession(data as any);

      // Debug log for teacher view
      console.log('[Teacher Review DEBUG] Session loaded:', {
        sessionId,
        studentName: data.student.name,
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
          <h1 className="text-3xl font-bold tracking-tight">Student Speaking Review</h1>
          <p className="text-muted-foreground">
            Monitor and review student AI speaking practice sessions
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          {students.length} Students
        </Badge>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Student List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Students</CardTitle>
              <CardDescription>
                Select a student to view their speaking sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {students.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No students found in your classes
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {students.map((student) => (
                      <button
                        key={student.studentId}
                        onClick={() => handleStudentSelect(student)}
                        className={`w-full text-left p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                          selectedStudent?.studentId === student.studentId
                            ? "bg-muted border-primary"
                            : ""
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium text-sm">
                              {student.name || "Unnamed Student"}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {student.totalSessions} sessions
                            {student.totalDuration > 0 && (
                              <span> • {formatDuration(student.totalDuration)}</span>
                            )}
                          </div>
                          {student.lastPractice && (
                            <div className="text-xs text-muted-foreground">
                              Last: {format(new Date(student.lastPractice), "MMM d")}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Session List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sessions</CardTitle>
              <CardDescription>
                {selectedStudent
                  ? `${selectedStudent.name}'s practice sessions`
                  : "Select a student to view sessions"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {!selectedStudent ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    Select a student to view their sessions
                  </div>
                ) : isLoadingSessions ? (
                  <div className="p-4 space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : studentSessions.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No speaking sessions found for this student
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {studentSessions.map((session) => (
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
                  : "Select a session to view the conversation"}
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
                              {message.speaker === "user" ? selectedStudent?.name || "Student" : "AI Coach"}
                            </span>
                            <span className="text-xs opacity-70">
                              {format(new Date(message.timestamp), "h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{message.content}</p>

                          {/* Audio player if available - CRITICAL FOR STUDENT AUDIO */}
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
                    Select a session to review the conversation and listen to student recordings
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