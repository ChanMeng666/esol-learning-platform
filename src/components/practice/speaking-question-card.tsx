"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, CheckCircle2, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoiceRecorder } from "./voice-recorder";
import { SpeakingFeedback } from "./speaking-feedback";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import type { Question } from "@/types";
import { toast } from "sonner";

interface SpeakingQuestionCardProps {
  question: Question;
  onSubmit: (questionId: string, answer: string, isCorrect: boolean) => void;
  onSkip: () => void;
}

export function SpeakingQuestionCard({
  question,
  onSubmit,
  onSkip,
}: SpeakingQuestionCardProps) {
  const { state, transcribe, assess, reset } = useVoiceRecorder();
  const [showFeedback, setShowFeedback] = useState(false);

  const handleGetFeedback = async () => {
    try {
      // First transcribe
      toast.info("Transcribing your response...");
      const transcription = await transcribe();

      // Then assess
      toast.info("AI is evaluating your response...");
      const assessment = await assess(
        question.question,
        question.level,
        question.rubric?.description
      );

      setShowFeedback(true);

      // Calculate if "correct" based on overall score
      const isCorrect = assessment.overallScore >= 60; // 60% threshold for passing

      // Show result toast
      if (assessment.overallScore >= 80) {
        toast.success(`Excellent! Score: ${assessment.overallScore}/100`, {
          icon: "✨",
        });
      } else if (assessment.overallScore >= 60) {
        toast.success(`Good work! Score: ${assessment.overallScore}/100`);
      } else {
        toast.info(`Keep practicing! Score: ${assessment.overallScore}/100`);
      }

      // Call parent handler after delay
      setTimeout(() => {
        onSubmit(question.id, transcription, isCorrect);
        setShowFeedback(false);
        reset();
      }, 10000); // Give user 10 seconds to read feedback
    } catch (error) {
      console.error("Error getting feedback:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process your response");
    }
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
            <Badge className="bg-green-100 text-green-700">
              <Mic className="w-3 h-3 mr-1" />
              SPEAKING
            </Badge>
            <Badge variant="outline">{question.points} points</Badge>
          </div>
          <CardTitle className="text-2xl">{question.question}</CardTitle>
          <CardDescription>
            Record your spoken response. You can re-record as many times as you like before
            submitting.
            {question.expectedDuration && (
              <> Expected duration: {Math.floor(question.expectedDuration / 60)} minute
              {Math.floor(question.expectedDuration / 60) !== 1 ? 's' : ''}.</>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showFeedback ? (
            <>
              {/* Voice Recorder */}
              <VoiceRecorder
                maxDuration={question.expectedDuration || 300}
              />

              {/* Explanation/Tips */}
              {question.explanation && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm">
                    <strong className="text-blue-900 dark:text-blue-100">Tip:</strong>{" "}
                    <span className="text-blue-800 dark:text-blue-200">{question.explanation}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleGetFeedback}
                  className="flex-1"
                  size="lg"
                  disabled={!state.audioBlob || state.isTranscribing || state.isAssessing}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  {state.isTranscribing || state.isAssessing
                    ? "Processing..."
                    : "Get AI Feedback"}
                </Button>
                <Button
                  onClick={onSkip}
                  variant="outline"
                  size="lg"
                  disabled={state.isRecording || state.isTranscribing || state.isAssessing}
                >
                  <SkipForward className="mr-2 h-5 w-5" />
                  Skip
                </Button>
              </div>
            </>
          ) : (
            /* Feedback Display */
            state.assessment && state.transcription && (
              <SpeakingFeedback
                assessment={state.assessment}
                transcription={state.transcription}
                showTranscription={true}
              />
            )
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
