"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { Sparkles, ArrowLeft, TrendingUp, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserProgress } from "@/lib/store/user-progress";
import { NZCEL_LEVELS } from "@/data/nzcel-levels";
import { getRandomQuestion } from "@/data/questions";
import { QuestionCard } from "@/components/practice/question-card";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import type { Question, SkillType } from "@/types";

export default function PracticePage() {
  const router = useRouter();
  const { currentLevel, skillProgress, submitAnswer, completedQuestions } = useUserProgress();
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const { width, height } = useWindowSize();

  const currentLevelInfo = NZCEL_LEVELS.find((l) => l.id === currentLevel);

  const loadNewQuestion = (skill?: SkillType) => {
    const targetSkill = skill || selectedSkill;
    if (!targetSkill) return;

    const question = getRandomQuestion(currentLevel, targetSkill);
    setCurrentQuestion(question || null);
    if (question) {
      setQuestionCount(prev => prev + 1);
    }
  };

  const handleAnswerSubmit = (questionId: string, answer: string, isCorrect: boolean) => {
    submitAnswer({
      questionId,
      userAnswer: answer,
      timeSpent: 0,
      isCorrect,
    });

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    // Load next question after a short delay
    setTimeout(() => {
      loadNewQuestion();
    }, 2000);
  };

  const handleSkillSelect = (skill: SkillType) => {
    setSelectedSkill(skill);
    setQuestionCount(1);
    const question = getRandomQuestion(currentLevel, skill);
    setCurrentQuestion(question || null);
  };

  const skills: { id: SkillType; label: string; icon: string; color: string }[] = [
    { id: "listening", label: "Listening", icon: "🎧", color: "bg-primary/10 text-primary border-primary/30" },
    { id: "speaking", label: "Speaking", icon: "🗣️", color: "bg-secondary/10 text-secondary-foreground border-secondary/30" },
    { id: "reading", label: "Reading", icon: "📖", color: "bg-destructive/10 text-destructive border-destructive/30" },
    { id: "writing", label: "Writing", icon: "✍️", color: "bg-accent/20 text-accent-foreground border-accent-foreground/30" },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Practice" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-muted/30 pb-20">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-destructive">
                Practice Zone
              </h1>
              <p className="text-muted-foreground">
                Current Level:{" "}
                <Badge variant="secondary" className="ml-2">
                  {currentLevelInfo?.name || currentLevel}
                </Badge>
                {selectedSkill && (
                  <Badge variant="outline" className="ml-2">
                    Question {questionCount} • {completedQuestions.length} Total
                  </Badge>
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
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSkill(null)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Change Skill
              </Button>
            </div>
          )}
        </div>

        {/* Skill Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {skills.map((skill) => (
            <Card
              key={skill.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedSkill === skill.id
                  ? "ring-2 ring-primary shadow-lg border-primary"
                  : "hover:shadow-md hover:border-primary/30"
              }`}
              onClick={() => handleSkillSelect(skill.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{skill.icon}</span>
                  <Badge className={skill.color}>{skillProgress[skill.id]}%</Badge>
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
            <h2 className="text-2xl font-bold mb-2">Select a Skill to Practice</h2>
            <p className="text-muted-foreground">
              Choose Listening, Speaking, Reading, or Writing to begin
            </p>
          </div>
        ) : currentQuestion ? (
          <div key={currentQuestion.id}>
            <QuestionCard
              question={currentQuestion}
              onSubmit={handleAnswerSubmit}
              onSkip={() => loadNewQuestion()}
            />
          </div>
        ) : (
          <div className="text-center py-20">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>No Questions Available</CardTitle>
                <CardDescription>
                  There are no questions for {selectedSkill} at {currentLevel} level yet.
                  Try a different skill or level!
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
            <Card className="bg-gradient-to-r from-accent to-muted/50 border-2 border-primary/30">
              <CardContent className="p-4 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-sm text-foreground">
                  <strong>Tip:</strong> Open the AI Study Assistant (sidebar) for personalized help
                  and explanations!
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
