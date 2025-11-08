"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Award, CheckCircle, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { getPracticeSessionWithAnswers } from "@/actions/sessions";
import { getUserRecordings } from "@/actions/recordings";
import { ALL_QUESTIONS } from "@/data/questions";

interface SessionAnswer {
  id: bigint;
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number | null;
  audioRecordingId: bigint | null;
  answeredAt: Date;
}

interface SessionDetails {
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
  answers: SessionAnswer[];
}

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  return (
    <ProtectedRoute>
      <SessionDetailPageContent params={params} />
    </ProtectedRoute>
  );
}

function SessionDetailPageContent({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [session, setSession] = useState<SessionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [unwrappedParams.sessionId]);

  const loadSession = async () => {
    setIsLoading(true);
    try {
      const sessionId = BigInt(unwrappedParams.sessionId);
      const data = await getPracticeSessionWithAnswers(sessionId);
      setSession(data as SessionDetails);
    } catch (error) {
      console.error("[SessionDetail] Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getQuestionDetails = (questionId: string) => {
    return ALL_QUESTIONS.find((q) => q.id === questionId);
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
                This practice session could not be found.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const accuracy = session.questionsAttempted > 0
    ? Math.round((session.questionsCorrect / session.questionsAttempted) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 capitalize">
            {session.skill} Practice Session
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Badge variant="secondary">{session.level}</Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(session.startedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(session.duration)}
            </span>
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{session.questionsAttempted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Correct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{session.questionsCorrect}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{accuracy}%</p>
            </CardContent>
          </Card>
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

        {/* Answers List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Question Details</h2>
          {session.answers.map((answer, index) => {
            const question = getQuestionDetails(answer.questionId);

            return (
              <Card key={answer.id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-muted-foreground">Q{index + 1}</span>
                        {answer.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </CardTitle>
                      {question && (
                        <CardDescription className="mt-2">
                          <FileText className="h-4 w-4 inline mr-1" />
                          {question.question}
                        </CardDescription>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                        {answer.pointsEarned} pts
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Your Answer</h4>
                      <p className="text-sm p-3 bg-muted rounded-lg">{answer.userAnswer}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Correct Answer</h4>
                      <p className="text-sm p-3 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg">
                        {answer.correctAnswer}
                      </p>
                    </div>
                  </div>

                  {question?.explanation && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Explanation</h4>
                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                      </div>
                    </>
                  )}

                  {answer.timeSpent && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Time spent: {answer.timeSpent}s
                    </div>
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
