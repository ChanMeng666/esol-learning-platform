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
import { saveUserRecording } from "@/actions/recordings";
import type { Question } from "@/types";
import { toast } from "sonner";

interface SpeakingQuestionCardProps {
  question: Question;
  onSubmit: (questionId: string, answer: string, isCorrect: boolean) => void;
  onSkip: () => void;
  sessionId?: string;
}

export function SpeakingQuestionCard({
  question,
  onSubmit,
  onSkip,
  sessionId,
}: SpeakingQuestionCardProps) {
  const { state, startRecording, stopRecording, transcribe, assess, reset } = useVoiceRecorder();
  const [showFeedback, setShowFeedback] = useState(false);

  const handleGetFeedback = async () => {
    console.log("[SpeakingQuestionCard] 📝 Get Feedback button clicked");
    console.log("[SpeakingQuestionCard] Current state:", {
      hasAudioBlob: !!state.audioBlob,
      audioSize: state.audioBlob?.size,
      isTranscribing: state.isTranscribing,
      isAssessing: state.isAssessing,
      hasTranscription: !!state.transcription
    });
    try {
      // First transcribe
      console.log("[SpeakingQuestionCard] Starting transcription...");
      toast.info("Transcribing your response...");
      const transcription = await transcribe();
      console.log("[SpeakingQuestionCard] ✅ Transcription received:", transcription);

      // Then assess
      console.log("[SpeakingQuestionCard] Starting assessment...");
      toast.info("AI is evaluating your response...");
      const assessment = await assess(
        transcription,
        question.question,
        question.level,
        question.rubric?.description
      );
      console.log("[SpeakingQuestionCard] ✅ Assessment received:", assessment);

      setShowFeedback(true);

      // Calculate if "correct" based on overall score
      const isCorrect = assessment.overallScore >= 60; // 60% threshold for passing

      // Save recording to database
      if (state.audioBlob && sessionId) {
        try {
          console.log("[SpeakingQuestionCard] Saving recording to database...");
          await saveUserRecording(
            state.audioBlob,
            transcription,
            question.id,
            sessionId,
            "practice_answer"
          );
          console.log("[SpeakingQuestionCard] ✅ Recording saved");
        } catch (error) {
          console.error("[SpeakingQuestionCard] Failed to save recording:", error);
        }
      }

      // Show result toast
      if (assessment.overallScore >= 80) {
        toast.success(`Excellent! Score: ${assessment.overallScore}/100`);
      } else if (assessment.overallScore >= 60) {
        toast.success(`Good work! Score: ${assessment.overallScore}/100`);
      } else {
        toast.info(`Keep practicing! Score: ${assessment.overallScore}/100`);
      }
    } catch (error) {
      console.error("Error getting feedback:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process your response");
    }
  };

  const handleNextQuestion = () => {
    const transcription = state.transcription || "";
    const isCorrect = (state.assessment?.overallScore || 0) >= 60;
    onSubmit(question.id, transcription, isCorrect);
    setShowFeedback(false);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">
              <Mic className="w-3 h-3 mr-1" />
              SPEAKING
            </Badge>
            <Badge variant="outline">{question.points} points</Badge>
          </div>
          <CardTitle className="text-2xl">{question.question}</CardTitle>
          <CardDescription>
            Record your response. Re-record anytime.
            {question.expectedDuration && (
              <> Target: {Math.floor(question.expectedDuration / 60)} min</>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showFeedback ? (
            <>
              {/* Voice Recorder */}
              <VoiceRecorder
                state={state}
                startRecording={startRecording}
                stopRecording={stopRecording}
                reset={reset}
                maxDuration={question.expectedDuration || 300}
              />

              {/* Explanation/Tips */}
              {question.explanation && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm">
                    <strong>Tip:</strong>{" "}
                    <span className="text-muted-foreground">{question.explanation}</span>
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
            <>
              {state.assessment && state.transcription && (
                <SpeakingFeedback
                  assessment={state.assessment}
                  transcription={state.transcription}
                  showTranscription={true}
                />
              )}

              {/* Next Question Button */}
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleNextQuestion}
                  className="flex-1"
                  size="lg"
                >
                  <SkipForward className="mr-2 h-5 w-5" />
                  Next Question
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
