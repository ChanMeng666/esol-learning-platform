"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  BarChart3,
  Home,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface SessionStats {
  questionsAttempted: number;
  questionsCorrect: number;
  totalPoints: number;
  pointsEarned: number;
  timeSpent: number; // in seconds
  skillBreakdown: {
    skill: string;
    attempted: number;
    correct: number;
  }[];
}

interface SessionSummaryProps {
  stats: SessionStats;
  onContinue: () => void;
  onGoHome: () => void;
  onViewDashboard: () => void;
}

export function SessionSummary({
  stats,
  onContinue,
  onGoHome,
  onViewDashboard,
}: SessionSummaryProps) {
  const accuracy = stats.questionsAttempted > 0
    ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100)
    : 0;

  const scorePercentage = stats.totalPoints > 0
    ? Math.round((stats.pointsEarned / stats.totalPoints) * 100)
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Determine performance level
  const getPerformanceLevel = () => {
    if (accuracy >= 90) return { level: "Excellent", color: "text-success", message: "Outstanding work!" };
    if (accuracy >= 75) return { level: "Great", color: "text-foreground", message: "Well done!" };
    if (accuracy >= 60) return { level: "Good", color: "text-foreground", message: "Keep it up!" };
    return { level: "Keep Practicing", color: "text-muted-foreground", message: "You're improving!" };
  };

  const performance = getPerformanceLevel();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >

      <Card className="w-full max-w-2xl mx-4 shadow-2xl border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Trophy className="w-16 h-16 text-primary" />
              {accuracy >= 90 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <Award className="w-8 h-8 text-success fill-success" />
                </motion.div>
              )}
            </div>
          </div>
          <CardTitle className="text-3xl mb-2">Practice Session Complete!</CardTitle>
          <CardDescription className="text-lg">
            <span className={performance.color + " font-semibold"}>{performance.level}</span>
            {" • "}
            {performance.message}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-2">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-foreground" />
                <div className="text-2xl font-bold">{stats.questionsAttempted}</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-success/20">
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.pointsEarned}</div>
                <div className="text-xs text-muted-foreground">Points Earned</div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-foreground" />
                <div className="text-2xl font-bold">{formatTime(stats.timeSpent)}</div>
                <div className="text-xs text-muted-foreground">Time Spent</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Performance Breakdown
              </h4>
              <Badge variant={accuracy >= 75 ? "default" : "secondary"}>
                {stats.questionsCorrect}/{stats.questionsAttempted} Correct
              </Badge>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Score</span>
                <span className="font-medium">{scorePercentage}%</span>
              </div>
              <Progress value={scorePercentage} className="h-3" />
            </div>

            {/* Skill Breakdown */}
            {stats.skillBreakdown.length > 0 && (
              <div className="space-y-3 pt-2">
                {stats.skillBreakdown.map((skill) => {
                  const skillAccuracy = skill.attempted > 0
                    ? Math.round((skill.correct / skill.attempted) * 100)
                    : 0;
                  return (
                    <div key={skill.skill} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium capitalize">{skill.skill}</span>
                        <span className="text-muted-foreground">
                          {skill.correct}/{skill.attempted} ({skillAccuracy}%)
                        </span>
                      </div>
                      <Progress value={skillAccuracy} className="h-2" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 p-3 rounded-lg border-2 border-success/30">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <div className="font-medium">{stats.questionsCorrect}</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg border-2 border-destructive/30">
              <XCircle className="w-5 h-5 text-destructive" />
              <div>
                <div className="font-medium">{stats.questionsAttempted - stats.questionsCorrect}</div>
                <div className="text-xs text-muted-foreground">Incorrect</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button onClick={onContinue} className="w-full" size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Continue Practice
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={onViewDashboard} variant="outline" size="lg">
                <TrendingUp className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button onClick={onGoHome} variant="outline" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
