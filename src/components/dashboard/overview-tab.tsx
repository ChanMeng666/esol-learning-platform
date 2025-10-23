"use client";

import { useEffect, useState } from "react";
import { Trophy, Clock, BookOpen, TrendingUp, Mic, GraduationCap, Globe, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getAggregatedStats } from "@/actions/module-stats";

interface ModuleProgressData {
  moduleType: string;
  totalTime: number;
  questionsCompleted: number;
  pointsEarned: number;
  lastAccessed: Date | null;
}

interface ProgressData {
  currentLevel: string;
  targetLevel: string | null;
  totalPoints: number;
  questionsCompleted?: number;
}

interface AggregatedStats {
  totalPoints: number;
  totalTime: number;
  totalQuestions: number;
  modules: ModuleProgressData[];
  nzcel: ProgressData | null;
  cefr: ProgressData | null;
  speaking: {
    totalSessions: number;
    completedSessions: number;
    totalTurns: number;
    averageDuration: number;
  };
  mostActiveModule: ModuleProgressData | null;
}

export function OverviewTab() {
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAggregatedStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load aggregated stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Format time in hours and minutes
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Module configurations
  const moduleConfigs = {
    general: {
      name: "General Practice",
      icon: Globe,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    nzcel: {
      name: "NZCEL Exam Prep",
      icon: GraduationCap,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    speaking: {
      name: "AI Speaking Coach",
      icon: Mic,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  };

  // Get module data with defaults
  const getModuleData = (type: string) => {
    return stats.modules.find(m => m.moduleType === type) || {
      moduleType: type,
      totalTime: 0,
      questionsCompleted: 0,
      pointsEarned: 0,
      lastAccessed: null,
    };
  };

  const generalModule = getModuleData("general");
  const nzcelModule = getModuleData("nzcel");

  // Calculate total possible points for progress bar
  const totalPossiblePoints = Math.max(stats.totalPoints, 1000);
  const pointsProgress = (stats.totalPoints / totalPossiblePoints) * 100;

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6">
            <Trophy className="w-8 h-8 text-primary mb-3" />
            <p className="text-3xl font-bold mb-1">{stats.totalPoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
            <Progress value={pointsProgress} className="h-2 mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Clock className="w-8 h-8 text-primary mb-3" />
            <p className="text-3xl font-bold mb-1">{formatTime(stats.totalTime)}</p>
            <p className="text-sm text-muted-foreground">Total Study Time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <BookOpen className="w-8 h-8 text-primary mb-3" />
            <p className="text-3xl font-bold mb-1">{stats.totalQuestions.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Questions Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Modules Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Learning Modules
          </CardTitle>
          <CardDescription>Your activity across different learning paths</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {/* General Practice Module */}
            <Card className="border-2 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${moduleConfigs.general.bgColor}`}>
                    <Globe className={`w-6 h-6 ${moduleConfigs.general.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">General Practice</h4>
                    <p className="text-xs text-muted-foreground">CEFR A1-C2</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-semibold">{generalModule.pointsEarned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-semibold">{generalModule.questionsCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-semibold">{formatTime(generalModule.totalTime)}</span>
                  </div>
                  {generalModule.lastAccessed && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Last: {new Date(generalModule.lastAccessed).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* NZCEL Module */}
            <Card className="border-2 hover:border-green-500/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${moduleConfigs.nzcel.bgColor}`}>
                    <GraduationCap className={`w-6 h-6 ${moduleConfigs.nzcel.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">NZCEL Prep</h4>
                    <p className="text-xs text-muted-foreground">13 Levels</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-semibold">{nzcelModule.pointsEarned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-semibold">{nzcelModule.questionsCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-semibold">{formatTime(nzcelModule.totalTime)}</span>
                  </div>
                  {nzcelModule.lastAccessed && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Last: {new Date(nzcelModule.lastAccessed).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Speaking Module */}
            <Card className="border-2 hover:border-blue-500/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${moduleConfigs.speaking.bgColor}`}>
                    <Mic className={`w-6 h-6 ${moduleConfigs.speaking.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Speaking Coach</h4>
                    <p className="text-xs text-muted-foreground">AI-Powered</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="font-semibold">{stats.speaking.totalSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-semibold">{stats.speaking.completedSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Turns</span>
                    <span className="font-semibold">{stats.speaking.totalTurns}</span>
                  </div>
                  {stats.speaking.averageDuration > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Avg: {formatTime(stats.speaking.averageDuration)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Most Active Module */}
      {stats.mostActiveModule && (
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Most Active Module
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  {moduleConfigs[stats.mostActiveModule.moduleType as keyof typeof moduleConfigs]?.name || stats.mostActiveModule.moduleType}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Last accessed: {stats.mostActiveModule.lastAccessed
                    ? new Date(stats.mostActiveModule.lastAccessed).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {stats.mostActiveModule.pointsEarned} points
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Summary</CardTitle>
          <CardDescription>Your overall learning progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">CEFR Progress</h4>
              {stats.cefr ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Level</span>
                    <Badge>{stats.cefr.currentLevel}</Badge>
                  </div>
                  {stats.cefr.targetLevel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Target Level</span>
                      <Badge variant="outline">{stats.cefr.targetLevel}</Badge>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-semibold">{stats.cefr.totalPoints}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No CEFR progress yet</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-3">NZCEL Progress</h4>
              {stats.nzcel ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Level</span>
                    <Badge>{stats.nzcel.currentLevel}</Badge>
                  </div>
                  {stats.nzcel.targetLevel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Target Level</span>
                      <Badge variant="outline">{stats.nzcel.targetLevel}</Badge>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-semibold">{stats.nzcel.totalPoints}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No NZCEL progress yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
