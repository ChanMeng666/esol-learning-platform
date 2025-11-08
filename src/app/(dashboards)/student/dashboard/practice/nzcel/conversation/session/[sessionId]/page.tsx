"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Award, User, Bot, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { getConversationSessionWithTurns } from "@/actions/sessions";
import type { ConversationSessionWithDetails } from "@/types";

export default function ConversationSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  return (
    <ProtectedRoute>
      <ConversationSessionDetailPageContent params={params} />
    </ProtectedRoute>
  );
}

function ConversationSessionDetailPageContent({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [session, setSession] = useState<ConversationSessionWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, [unwrappedParams.sessionId]);

  const loadSession = async () => {
    setIsLoading(true);
    try {
      const sessionId = BigInt(unwrappedParams.sessionId);
      const data = await getConversationSessionWithTurns(sessionId);
      setSession(data as ConversationSessionWithDetails);
    } catch (error) {
      console.error("[ConversationSessionDetail] Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (startedAt: Date, endedAt: Date | null) => {
    if (!endedAt) return "In progress";
    const duration = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}m ${secs}s`;
  };

  const playAudio = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
      return;
    }
    setPlayingAudio(audioUrl);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => setPlayingAudio(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-1/3 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Card className="mt-8">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Session Not Found</h3>
              <p className="text-muted-foreground">
                This conversation session could not be found.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const avgPronunciation = session.averagePronunciationScore
    ? parseFloat(session.averagePronunciationScore)
    : null;
  const avgFluency = session.averageFluencyScore
    ? parseFloat(session.averageFluencyScore)
    : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {session.scenarioTitle}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(session.startedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(session.startedAt, session.endedAt)}
            </span>
            {session.isCompleted && (
              <Badge variant="outline">Completed</Badge>
            )}
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Turns Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{session.completedTurns}/{session.targetTurns}</p>
            </CardContent>
          </Card>
          {avgPronunciation !== null && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Avg. Pronunciation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{avgPronunciation.toFixed(1)}/10</p>
              </CardContent>
            </Card>
          )}
          {avgFluency !== null && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Avg. Fluency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">{avgFluency.toFixed(1)}/10</p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Points Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold flex items-center gap-1 text-yellow-600">
                <Award className="h-6 w-6" />
                {session.totalPointsEarned}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Conversation Turns */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Conversation</h2>
          {session.turns.map((turn) => {
            const isUser = turn.speaker === "user";
            const pronunciation = turn.pronunciationScore ? parseFloat(turn.pronunciationScore) : null;
            const fluency = turn.fluencyScore ? parseFloat(turn.fluencyScore) : null;
            const grammar = turn.grammarScore ? parseFloat(turn.grammarScore) : null;
            const vocabulary = turn.vocabularyScore ? parseFloat(turn.vocabularyScore) : null;

            return (
              <Card key={turn.id.toString()} className={isUser ? "border-primary/50" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {isUser ? (
                        <>
                          <User className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">You</CardTitle>
                        </>
                      ) : (
                        <>
                          <Bot className="h-5 w-5 text-muted-foreground" />
                          <CardTitle className="text-lg">AI Tutor</CardTitle>
                        </>
                      )}
                    </div>
                    <Badge variant="outline">Turn {turn.turnNumber}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Audio Playback */}
                  {turn.audioUrl && (
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playAudio(turn.audioUrl!)}
                      >
                        {playingAudio === turn.audioUrl ? (
                          <>
                            <Volume2 className="mr-2 h-4 w-4" />
                            Playing...
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Play Audio
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Transcription */}
                  {turn.transcription && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="text-sm font-semibold mb-2">
                        {isUser ? "Your Response" : "AI Response"}
                      </h4>
                      <p className="text-sm italic">&quot;{turn.transcription}&quot;</p>
                    </div>
                  )}

                  {/* Scores (for user turns) */}
                  {isUser && (pronunciation !== null || fluency !== null || grammar !== null || vocabulary !== null) && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-semibold mb-3">Scores</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {pronunciation !== null && (
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{pronunciation.toFixed(1)}</p>
                              <p className="text-xs text-muted-foreground">Pronunciation</p>
                            </div>
                          )}
                          {fluency !== null && (
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-600">{fluency.toFixed(1)}</p>
                              <p className="text-xs text-muted-foreground">Fluency</p>
                            </div>
                          )}
                          {grammar !== null && (
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{grammar.toFixed(1)}</p>
                              <p className="text-xs text-muted-foreground">Grammar</p>
                            </div>
                          )}
                          {vocabulary !== null && (
                            <div className="text-center">
                              <p className="text-2xl font-bold text-orange-600">{vocabulary.toFixed(1)}</p>
                              <p className="text-xs text-muted-foreground">Vocabulary</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* AI Feedback */}
                  {turn.aiFeedback && (
                    <>
                      <Separator />
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <h4 className="text-sm font-semibold mb-2 text-primary">AI Feedback</h4>
                        <p className="text-sm">{turn.aiFeedback}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
