"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Headphones, Mic, BookOpen, PenTool, History, FileAudio } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProgress } from "@/lib/store/user-progress";
import { NZCEL_LEVELS } from "@/data/nzcel-levels";
import { ALL_QUESTIONS } from "@/data/questions";
import { QuestionCard } from "@/components/practice/question-card";
import { ListeningQuestionCard } from "@/components/practice/listening-question-card";
import { SpeakingQuestionCard } from "@/components/practice/speaking-question-card";
import { EssayQuestionCard } from "@/components/practice/essay-question-card";
import { PracticeFilters, type PracticeFilters as Filters } from "@/components/practice/practice-filters";
import { SessionSummary, type SessionStats } from "@/components/practice/session-summary";
import { PracticeHistoryList } from "@/components/practice/practice-history-list";
import { RecordingHistoryList } from "@/components/practice/recording-history-list";
import { QuestionAudioList } from "@/components/practice/question-audio-list";
import { DiagnosticPanel } from "@/components/diagnostics/diagnostic-panel";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  createPracticeSession,
  saveSessionAnswer,
  completePracticeSession,
} from "@/actions/sessions";
import type { Question, SkillType } from "@/types";

export default function PracticePage() {
  return (
    <ProtectedRoute>
      <PracticePageContent />
    </ProtectedRoute>
  );
}

function PracticePageContent() {
  const router = useRouter();
  const { currentLevel, skillProgress, submitAnswer } = useUserProgress();
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    questionsAttempted: 0,
    questionsCorrect: 0,
    totalPoints: 0,
    pointsEarned: 0,
    timeSpent: 0,
    skillBreakdown: [],
  });
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  // Database session tracking
  const [dbSessionId, setDbSessionId] = useState<bigint | null>(null);
  const [dbSessionUUID, setDbSessionUUID] = useState<string>("");

  const currentLevelInfo = NZCEL_LEVELS.find((l) => l.id === currentLevel);

  // Filter available questions based on filters
  const getFilteredQuestions = (skillOverride?: SkillType | null) => {
    const targetSkill = skillOverride !== undefined ? skillOverride : selectedSkill;
    return ALL_QUESTIONS.filter((q) => {
      if (targetSkill && q.skill !== targetSkill) return false;
      if (filters.questionType && q.type !== filters.questionType) return false;
      if (filters.level && q.level !== filters.level) return false;
      return true;
    });
  };

  const getFilteredRandomQuestion = (skillOverride?: SkillType | null) => {
    const filtered = getFilteredQuestions(skillOverride);
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const loadNewQuestion = (skill?: SkillType) => {
    const targetSkill = skill || selectedSkill;
    if (!targetSkill) return;

    // Use filtered question selection, pass targetSkill to ensure correct filtering
    const question = getFilteredRandomQuestion(targetSkill);
    setCurrentQuestion(question || null);
    if (question) {
      setQuestionCount(prev => prev + 1);
    }
  };

  const handleAnswerSubmit = async (questionId: string, answer: string, isCorrect: boolean) => {
    const currentQ = currentQuestion;

    submitAnswer({
      questionId,
      userAnswer: answer,
      timeSpent: 0,
      isCorrect,
    });

    // Save answer to database session
    if (dbSessionId) {
      try {
        await saveSessionAnswer(
          dbSessionId,
          questionId,
          answer,
          currentQ?.correctAnswer?.toString() || "",
          isCorrect,
          isCorrect ? (currentQ?.points || 10) : 0
        );
        console.log("[Practice] Answer saved to session");
      } catch (error) {
        console.error("[Practice] Failed to save answer:", error);
      }
    }

    // Update session stats
    setSessionStats((prev) => {
      const pointsEarned = isCorrect ? (currentQ?.points || 10) : 0;
      const newSkillBreakdown = [...prev.skillBreakdown];
      const skillIndex = newSkillBreakdown.findIndex((s) => s.skill === selectedSkill);

      if (skillIndex >= 0) {
        newSkillBreakdown[skillIndex] = {
          ...newSkillBreakdown[skillIndex],
          attempted: newSkillBreakdown[skillIndex].attempted + 1,
          correct: newSkillBreakdown[skillIndex].correct + (isCorrect ? 1 : 0),
        };
      } else if (selectedSkill) {
        newSkillBreakdown.push({
          skill: selectedSkill,
          attempted: 1,
          correct: isCorrect ? 1 : 0,
        });
      }

      return {
        questionsAttempted: prev.questionsAttempted + 1,
        questionsCorrect: prev.questionsCorrect + (isCorrect ? 1 : 0),
        totalPoints: prev.totalPoints + (currentQ?.points || 10),
        pointsEarned: prev.pointsEarned + pointsEarned,
        timeSpent: Math.floor((Date.now() - sessionStartTime) / 1000),
        skillBreakdown: newSkillBreakdown,
      };
    });

    // Check if session should end (after 10 questions)
    if (sessionStats.questionsAttempted + 1 >= 10) {
      // Complete database session
      if (dbSessionId) {
        try {
          await completePracticeSession(dbSessionId);
          console.log("[Practice] Session completed");
        } catch (error) {
          console.error("[Practice] Failed to complete session:", error);
        }
      }

      setTimeout(() => {
        setShowSessionSummary(true);
      }, 2000);
    } else {
      // Load next question after a short delay
      setTimeout(() => {
        loadNewQuestion();
      }, 2000);
    }
  };

  const handleSkillSelect = async (skill: SkillType) => {
    setSelectedSkill(skill);
    setFilters({ ...filters, skill });
    setQuestionCount(1);
    // Reset session stats
    setSessionStats({
      questionsAttempted: 0,
      questionsCorrect: 0,
      totalPoints: 0,
      pointsEarned: 0,
      timeSpent: 0,
      skillBreakdown: [],
    });
    setSessionStartTime(Date.now());

    // Create database session
    try {
      const session = await createPracticeSession(skill, currentLevel);
      setDbSessionId(session.id);
      setDbSessionUUID(session.sessionId);
      console.log("[Practice] Session created:", session.sessionId);
    } catch (error) {
      console.error("[Practice] Failed to create session:", error);
    }

    // Pass skill parameter to avoid using stale selectedSkill state
    const question = getFilteredRandomQuestion(skill);
    setCurrentQuestion(question || null);
  };

  const handleContinueSession = () => {
    setShowSessionSummary(false);
    // Reset session stats but keep skill selected
    setSessionStats({
      questionsAttempted: 0,
      questionsCorrect: 0,
      totalPoints: 0,
      pointsEarned: 0,
      timeSpent: 0,
      skillBreakdown: [],
    });
    setSessionStartTime(Date.now());
    loadNewQuestion();
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    // Reload question with new filters if already practicing
    if (selectedSkill && currentQuestion) {
      const question = getFilteredRandomQuestion();
      setCurrentQuestion(question || null);
    }
  };

  const skills: { id: SkillType; label: string; icon: React.ElementType }[] = [
    { id: "listening", label: "Listening", icon: Headphones },
    { id: "speaking", label: "Speaking", icon: Mic },
    { id: "reading", label: "Reading", icon: BookOpen },
    { id: "writing", label: "Writing", icon: PenTool },
  ];

  return (
    <>
      {showSessionSummary && (
        <SessionSummary
          stats={sessionStats}
          onContinue={handleContinueSession}
          onGoHome={() => router.push("/")}
          onViewDashboard={() => router.push("/dashboard")}
        />
      )}

      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-primary">
              Practice
            </h1>
            <p className="text-muted-foreground mb-4">
              <Badge variant="secondary">
                {currentLevelInfo?.name || currentLevel}
              </Badge>
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="practice" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="practice" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="recordings" className="flex items-center gap-2">
                <FileAudio className="h-4 w-4" />
                Recordings
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                Audio
              </TabsTrigger>
            </TabsList>

            {/* Practice Tab */}
            <TabsContent value="practice" className="space-y-6">
              {/* Session Info */}
              {selectedSkill && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Question {questionCount} • {sessionStats.questionsAttempted}/10
                    </Badge>
                    {sessionStats.questionsAttempted > 0 && (
                      <Badge variant={sessionStats.questionsCorrect / sessionStats.questionsAttempted >= 0.7 ? "default" : "secondary"}>
                        {Math.round((sessionStats.questionsCorrect / sessionStats.questionsAttempted) * 100)}% Accuracy
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSkill(null);
                        setCurrentQuestion(null);
                      }}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Change Skill
                    </Button>
                    <PracticeFilters
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      isActive={showFilters}
                      onToggle={() => setShowFilters(!showFilters)}
                    />
                  </div>

                  {/* Session Progress Bar */}
                  {sessionStats.questionsAttempted > 0 && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="font-medium">Session Progress</span>
                          <span className="text-muted-foreground">
                            {sessionStats.questionsAttempted}/10 questions • {sessionStats.pointsEarned} points earned
                          </span>
                        </div>
                        <Progress value={(sessionStats.questionsAttempted / 10) * 100} className="h-2" />
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Skill Progress Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {skills.map((skill) => (
                  <Card
                    key={skill.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSkillSelect(skill.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <skill.icon className="h-8 w-8 text-primary" />
                        <Badge variant={selectedSkill === skill.id ? "default" : "secondary"}>{skillProgress[skill.id]}%</Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">{skill.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={skillProgress[skill.id]} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Practice Area */}
              {!selectedSkill ? (
                <div className="text-center py-20">
                  <DotLottieReact
                    src="/learning.lottie"
                    autoplay
                    loop
                    style={{ width: 300, height: 300, margin: '0 auto' }}
                  />
                </div>
              ) : currentQuestion ? (
                <div key={currentQuestion.id}>
                  {/* Render appropriate card based on question type */}
                  {(currentQuestion.type === "audio-comprehension" || currentQuestion.type === "listening-comprehension") ? (
                    <ListeningQuestionCard
                      question={currentQuestion}
                      onSubmit={handleAnswerSubmit}
                      onSkip={() => loadNewQuestion()}
                    />
                  ) : (currentQuestion.type === "voice-recording" || currentQuestion.type === "speaking-prompt") ? (
                    <SpeakingQuestionCard
                      question={currentQuestion}
                      onSubmit={handleAnswerSubmit}
                      onSkip={() => loadNewQuestion()}
                      sessionId={dbSessionUUID}
                    />
                  ) : currentQuestion.type === "essay" ? (
                    <EssayQuestionCard
                      question={currentQuestion}
                      onSubmit={handleAnswerSubmit}
                      onSkip={() => loadNewQuestion()}
                    />
                  ) : (
                    <QuestionCard
                      question={currentQuestion}
                      onSubmit={handleAnswerSubmit}
                      onSkip={() => loadNewQuestion()}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Card className="max-w-md mx-auto">
                    <CardHeader>
                      <CardTitle>No Questions Available</CardTitle>
                      <CardDescription>
                        Try another skill.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => setSelectedSkill(null)}>
                        Choose Different Skill
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <DiagnosticPanel />
              <PracticeHistoryList />
            </TabsContent>

            {/* Recordings Tab */}
            <TabsContent value="recordings">
              <RecordingHistoryList />
            </TabsContent>

            {/* Question Audio Tab */}
            <TabsContent value="audio">
              <QuestionAudioList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
