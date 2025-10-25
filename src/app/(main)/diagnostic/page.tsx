"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LoadingState, SkeletonCard } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { getActiveDiagnosticTests, getStudentDiagnosticHistory } from "@/actions/diagnostic-tests";
import { Clock, CheckCircle, PlayCircle, FileQuestion, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function DiagnosticPage() {
  return (
    <ProtectedRoute>
      <DiagnosticPageContent />
    </ProtectedRoute>
  );
}

function DiagnosticPageContent() {
  const router = useRouter();
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [tests, history] = await Promise.all([
        getActiveDiagnosticTests(),
        getStudentDiagnosticHistory(),
      ]);
      setAvailableTests(tests);
      setTestHistory(history);
    } catch (error) {
      console.error("Error loading diagnostic tests:", error);
      toast.error("Failed to load diagnostic tests");
    } finally {
      setLoading(false);
    }
  }

  function handleStartTest(testId: bigint) {
    router.push(`/diagnostic/${testId}`);
  }

  function handleViewResults(attemptId: bigint) {
    router.push(`/diagnostic/results/${attemptId}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary">Diagnostic Tests</h1>
          <p className="text-muted-foreground">
            Take a diagnostic test to assess your English proficiency level across all skills
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="available" className="gap-2">
              <FileQuestion className="w-4 h-4" />
              Available Tests
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              My History
            </TabsTrigger>
          </TabsList>

          {/* Available Tests Tab */}
          <TabsContent value="available" className="mt-6">
            {availableTests.length === 0 ? (
              <EmptyState
                icon={<FileQuestion className="w-16 h-16" />}
                title="No tests available"
                description="There are no diagnostic tests available at the moment"
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {availableTests.map((test) => (
                  <Card key={test.id.toString()} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{test.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">
                              {test.levelSystem === "nzcel" ? "NZCEL" : "CEFR"}
                            </Badge>
                            <Badge variant="secondary">{test.testType.replace("_", " ")}</Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription>{test.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Test Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>~{test.estimatedDuration} min</span>
                        </div>
                        {test.targetSkills && test.targetSkills.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span>{test.targetSkills.length} skills</span>
                          </div>
                        )}
                      </div>

                      {/* Skills covered */}
                      {test.targetSkills && test.targetSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {test.targetSkills.map((skill: string) => (
                            <Badge key={skill} variant="outline" className="capitalize">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        onClick={() => handleStartTest(test.id)}
                        className="w-full"
                        size="lg"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Test
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Test History Tab */}
          <TabsContent value="history" className="mt-6">
            {testHistory.length === 0 ? (
              <EmptyState
                icon={<TrendingUp className="w-16 h-16" />}
                title="No test history"
                description="You haven't completed any diagnostic tests yet. Start your first test to see your results here!"
                action={{
                  label: "Browse Tests",
                  onClick: () => setActiveTab("available"),
                }}
              />
            ) : (
              <div className="space-y-4">
                {testHistory.map((item) => (
                  <Card
                    key={item.attempt.id.toString()}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.test?.name}</CardTitle>
                          <CardDescription>
                            Completed on{" "}
                            {new Date(item.attempt.completedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {item.results ? (
                        <div className="space-y-4">
                          {/* Overall Level */}
                          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div>
                              <p className="text-sm text-muted-foreground">Overall Level</p>
                              <p className="text-2xl font-bold">{item.results.overallLevel}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Score</p>
                              <p className="text-2xl font-bold">
                                {parseFloat(item.results.percentageScore).toFixed(0)}%
                              </p>
                            </div>
                          </div>

                          {/* Skill Levels */}
                          {item.results.skillLevels && (
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(item.results.skillLevels as Record<string, string>).map(
                                ([skill, level]) => (
                                  <div
                                    key={skill}
                                    className="p-3 border border-border rounded-lg"
                                  >
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {skill}
                                    </p>
                                    <p className="font-semibold">{level}</p>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {/* View Details Button */}
                          <Button
                            onClick={() => handleViewResults(item.attempt.id)}
                            variant="outline"
                            className="w-full"
                          >
                            View Detailed Results
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Results not available</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
