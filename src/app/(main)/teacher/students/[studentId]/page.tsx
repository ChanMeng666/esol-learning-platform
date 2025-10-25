"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/shared/loading-state";
import { getStudentDetailedProgress } from "@/actions/classes";
import { ArrowLeft, User, TrendingUp, Award, Clock, FileText, Mic } from "lucide-react";
import { toast } from "sonner";

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = BigInt(params.studentId as string);

  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  async function loadStudentData() {
    try {
      setLoading(true);
      const data = await getStudentDetailedProgress(studentId);
      setStudentData(data);
    } catch (error) {
      console.error("Error loading student data:", error);
      toast.error("Failed to load student data");
      router.push("/teacher/classes");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading student details..." fullScreen />;
  }

  if (!studentData) {
    return null;
  }

  const { student, nzcelProgress, cefrProgress, diagnosticHistory, recentSessions, achievements, badges } = studentData;

  const avgProgress = nzcelProgress
    ? (nzcelProgress.listeningProgress +
        nzcelProgress.speakingProgress +
        nzcelProgress.readingProgress +
        nzcelProgress.writingProgress) /
      4
    : 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-1">{student.fullName}</h1>
                <p className="text-muted-foreground">{student.email}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {student.role}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgProgress.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">Across all skills</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nzcelProgress?.totalPoints || 0}</div>
              <p className="text-xs text-muted-foreground">Points earned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nzcelProgress?.questionsCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nzcelProgress?.streak || 0}</div>
              <p className="text-xs text-muted-foreground">Day streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>NZCEL Progress</CardTitle>
                <CardDescription>
                  Current Level: {nzcelProgress?.currentLevel || "Not set"}
                  {nzcelProgress?.targetLevel && ` → Target: ${nzcelProgress.targetLevel}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Listening */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Listening</h4>
                    <span className="text-lg font-bold">
                      {nzcelProgress?.listeningProgress || 0}%
                    </span>
                  </div>
                  <Progress value={nzcelProgress?.listeningProgress || 0} className="h-3" />
                </div>

                {/* Speaking */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Speaking</h4>
                    <span className="text-lg font-bold">
                      {nzcelProgress?.speakingProgress || 0}%
                    </span>
                  </div>
                  <Progress value={nzcelProgress?.speakingProgress || 0} className="h-3" />
                </div>

                {/* Reading */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Reading</h4>
                    <span className="text-lg font-bold">
                      {nzcelProgress?.readingProgress || 0}%
                    </span>
                  </div>
                  <Progress value={nzcelProgress?.readingProgress || 0} className="h-3" />
                </div>

                {/* Writing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Writing</h4>
                    <span className="text-lg font-bold">
                      {nzcelProgress?.writingProgress || 0}%
                    </span>
                  </div>
                  <Progress value={nzcelProgress?.writingProgress || 0} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* CEFR Progress */}
            {cefrProgress && (
              <Card>
                <CardHeader>
                  <CardTitle>CEFR Progress</CardTitle>
                  <CardDescription>
                    Current Level: {cefrProgress.currentLevel}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-border rounded">
                      <p className="text-sm text-muted-foreground">Listening</p>
                      <p className="text-xl font-bold">{cefrProgress.listeningProgress}%</p>
                    </div>
                    <div className="p-3 border border-border rounded">
                      <p className="text-sm text-muted-foreground">Speaking</p>
                      <p className="text-xl font-bold">{cefrProgress.speakingProgress}%</p>
                    </div>
                    <div className="p-3 border border-border rounded">
                      <p className="text-sm text-muted-foreground">Reading</p>
                      <p className="text-xl font-bold">{cefrProgress.readingProgress}%</p>
                    </div>
                    <div className="p-3 border border-border rounded">
                      <p className="text-sm text-muted-foreground">Writing</p>
                      <p className="text-xl font-bold">{cefrProgress.writingProgress}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Diagnostic Tab */}
          <TabsContent value="diagnostic">
            <Card>
              <CardHeader>
                <CardTitle>Diagnostic Test History</CardTitle>
                <CardDescription>
                  Student's diagnostic test results over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {diagnosticHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No diagnostic tests completed yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {diagnosticHistory.map((item: any) => (
                      <div
                        key={item.attempt.id.toString()}
                        className="p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{item.test?.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.attempt.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                          {item.results && (
                            <Badge variant="secondary">{item.results.overallLevel}</Badge>
                          )}
                        </div>
                        {item.results && (
                          <p className="text-sm">
                            Score: {parseFloat(item.results.percentageScore).toFixed(0)}%
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Practice Sessions</CardTitle>
                <CardDescription>Latest practice activity</CardDescription>
              </CardHeader>
              <CardContent>
                {recentSessions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No practice sessions yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSessions.map((session: any) => (
                      <div
                        key={session.id.toString()}
                        className="p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="capitalize">
                            {session.skill}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(session.startedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Questions:</span>{" "}
                            {session.questionsAttempted}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Correct:</span>{" "}
                            {session.questionsCorrect}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Points:</span>{" "}
                            {session.totalPointsEarned}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Progress towards goals</CardDescription>
                </CardHeader>
                <CardContent>
                  {achievements.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No achievements yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {achievements.map((achievement: any) => (
                        <div key={achievement.id.toString()} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <span className="text-sm">
                              {achievement.progress}/{achievement.target}
                            </span>
                          </div>
                          <Progress
                            value={(achievement.progress / achievement.target) * 100}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Badges Earned</CardTitle>
                  <CardDescription>Collected badges</CardDescription>
                </CardHeader>
                <CardContent>
                  {badges.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No badges yet</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {badges.map((badge: any) => (
                        <div
                          key={badge.id.toString()}
                          className="p-4 border border-border rounded-lg text-center"
                        >
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <h4 className="font-semibold text-sm">{badge.name}</h4>
                          <Badge variant="outline" className="mt-1 capitalize text-xs">
                            {badge.rarity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recordings Tab */}
          <TabsContent value="recordings">
            <Card>
              <CardHeader>
                <CardTitle>Voice Recordings</CardTitle>
                <CardDescription>
                  Student's speaking practice recordings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Recordings feature will be available soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
