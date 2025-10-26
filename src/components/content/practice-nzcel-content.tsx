"use client";

import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, MessageCircle, Target, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserProgress } from "@/lib/store/user-progress";
import { NZCEL_LEVELS } from "@/data/nzcel-levels";

/**
 * NZCEL Practice content component for dashboard integration
 * Extracted from /practice/nzcel page without layout wrapper
 */
export function PracticeNZCELContent() {
  const router = useRouter();
  const { currentLevel, skillProgress, totalPoints, completedQuestions } = useUserProgress();

  const currentLevelInfo = NZCEL_LEVELS.find((l) => l.id === currentLevel);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              NZCEL Exam Preparation
            </h2>
            <p className="text-muted-foreground">
              New Zealand Certificates in English Language
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            <Trophy className="h-3 w-3" />
            13 Levels
          </Badge>
          <Badge variant="outline">All 4 Skills</Badge>
          <Badge variant="outline">Official Certification</Badge>
          <Badge variant="outline">University Pathways</Badge>
        </div>
      </div>

      {/* Current Progress Overview */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Your Current Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Level</p>
              <p className="text-2xl font-bold text-primary">
                {currentLevelInfo?.name || currentLevel}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Questions Completed</p>
              <p className="text-2xl font-bold">{completedQuestions.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Points</p>
              <p className="text-2xl font-bold">{totalPoints}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Skill Progress</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  (skillProgress.listening +
                    skillProgress.speaking +
                    skillProgress.reading +
                    skillProgress.writing) /
                    4
                )}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Practice Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills Practice Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Skills Practice</CardTitle>
                  <CardDescription>
                    Practice Listening, Speaking, Reading, and Writing
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Listening</span>
                <Badge variant="outline">{skillProgress.listening}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Speaking</span>
                <Badge variant="outline">{skillProgress.speaking}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Reading</span>
                <Badge variant="outline">{skillProgress.reading}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Writing</span>
                <Badge variant="outline">{skillProgress.writing}%</Badge>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => router.push("/student/dashboard/practice/nzcel/skills")}
            >
              Start Skills Practice
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Conversation Practice Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Conversation Practice</CardTitle>
                  <CardDescription>
                    Real-world speaking scenarios and dialogues
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-muted-foreground">
                Practice English conversation in realistic scenarios tailored to your NZCEL level
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Social interactions</li>
                <li>• Academic discussions</li>
                <li>• Professional contexts</li>
                <li>• Everyday situations</li>
              </ul>
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => router.push("/student/dashboard/practice/nzcel/conversation")}
            >
              Start Conversation Practice
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* NZCEL Framework Overview */}
      <Card>
        <CardHeader>
          <CardTitle>About NZCEL</CardTitle>
          <CardDescription>
            Understanding the New Zealand Certificates in English Language framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              NZCEL is New Zealand&apos;s national English language qualification system, designed to assess and
              certify English language proficiency for academic, professional, and general purposes.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">13 Levels</h4>
                <p className="text-sm text-muted-foreground">
                  From Foundation to Level 6 (Advanced), with specialized streams for General, Academic, and
                  Employment pathways
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">University Pathways</h4>
                <p className="text-sm text-muted-foreground">
                  Level 4 (Academic) for undergraduate entry, Level 5 (Academic) for postgraduate programs
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">International Recognition</h4>
                <p className="text-sm text-muted-foreground">
                  Aligned with CEFR, IELTS, TOEFL, and other international English proficiency standards
                </p>
              </div>
            </div>

            {currentLevelInfo && (
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-2">Your Current Level: {currentLevelInfo.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{currentLevelInfo.description}</p>
                <p className="text-sm text-muted-foreground italic">
                  &quot;{currentLevelInfo.strategicPurpose}&quot;
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}