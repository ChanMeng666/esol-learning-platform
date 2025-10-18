"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Question } from "@/types";
import { toast } from "sonner";

interface QuestionCardProps {
  question: Question;
  onSubmit: (questionId: string, answer: string, isCorrect: boolean) => void;
  onSkip: () => void;
}

export function QuestionCard({ question, onSubmit, onSkip }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }

    // Check answer
    let correct = false;
    if (question.type === "multiple-choice" && question.correctAnswer) {
      correct = selectedAnswer === question.correctAnswer;
    } else if (question.type === "fill-in-blank" && Array.isArray(question.correctAnswer)) {
      correct = question.correctAnswer.some(
        (ans) => selectedAnswer.toLowerCase().trim() === ans.toLowerCase().trim()
      );
    } else {
      // For essay and speaking prompts, consider it correct (would need AI grading in real app)
      correct = selectedAnswer.length > 20;
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    // Show feedback toast
    if (correct) {
      toast.success(`Correct! +${question.points} points`, {
        icon: "✨",
      });
    } else {
      toast.error("Not quite right. Keep practicing!");
    }

    // Call parent handler
    setTimeout(() => {
      onSubmit(question.id, selectedAnswer, correct);
      setShowFeedback(false);
      setSelectedAnswer("");
    }, 2000);
  };

  const skillColors = {
    listening: "bg-blue-100 text-blue-700",
    speaking: "bg-green-100 text-green-700",
    reading: "bg-purple-100 text-purple-700",
    writing: "bg-orange-100 text-orange-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge className={skillColors[question.skill]}>
              {question.skill.toUpperCase()}
            </Badge>
            <Badge variant="outline">{question.points} points</Badge>
          </div>
          <CardTitle className="text-2xl">{question.question}</CardTitle>
          <CardDescription>
            {question.type === "multiple-choice" && "Select the correct answer"}
            {question.type === "fill-in-blank" && "Type your answer"}
            {question.type === "essay" && "Write a detailed response"}
            {question.type === "speaking-prompt" && "Prepare your spoken response"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Multiple Choice Options */}
          {question.type === "multiple-choice" && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-4 px-6"
                    onClick={() => setSelectedAnswer(option)}
                    disabled={showFeedback}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Text Input for Fill-in-Blank and Essays */}
          {(question.type === "fill-in-blank" ||
            question.type === "essay" ||
            question.type === "speaking-prompt") && (
            <div className="space-y-3">
              <Label htmlFor="answer">Your Answer:</Label>
              <Textarea
                id="answer"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder={
                  question.type === "essay"
                    ? "Write your essay here..."
                    : question.type === "speaking-prompt"
                    ? "Type what you would say..."
                    : "Type your answer..."
                }
                rows={question.type === "essay" ? 8 : 4}
                disabled={showFeedback}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                {selectedAnswer.length} characters
                {question.type === "essay" && ` (minimum 100 recommended)`}
              </p>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6"
            >
              <Card className={isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">
                        {isCorrect ? "Excellent!" : "Not Quite"}
                      </h4>
                      {question.explanation && (
                        <p className="text-sm text-gray-700">{question.explanation}</p>
                      )}
                      {!isCorrect && question.correctAnswer && (
                        <p className="text-sm mt-2">
                          <strong>Correct answer:</strong>{" "}
                          {Array.isArray(question.correctAnswer)
                            ? question.correctAnswer.join(", ")
                            : question.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          {!showFeedback && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSubmit}
                className="flex-1"
                size="lg"
                disabled={!selectedAnswer.trim()}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Submit Answer
              </Button>
              <Button onClick={onSkip} variant="outline" size="lg">
                <SkipForward className="mr-2 h-5 w-5" />
                Skip
              </Button>
            </div>
          )}

          {/* Hint */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-gray-700">
              Ask the AI Study Assistant for help if you&apos;re stuck!
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
