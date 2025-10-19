"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, TrendingUp, Home, Headphones, Mic, BookOpen, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserProgress } from "@/lib/store/user-progress";
import { NZCEL_LEVELS } from "@/data/nzcel-levels";
import { ALL_QUESTIONS } from "@/data/questions";
import { QuestionCard } from "@/components/practice/question-card";
import { ListeningQuestionCard } from "@/components/practice/listening-question-card";
import { SpeakingQuestionCard } from "@/components/practice/speaking-question-card";
import { EssayQuestionCard } from "@/components/practice/essay-question-card";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { PracticeFilters, type PracticeFilters as Filters } from "@/components/practice/practice-filters";
import { SessionSummary, type SessionStats } from "@/components/practice/session-summary";
import type { Question, SkillType } from "@/types";

export default function PracticePage() {
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

  const currentLevelInfo = NZCEL_LEVELS.find((l) => l.id === currentLevel);

  // Filter available questions based on filters
  const getFilteredQuestions = () => {
    return ALL_QUESTIONS.filter((q) => {
      if (selectedSkill && q.skill !== selectedSkill) return false;
      if (filters.questionType && q.type !== filters.questionType) return false;
      if (filters.level && q.level !== filters.level) return false;
      return true;
    });
  };

  const getFilteredRandomQuestion = () => {
    const filtered = getFilteredQuestions();
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const loadNewQuestion = (skill?: SkillType) => {
    const targetSkill = skill || selectedSkill;
    if (!targetSkill) return;

    // Use filtered question selection
    const question = getFilteredRandomQuestion();
    setCurrentQuestion(question || null);
    if (question) {
      setQuestionCount(prev => prev + 1);
    }
  };

  const handleAnswerSubmit = (questionId: string, answer: string, isCorrect: boolean) => {
    const currentQ = currentQuestion;

    submitAnswer({
      questionId,
      userAnswer: answer,
      timeSpent: 0,
      isCorrect,
    });

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

  const handleSkillSelect = (skill: SkillType) => {
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
    const question = getFilteredRandomQuestion();
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

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Practice" },
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
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-primary">
                Practice Zone
              </h1>
              <p className="text-muted-foreground">
                Current Level:{" "}
                <Badge variant="secondary" className="ml-2">
                  {currentLevelInfo?.name || currentLevel}
                </Badge>
                {selectedSkill && (
                  <>
                    <Badge variant="outline" className="ml-2">
                      Question {questionCount} • Session: {sessionStats.questionsAttempted}/10
                    </Badge>
                    {sessionStats.questionsAttempted > 0 && (
                      <Badge variant={sessionStats.questionsCorrect / sessionStats.questionsAttempted >= 0.7 ? "default" : "secondary"} className="ml-2">
                        {Math.round((sessionStats.questionsCorrect / sessionStats.questionsAttempted) * 100)}% Accuracy
                      </Badge>
                    )}
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push("/")}>
                <Home className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          {selectedSkill && (
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
          )}
        </div>

        {/* Session Progress Bar */}
        {selectedSkill && sessionStats.questionsAttempted > 0 && (
          <Card className="mb-6">
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

        {/* Skill Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {skills.map((skill) => (
            <Card
              key={skill.id}
              className="cursor-pointer"
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
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Select a Skill</h2>
            <p className="text-muted-foreground">
              Choose a skill to start
            </p>
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
                  No questions available for {selectedSkill} at {currentLevel}. Try another skill or level.
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

        {/* AI Hint */}
        {selectedSkill && (
          <div className="mt-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-sm">
                  <strong>Tip:</strong> Ask the AI Study Assistant for help!
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
