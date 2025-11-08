"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Calendar,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { getDiagnosticSuggestions } from "@/actions/dashboard/diagnostic-suggestions";
import type { DiagnosticSuggestion } from "@/types";
import Link from "next/link";
import { format, isPast } from "date-fns";

/**
 * Diagnostic Suggestions Component for Student Dashboard
 *
 * Displays personalized learning recommendations based on the latest
 * diagnostic test results. Shows current level, strengths, weaknesses,
 * and targeted practice suggestions.
 *
 * Self-contained component that fetches its own data via Server Action.
 *
 * Features:
 * - Current level badge (CEFR or NZCEL)
 * - Strengths and weaknesses lists
 * - Skill-specific recommendations with actionable links
 * - Next assessment reminder
 * - Empty state with "Take Diagnostic Test" CTA
 *
 * @example
 * ```tsx
 * <DiagnosticSuggestionsCard />
 * ```
 */
export function DiagnosticSuggestionsCard() {
  const [suggestions, setSuggestions] = useState<DiagnosticSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const data = await getDiagnosticSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to load diagnostic suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSuggestions();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state - no diagnostic results
  if (!suggestions) {
    return (
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-muted-foreground" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Unlock targeted learning suggestions based on your skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Take a Diagnostic Test</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Complete a diagnostic assessment to receive personalized recommendations
              tailored to your current skill level and learning goals.
            </p>
            <Button asChild>
              <Link href="/diagnostic">
                Start Diagnostic Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAssessmentOverdue = suggestions.nextAssessmentDue && isPast(suggestions.nextAssessmentDue);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Personalized Recommendations
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {suggestions.levelSystem.toUpperCase()}: {suggestions.currentLevel}
          </Badge>
        </div>
        <CardDescription>
          Based on your latest diagnostic test • {format(suggestions.completedAt, "MMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Strengths */}
        {suggestions.strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-green-600 dark:text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              Your Strengths
            </h4>
            <ul className="space-y-1">
              {suggestions.strengths.slice(0, 2).map((strength, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {suggestions.weaknesses.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-500">
              <TrendingUp className="h-4 w-4" />
              Focus Areas
            </h4>
            <ul className="space-y-1">
              {suggestions.weaknesses.slice(0, 2).map((weakness, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {suggestions.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4" />
              Recommended Practice
            </h4>
            <div className="space-y-2">
              {suggestions.recommendations.slice(0, 3).map((rec, index) => (
                <Link key={index} href={rec.actionUrl}>
                  <div className="group p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {rec.skill}
                          </Badge>
                          {rec.estimatedDuration && (
                            <span className="text-xs text-muted-foreground">
                              ~{rec.estimatedDuration} min
                            </span>
                          )}
                        </div>
                        <p className="text-sm line-clamp-2">{rec.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Next Assessment Reminder */}
        {suggestions.nextAssessmentDue && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              isAssessmentOverdue
                ? "bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-500"
                : "bg-muted"
            }`}
          >
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="text-xs">
              {isAssessmentOverdue ? (
                <>Next assessment overdue • Consider retaking to update recommendations</>
              ) : (
                <>
                  Next assessment recommended • {format(suggestions.nextAssessmentDue, "MMM d, yyyy")}
                </>
              )}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
