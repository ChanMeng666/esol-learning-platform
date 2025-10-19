"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, SkipForward, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EssayEditor } from "./essay-editor";
import { SpeakingFeedback } from "./speaking-feedback"; // Reuse same feedback component
import { getRubric, generateRubricPrompt } from "@/lib/essay-rubrics";
import type { Question, AssessmentResult } from "@/types";
import { toast } from "sonner";

interface EssayQuestionCardProps {
  question: Question;
  onSubmit: (questionId: string, answer: string, isCorrect: boolean) => void;
  onSkip: () => void;
}

export function EssayQuestionCard({
  question,
  onSubmit,
  onSkip,
}: EssayQuestionCardProps) {
  const [essayText, setEssayText] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Extract word count requirements from question text
  const extractWordCount = (text: string) => {
    const minMatch = text.match(/(\d+)[-–](\d+)\s*words?/i);
    if (minMatch) {
      return { min: parseInt(minMatch[1]), max: parseInt(minMatch[2]) };
    }
    const singleMatch = text.match(/(\d+)\+?\s*words?/i);
    if (singleMatch) {
      return { min: parseInt(singleMatch[1]), max: undefined };
    }
    return { min: 50, max: undefined }; // Default minimum
  };

  const { min: minWords, max: maxWords } = extractWordCount(question.question + " " + (question.explanation || ""));
  const wordCount = essayText.trim() === "" ? 0 : essayText.trim().split(/\s+/).length;

  const handleSubmit = async () => {
    if (!essayText.trim()) {
      toast.error("Please write your essay before submitting");
      return;
    }

    if (minWords && wordCount < minWords) {
      toast.error(`Min. ${minWords} words required`);
      return;
    }

    if (maxWords && wordCount > maxWords) {
      toast.warning(`Your essay exceeds the ${maxWords} word limit. Consider editing.`);
      return;
    }

    setIsGrading(true);

    try {
      // Get rubric for this level
      const rubric = question.rubric || getRubric(question.level, "writing");
      const rubricText = rubric ? generateRubricPrompt(rubric) : undefined;

      toast.info("Grading your essay...");

      // Call assessment API
      const response = await fetch("/api/openai/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: essayText,
          level: question.level,
          skill: "writing",
          questionText: question.question,
          rubric: rubricText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to grade essay");
      }

      const result = await response.json();
      setAssessment(result);
      setShowFeedback(true);

      // Show result toast
      if (result.overallScore >= 80) {
        toast.success(`Excellent essay! Score: ${result.overallScore}/100`);
      } else if (result.overallScore >= 60) {
        toast.success(`Good work! Score: ${result.overallScore}/100`);
      } else {
        toast.info(`Keep practicing! Score: ${result.overallScore}/100`);
      }

      // Calculate if "correct" based on overall score
      const isCorrect = result.overallScore >= 60;

      // Call parent handler after delay
      setTimeout(() => {
        onSubmit(question.id, essayText, isCorrect);
        setShowFeedback(false);
        setEssayText("");
        setAssessment(null);
      }, 12000); // Give user 12 seconds to read feedback
    } catch (error) {
      console.error("Error grading essay:", error);
      toast.error("Failed to grade essay. Please try again.");
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">
              <FileText className="w-3 h-3 mr-1" />
              WRITING
            </Badge>
            <Badge variant="outline">{question.points} points</Badge>
          </div>
          <CardTitle className="text-2xl">{question.question}</CardTitle>
          <CardDescription>
            Write a well-organized response. The AI will evaluate your grammar, vocabulary,
            coherence, and task achievement.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showFeedback ? (
            <>
              {/* Essay Editor */}
              <EssayEditor
                value={essayText}
                onChange={setEssayText}
                minWords={minWords}
                maxWords={maxWords}
                disabled={isGrading}
              />

              {/* Explanation/Guidance */}
              {question.explanation && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm">
                    <strong>Guidance:</strong>{" "}
                    <span className="text-muted-foreground">{question.explanation}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  size="lg"
                  disabled={isGrading || !essayText.trim()}
                >
                  {isGrading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Grading...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Submit for AI Grading
                    </>
                  )}
                </Button>
                <Button
                  onClick={onSkip}
                  variant="outline"
                  size="lg"
                  disabled={isGrading}
                >
                  <SkipForward className="mr-2 h-5 w-5" />
                  Skip
                </Button>
              </div>
            </>
          ) : (
            /* Feedback Display */
            assessment && (
              <SpeakingFeedback
                assessment={assessment}
                transcription={essayText}
                showTranscription={true}
              />
            )
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
