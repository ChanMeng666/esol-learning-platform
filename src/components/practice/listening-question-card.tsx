"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Headphones, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "./audio-player";
import { getQuestionAudio } from "@/actions/audio";
import { VOICE_PROFILES } from "@/lib/openai";
import type { Question } from "@/types";
import { toast } from "sonner";

interface ListeningQuestionCardProps {
  question: Question;
  onSubmit: (questionId: string, answer: string, isCorrect: boolean) => void;
  onSkip: () => void;
}

export function ListeningQuestionCard({
  question,
  onSubmit,
  onSkip,
}: ListeningQuestionCardProps) {
  const [audioUrl, setAudioUrl] = useState<string | undefined>(question.audioUrl);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Generate audio from script with intelligent caching
  useEffect(() => {
    if (!question.audioUrl && question.audioScript) {
      setIsGeneratingAudio(true);

      // Get voice name from profile
      const voiceProfile = question.voiceProfile || "academic";
      const voiceName = VOICE_PROFILES[voiceProfile]?.voice || "alloy";

      // Use intelligent caching Server Action
      // First call: generates audio -> uploads to Blob -> saves to DB (2-3s)
      // Subsequent calls: returns cached URL from DB (0.1s) ✨
      getQuestionAudio(question.id, question.audioScript, voiceName, "tts-1")
        .then((url) => {
          setAudioUrl(url);
          setIsGeneratingAudio(false);
        })
        .catch((error) => {
          console.error("Failed to get question audio:", error);
          toast.error("Failed to load audio. Please try again.");
          setIsGeneratingAudio(false);
        });
    }
  }, [question.id, question.audioScript, question.audioUrl, question.voiceProfile]);

  const handleSubmit = () => {
    if (!selectedAnswer.trim()) {
      toast.error("Please select an answer before submitting");
      return;
    }

    // Check answer
    const correct = selectedAnswer === question.correctAnswer;

    setIsCorrect(correct);
    setShowFeedback(true);

    // Show feedback toast
    if (correct) {
      toast.success(`Correct! +${question.points} points`);
    } else {
      toast.error("Not quite right. Keep practicing!");
    }
  };

  const handleNextQuestion = () => {
    onSubmit(question.id, selectedAnswer, isCorrect);
    setShowFeedback(false);
    setSelectedAnswer("");
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
              <Headphones className="w-3 h-3 mr-1" />
              LISTENING
            </Badge>
            <Badge variant="outline">{question.points} points</Badge>
          </div>
          <CardTitle className="text-2xl">{question.question}</CardTitle>
          <CardDescription>
            Listen and answer. Replay as needed.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Audio Player */}
          <AudioPlayer
            audioUrl={audioUrl}
            showTranscript={question.allowTranscript}
            transcript={question.audioScript}
          />

          {isGeneratingAudio && (
            <div className="text-center text-sm text-muted-foreground">
              Generating audio...
            </div>
          )}

          {/* Multiple Choice Options */}
          {question.type === "audio-comprehension" && question.options && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Select your answer:</p>
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-4 px-6"
                    onClick={() => !showFeedback && setSelectedAnswer(option)}
                    disabled={showFeedback}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">
                        {isCorrect ? "Excellent!" : "Not Quite"}
                      </h4>
                      {question.explanation && (
                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
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
          <div className="flex gap-3">
            {!showFeedback ? (
              <>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  size="lg"
                  disabled={!selectedAnswer.trim() || isGeneratingAudio}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Submit Answer
                </Button>
                <Button onClick={onSkip} variant="outline" size="lg">
                  <SkipForward className="mr-2 h-5 w-5" />
                  Skip
                </Button>
              </>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="flex-1"
                size="lg"
              >
                <SkipForward className="mr-2 h-5 w-5" />
                Next Question
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
