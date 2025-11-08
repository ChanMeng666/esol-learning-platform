"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LoadingState } from "@/components/shared/loading-state";
import {
  getDiagnosticTestById,
  startDiagnosticAttempt,
  submitDiagnosticAnswer,
  completeDiagnosticAttempt,
} from "@/actions/diagnostic-tests";
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Flag, Mic } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DiagnosticTestPage() {
  return (
    <ProtectedRoute>
      <DiagnosticTestContent />
    </ProtectedRoute>
  );
}

function DiagnosticTestContent() {
  const router = useRouter();
  const params = useParams();
  const testId = BigInt(params.testId as string);

  const [test, setTest] = useState<any>(null);
  const [attemptId, setAttemptId] = useState<bigint | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    loadTest();
  }, [testId]);

  async function loadTest() {
    try {
      setLoading(true);
      const testData = await getDiagnosticTestById(testId);
      setTest(testData);

      // Start a new attempt
      const attempt = await startDiagnosticAttempt(testId);
      setAttemptId(attempt.id);
      setStartTime(new Date());
    } catch (error) {
      console.error("Error loading test:", error);
      toast.error("Failed to load test");
      router.push("/diagnostic");
    } finally {
      setLoading(false);
    }
  }

  async function handleAnswerChange(questionId: string, answer: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }

  async function handleSubmitAnswer() {
    if (!attemptId || !currentQuestion) return;

    const questionId = currentQuestion.id.toString();
    const answer = answers[questionId];

    if (!answer && currentQuestion.questionType !== "speaking_prompt") {
      toast.error("Please provide an answer before continuing");
      return;
    }

    try {
      setSubmitting(true);

      // Calculate time spent on this question
      const timeSpent = startTime
        ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
        : 0;

      await submitDiagnosticAnswer({
        attemptId,
        questionId: currentQuestion.id,
        studentAnswer: answer,
        timeSpent,
      });

      // Move to next question or section
      if (currentQuestionIndex < currentSection.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setStartTime(new Date());
      } else if (currentSectionIndex < test.sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentQuestionIndex(0);
        setStartTime(new Date());
        toast.success(`${currentSection.skillType} section completed!`);
      } else {
        // Test complete
        await handleCompleteTest();
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCompleteTest() {
    if (!attemptId) return;

    try {
      setSubmitting(true);
      const results = await completeDiagnosticAttempt(attemptId);
      toast.success("Test completed! Generating your results...");
      router.push(`/diagnostic/results/${attemptId}`);
    } catch (error) {
      console.error("Error completing test:", error);
      toast.error("Failed to complete test");
    } finally {
      setSubmitting(false);
    }
  }

  function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(test.sections[currentSectionIndex - 1].questions.length - 1);
    }
  }

  if (loading || !test) {
    return <LoadingState message="Loading test..." fullScreen />;
  }

  const currentSection = test.sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const totalQuestions = test.sections.reduce(
    (sum: number, section: any) => sum + section.questions.length,
    0
  );
  const questionsAnswered =
    test.sections
      .slice(0, currentSectionIndex)
      .reduce((sum: number, section: any) => sum + section.questions.length, 0) +
    currentQuestionIndex;
  const progress = (questionsAnswered / totalQuestions) * 100;

  if (!currentSection || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error: Invalid test structure</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{test.name}</h1>
              <p className="text-muted-foreground">
                Section: {currentSection.sectionName}
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {questionsAnswered + 1} / {totalQuestions}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Section Instructions */}
        {currentQuestionIndex === 0 && currentSection.instructions && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{currentSection.instructions}</AlertDescription>
          </Alert>
        )}

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2 capitalize">
                  {currentSection.skillType}
                </Badge>
                <CardTitle className="text-xl mb-2">
                  Question {currentQuestionIndex + 1}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {currentQuestion.questionText}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Question Type Rendering */}
            {currentQuestion.questionType === "multiple_choice" && (
              <MultipleChoiceQuestion
                question={currentQuestion}
                value={answers[currentQuestion.id.toString()]}
                onChange={(value) => handleAnswerChange(currentQuestion.id.toString(), value)}
              />
            )}

            {currentQuestion.questionType === "fill_in_blank" && (
              <FillInBlankQuestion
                question={currentQuestion}
                value={answers[currentQuestion.id.toString()]}
                onChange={(value) => handleAnswerChange(currentQuestion.id.toString(), value)}
              />
            )}

            {currentQuestion.questionType === "essay" && (
              <EssayQuestion
                question={currentQuestion}
                value={answers[currentQuestion.id.toString()]}
                onChange={(value) => handleAnswerChange(currentQuestion.id.toString(), value)}
              />
            )}

            {currentQuestion.questionType === "speaking_prompt" && (
              <SpeakingQuestion
                question={currentQuestion}
                value={answers[currentQuestion.id.toString()]}
                onChange={(value) => handleAnswerChange(currentQuestion.id.toString(), value)}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePreviousQuestion}
            variant="outline"
            disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleSubmitAnswer}
            disabled={submitting}
            size="lg"
          >
            {submitting ? (
              "Submitting..."
            ) : questionsAnswered + 1 === totalQuestions ? (
              <>
                <Flag className="w-4 h-4 mr-2" />
                Finish Test
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Question Type Components

function MultipleChoiceQuestion({
  question,
  value,
  onChange,
}: {
  question: any;
  value: string;
  onChange: (value: string) => void;
}) {
  const options = question.options as string[];

  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {options.map((option: string, index: number) => (
        <div key={index} className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value={option} id={`option-${index}`} />
          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
            {option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

function FillInBlankQuestion({
  question,
  value,
  onChange,
}: {
  question: any;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here..."
        className="text-lg p-6"
      />
    </div>
  );
}

function EssayQuestion({
  question,
  value,
  onChange,
}: {
  question: any;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your response here..."
        className="min-h-[200px] text-base"
      />
      <p className="text-sm text-muted-foreground">
        Word count: {(value || "").split(/\s+/).filter(Boolean).length}
      </p>
    </div>
  );
}

function SpeakingQuestion({
  question,
  value,
  onChange,
}: {
  question: any;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Alert>
        <Mic className="h-4 w-4" />
        <AlertDescription>
          Speaking questions will be available in the full version. For now, please skip this question.
        </AlertDescription>
      </Alert>
      <Button variant="outline" className="w-full" disabled>
        <Mic className="w-4 h-4 mr-2" />
        Record Answer (Coming Soon)
      </Button>
    </div>
  );
}
