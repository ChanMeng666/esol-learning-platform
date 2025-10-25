"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LoadingState } from "@/components/shared/loading-state";
import { getDiagnosticResults } from "@/actions/diagnostic-tests";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  Award,
  ArrowLeft,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export default function DiagnosticResultsPage() {
  return (
    <ProtectedRoute>
      <DiagnosticResultsContent />
    </ProtectedRoute>
  );
}

function DiagnosticResultsContent() {
  const router = useRouter();
  const params = useParams();
  const attemptId = BigInt(params.attemptId as string);

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  async function loadResults() {
    try {
      setLoading(true);
      const data = await getDiagnosticResults(attemptId);
      setResults(data);
    } catch (error) {
      console.error("Error loading results:", error);
      toast.error("Failed to load results");
      router.push("/diagnostic");
    } finally {
      setLoading(false);
    }
  }

  if (loading || !results) {
    return <LoadingState message="Loading your results..." fullScreen />;
  }

  const skillLevels = results.skillLevels as Record<string, string>;
  const skillScores = results.skillScores as Record<string, { earned: number; total: number }>;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/diagnostic")}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Diagnostic Tests
          </Button>
          <h1 className="text-4xl font-bold mb-2">Your Diagnostic Results</h1>
          <p className="text-muted-foreground">
            Completed on{" "}
            {new Date(results.completedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              Overall Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Overall Level */}
              <div className="text-center p-6 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Your Level</p>
                <p className="text-4xl font-bold text-primary mb-2">
                  {results.overallLevel}
                </p>
                <Badge variant="default" className="text-sm">
                  {results.levelSystem === "nzcel" ? "NZCEL" : "CEFR"}
                </Badge>
              </div>

              {/* Total Score */}
              <div className="text-center p-6 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Total Score</p>
                <p className="text-4xl font-bold mb-2">
                  {parseFloat(results.percentageScore).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {results.totalScore} points earned
                </p>
              </div>

              {/* Test Type */}
              <div className="text-center p-6 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Test Type</p>
                <p className="text-2xl font-semibold mb-2 capitalize">
                  {results.test?.testType?.replace("_", " ")}
                </p>
                <Badge variant="secondary">
                  {results.test?.targetSkills?.length || 0} skills tested
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results Tabs */}
        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="skills">Skill Breakdown</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Level Breakdown</CardTitle>
                <CardDescription>
                  Your performance across different English language skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(skillLevels).map(([skill, level]) => {
                  const score = skillScores[skill];
                  const percentage = score
                    ? (score.earned / score.total) * 100
                    : 0;

                  return (
                    <div key={skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold capitalize">{skill}</h4>
                          <p className="text-sm text-muted-foreground">
                            Level: {level}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {percentage.toFixed(0)}%
                          </p>
                          {score && (
                            <p className="text-xs text-muted-foreground">
                              {score.earned}/{score.total} points
                            </p>
                          )}
                        </div>
                      </div>
                      <Progress value={percentage} className="h-3" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    Strengths
                  </CardTitle>
                  <CardDescription>
                    Skills where you performed well
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results.strengths && results.strengths.length > 0 ? (
                    <ul className="space-y-3">
                      {results.strengths.map((strength: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="capitalize">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      Keep practicing to build your strengths!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <TrendingDown className="w-5 h-5" />
                    Areas for Improvement
                  </CardTitle>
                  <CardDescription>
                    Skills that need more practice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results.areasForImprovement && results.areasForImprovement.length > 0 ? (
                    <ul className="space-y-3">
                      {results.areasForImprovement.map((area: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg"
                        >
                          <Target className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span className="capitalize">{area}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      Great job! No major areas of concern identified.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Personalized Learning Path
                </CardTitle>
                <CardDescription>
                  Recommended next steps based on your results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.recommendedNextSteps && results.recommendedNextSteps.length > 0 ? (
                  <ul className="space-y-4">
                    {results.recommendedNextSteps.map((step: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p>{step}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Based on your level, we recommend:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                        <span>
                          Practice daily for at least 30 minutes to maintain your skills
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                        <span>
                          Focus on your weaker skills while maintaining your strengths
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                        <span>
                          Use our AI Speaking Coach for real-time conversation practice
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => router.push("/practice/general")}
                size="lg"
                className="flex-1"
              >
                Start Practice
              </Button>
              <Button
                onClick={() => router.push("/speaking")}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Try Speaking Coach
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
