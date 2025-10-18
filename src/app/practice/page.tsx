"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { BookOpen, Trophy, Target, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useUserProgress } from "@/lib/store/user-progress";
import { NZCEL_LEVELS } from "@/data/nzcel-levels";
import { getRandomQuestion } from "@/data/questions";
import { QuestionCard } from "@/components/practice/question-card";
import { LevelSelector } from "@/components/practice/level-selector";
import type { Question, SkillType } from "@/types";

export default function PracticePage() {
  const { currentLevel, skillProgress, submitAnswer } = useUserProgress();
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const currentLevelInfo = NZCEL_LEVELS.find((l) => l.id === currentLevel);

  const loadNewQuestion = (skill?: SkillType) => {
    const targetSkill = skill || selectedSkill;
    if (!targetSkill) return;

    const question = getRandomQuestion(currentLevel, targetSkill);
    setCurrentQuestion(question || null);
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
    const question = getRandomQuestion(currentLevel, skill);
    setCurrentQuestion(question || null);
  };

  const skills: { id: SkillType; label: string; icon: string; color: string }[] = [
    { id: "listening", label: "Listening", icon: "🎧", color: "bg-blue-100 text-blue-700" },
    { id: "speaking", label: "Speaking", icon: "🗣️", color: "bg-green-100 text-green-700" },
    { id: "reading", label: "Reading", icon: "📖", color: "bg-purple-100 text-purple-700" },
    { id: "writing", label: "Writing", icon: "✍️", color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Practice Zone</h1>
              <p className="text-gray-600">
                Current Level:{" "}
                <Badge variant="secondary" className="ml-2">
                  {currentLevelInfo?.name || currentLevel}
                </Badge>
              </p>
            </div>
            <Button variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Change Level
            </Button>
          </div>
        </motion.div>

        {/* Skill Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {skills.map((skill) => (
            <Card
              key={skill.id}
              className={`cursor-pointer transition-all ${
                selectedSkill === skill.id
                  ? "ring-2 ring-purple-500 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => handleSkillSelect(skill.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{skill.icon}</span>
                  <Badge variant="outline">{skillProgress[skill.id]}%</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{skill.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={skillProgress[skill.id]} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Practice Area */}
        <AnimatePresence mode="wait">
          {!selectedSkill ? (
            <motion.div
              key="select-skill"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h2 className="text-2xl font-bold mb-2">Select a Skill to Practice</h2>
              <p className="text-gray-600">
                Choose Listening, Speaking, Reading, or Writing to begin
              </p>
            </motion.div>
          ) : currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <QuestionCard
                question={currentQuestion}
                onSubmit={handleAnswerSubmit}
                onSkip={() => loadNewQuestion()}
              />
            </motion.div>
          ) : (
            <motion.div
              key="no-questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Hint */}
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <p className="text-sm">
                  <strong>Tip:</strong> Open the AI Study Assistant (sidebar) for personalized help
                  and explanations!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
