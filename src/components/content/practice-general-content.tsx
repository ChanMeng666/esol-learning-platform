"use client";

import { useEffect, useState } from "react";
import { BookOpen, Headphones, Mic, PenTool, Target, TrendingUp, ArrowRight, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCEFRProgress, useAverageCEFRProgress } from "@/lib/store/cefr-progress";
import { getCEFRProgress } from "@/actions/cefr-progress";
import { CEFR_LEVELS } from "@/data/cefr-levels";

/**
 * General Practice content component for dashboard integration
 * Extracted from /practice/general page without layout wrapper
 */
export function PracticeGeneralContent() {
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              General English Practice
            </h2>
            <p className="text-muted-foreground">
              CEFR-aligned learning from A1 to C2
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            <Target className="h-3 w-3" />
            CEFR Framework
          </Badge>
          <Badge variant="outline">All 4 Skills</Badge>
          <Badge variant="outline">Adaptive Learning</Badge>
          <Badge variant="outline">A1 - C2 Levels</Badge>
        </div>
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
                <p className="text-lg font-semibold">{targetLevel}</p>
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
      <div>
        <h3 className="text-2xl font-bold mb-4">Practice by Skill</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <Card
              key={skill.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
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
                <Button
                  className="w-full"
                  variant="outline"
                  disabled
                >
                  Start {skill.label} Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Coming Soon
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CEFR Framework Info */}
      <Card>
        <CardHeader>
          <CardTitle>About CEFR Framework</CardTitle>
          <CardDescription>
            Common European Framework of Reference for Languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The CEFR is an international standard for describing language ability. It describes language ability
              on a six-point scale, from A1 for beginners, up to C2 for those who have mastered a language.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-600">Basic User (A1-A2)</h4>
                <p className="text-sm text-muted-foreground">
                  Can understand and use familiar everyday expressions
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 text-green-600">Independent User (B1-B2)</h4>
                <p className="text-sm text-muted-foreground">
                  Can deal with most situations while traveling
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 text-purple-600">Proficient User (C1-C2)</h4>
                <p className="text-sm text-muted-foreground">
                  Can express ideas fluently and spontaneously
                </p>
              </div>
            </div>

            {currentLevelInfo && (
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-2">Your Current Level: {currentLevelInfo.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{currentLevelInfo.description}</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Speaking</p>
                    <p className="text-sm">{currentLevelInfo.canDo.speaking}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Listening</p>
                    <p className="text-sm">{currentLevelInfo.canDo.listening}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}