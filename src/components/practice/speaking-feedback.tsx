"use client";

import { CheckCircle2, TrendingUp, TrendingDown, Lightbulb, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AssessmentResult } from "@/types";

interface SpeakingFeedbackProps {
  assessment: AssessmentResult;
  transcription: string;
  showTranscription?: boolean;
}

export function SpeakingFeedback({
  assessment,
  transcription,
  showTranscription = true,
}: SpeakingFeedbackProps) {
  // Get score color based on percentage
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  // Get score badge variant
  const getScoreBadge = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 70) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Overall Assessment</CardTitle>
            <Badge variant={getScoreBadge(assessment.overallScore)} className="text-lg px-4 py-2">
              {assessment.overallScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={assessment.overallScore} className="h-3 mb-4" />
          <p className="text-muted-foreground">{assessment.overallFeedback}</p>

          {assessment.estimatedLevel && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm">
                <strong>Estimated Level:</strong> {assessment.estimatedLevel.toUpperCase().replace(/-/g, ' ')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transcription */}
      {showTranscription && transcription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Response (Transcribed)</CardTitle>
            <CardDescription>What you said, automatically transcribed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-md p-4 text-sm leading-relaxed">
              &quot;{transcription}&quot;
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Criteria Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Assessment</CardTitle>
          <CardDescription>Performance across specific criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(assessment.criteria).map(([criterion, details]) => (
            <div key={criterion} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium capitalize">
                  {criterion.replace(/([A-Z])/g, " $1").trim()}
                </h4>
                <span className={`font-semibold ${getScoreColor(details.score)}`}>
                  {details.score}/100
                </span>
              </div>
              <Progress value={details.score} className="h-2" />
              <p className="text-sm text-muted-foreground">{details.comment}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths */}
      {assessment.strengths && assessment.strengths.length > 0 && (
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Strengths</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {assessment.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Areas for Improvement */}
      {assessment.improvements && assessment.improvements.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Areas for Improvement</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {assessment.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Keep Practicing!</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Great effort! Focus on the areas for improvement and try again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
