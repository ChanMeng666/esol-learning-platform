"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Target, BookOpen, Award, TrendingUp, Headphones, Mic, PenTool, PlayCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCEFRProgress, useAverageCEFRProgress } from "@/lib/store/cefr-progress";
import { getCEFRProgress } from "@/actions/cefr-progress";
import { CEFR_LEVELS } from "@/data/cefr-levels";

export function GeneralPracticeTab() {
  const router = useRouter();
  const {
    currentLevel,
    targetLevel,
    skillProgress,
    totalPoints,
    questionsCompleted,
    loadFromServer,
  } = useCEFRProgress();
  const averageProgress = useAverageCEFRProgress();
  const [isLoading, setIsLoading] = useState(true);

  // Load data from server on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const serverData = await getCEFRProgress();
        loadFromServer(serverData);
      } catch (error) {
        console.error("Failed to load CEFR progress:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [loadFromServer]);

  const currentLevelInfo = CEFR_LEVELS.find((l) => l.id === currentLevel);

  const skills = [
    {
      id: "listening" as const,
      label: "Listening",
      icon: Headphones,
      description: "Understand spoken English in various contexts",
      progress: skillProgress.listening,
      color: "bg-blue-500",
    },
    {
      id: "speaking" as const,
      label: "Speaking",
      icon: Mic,
      description: "Express yourself clearly and confidently",
      progress: skillProgress.speaking,
      color: "bg-green-500",
    },
    {
      id: "reading" as const,
      label: "Reading",
      icon: BookOpen,
      description: "Comprehend written texts and materials",
      progress: skillProgress.reading,
      color: "bg-orange-500",
    },
    {
      id: "writing" as const,
      label: "Writing",
      icon: PenTool,
      description: "Communicate effectively in written English",
      progress: skillProgress.writing,
      color: "bg-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading CEFR progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-2 justify-end">
        <Button onClick={() => router.push("/practice/general")} variant="default">
          <PlayCircle className="mr-2 h-4 w-4" />
          Go to General Practice
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Current Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">
              {currentLevel}
            </div>
            <p className="text-sm text-muted-foreground">
              {currentLevelInfo?.name}
            </p>
            {targetLevel && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">Target Level</p>
                <Badge variant="outline" className="text-sm">{targetLevel}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{averageProgress}%</div>
            <Progress value={averageProgress} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              Average across all skills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Questions</span>
                <span className="font-semibold">{questionsCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Points</span>
                <span className="font-semibold">{totalPoints}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Skills Progress (CEFR)
          </CardTitle>
          <CardDescription>
            Practice by skill across CEFR levels (A1-C2)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <Card
                key={skill.id}
                className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${skill.color}/10`}>
                        <skill.icon className={`h-6 w-6 ${skill.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{skill.label}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {skill.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <Badge variant="outline">{skill.progress}%</Badge>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CEFR Framework Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Level Details */}
        {currentLevelInfo && (
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle>Your Current Level: {currentLevelInfo.name}</CardTitle>
              <CardDescription>{currentLevelInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Speaking</p>
                  <p className="text-sm">{currentLevelInfo.canDo.speaking}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Listening</p>
                  <p className="text-sm">{currentLevelInfo.canDo.listening}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CEFR Framework Overview */}
        <Card>
          <CardHeader>
            <CardTitle>CEFR Framework</CardTitle>
            <CardDescription>
              Common European Framework of Reference for Languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-1 text-sm">Basic User (A1-A2)</h4>
                <p className="text-xs text-muted-foreground">
                  Can understand and use familiar everyday expressions
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1 text-sm">Independent User (B1-B2)</h4>
                <p className="text-xs text-muted-foreground">
                  Can deal with most situations while traveling
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-1 text-sm">Proficient User (C1-C2)</h4>
                <p className="text-xs text-muted-foreground">
                  Can express ideas fluently and spontaneously
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Equivalency */}
      {currentLevelInfo && currentLevelInfo.equivalency && (
        <Card>
          <CardHeader>
            <CardTitle>Level Equivalency</CardTitle>
            <CardDescription>
              Your current CEFR level ({currentLevel}) is approximately equivalent to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {currentLevelInfo.equivalency.nzcel && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">NZCEL</p>
                  <p className="text-sm font-medium">{currentLevelInfo.equivalency.nzcel.join(", ")}</p>
                </div>
              )}
              {currentLevelInfo.equivalency.ielts && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">IELTS</p>
                  <p className="text-sm font-medium">{currentLevelInfo.equivalency.ielts}</p>
                </div>
              )}
              {currentLevelInfo.equivalency.toefl && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">TOEFL</p>
                  <p className="text-sm font-medium">{currentLevelInfo.equivalency.toefl}</p>
                </div>
              )}
              {currentLevelInfo.equivalency.pte && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">PTE</p>
                  <p className="text-sm font-medium">{currentLevelInfo.equivalency.pte}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
