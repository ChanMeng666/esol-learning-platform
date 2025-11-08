"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useUserProgress } from "@/lib/store/user-progress";
import type { Badge as UserBadge } from "@/types";
import {
  Award,
  Trophy,
  Target,
  Crown,
  Star,
  Shield,
  Flame,
  BookOpen,
  CheckCircle2,
  Lock
} from "lucide-react";

// Import Server Actions
import { getUserProgress, getAchievements } from "@/actions/user-progress";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "skill" | "milestone" | "streak" | "special";
  icon: React.ElementType;
  progress: number;
  target: number;
  points: number;
  unlockedAt?: Date;
  tier?: "bronze" | "silver" | "gold" | "platinum";
}

export default function StudentAchievementsPage() {
  return (
    <ProtectedRoute>
      <AchievementsPageContent />
    </ProtectedRoute>
  );
}

function AchievementsPageContent() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userProgress = useUserProgress();

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const [progressData, achievementsData] = await Promise.all([
          getUserProgress(),
          getAchievements()
        ]);

        // Map achievements with icons and additional metadata
        const enrichedAchievements = userProgress.achievements.map(a => ({
          ...a,
          icon: getAchievementIcon(a.id),
          category: getAchievementCategory(a.id),
          points: getAchievementPoints(a.id),
          tier: getAchievementTier(a.progress, a.target)
        }));

        setAchievements(enrichedAchievements);
        setBadges(userProgress.badges);
      } catch (error) {
        console.error("Failed to load achievements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, [userProgress.achievements, userProgress.badges]);

  const getAchievementIcon = (id: string): React.ElementType => {
    const icons: Record<string, React.ElementType> = {
      "first-question": BookOpen,
      "ten-questions": Target,
      "fifty-questions": Trophy,
      "hundred-questions": Crown,
      "week-streak": Flame,
      "perfect-ten": Star
    };
    return icons[id] || Award;
  };

  const getAchievementCategory = (id: string): Achievement["category"] => {
    if (id.includes("streak")) return "streak";
    if (id.includes("perfect")) return "special";
    if (id.includes("question")) return "milestone";
    return "skill";
  };

  const getAchievementPoints = (id: string): number => {
    const points: Record<string, number> = {
      "first-question": 10,
      "ten-questions": 50,
      "fifty-questions": 200,
      "hundred-questions": 500,
      "week-streak": 100,
      "perfect-ten": 150
    };
    return points[id] || 0;
  };

  const getAchievementTier = (progress: number, target: number): Achievement["tier"] => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return "platinum";
    if (percentage >= 75) return "gold";
    if (percentage >= 50) return "silver";
    return "bronze";
  };

  const getTierColor = (tier?: Achievement["tier"]) => {
    switch (tier) {
      case "platinum": return "text-purple-600 dark:text-purple-400";
      case "gold": return "text-yellow-600 dark:text-yellow-400";
      case "silver": return "text-gray-500 dark:text-gray-400";
      case "bronze": return "text-orange-600 dark:text-orange-400";
      default: return "text-muted-foreground";
    }
  };

  const getRarityColor = (rarity: UserBadge["rarity"]) => {
    switch (rarity) {
      case "legendary": return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "epic": return "bg-gradient-to-r from-purple-600 to-blue-600 text-white";
      case "rare": return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "common": return "bg-gray-100 dark:bg-gray-800";
      default: return "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  const completedAchievements = achievements.filter(a => a.progress >= a.target);
  const inProgressAchievements = achievements.filter(a => a.progress < a.target);
  const totalPoints = achievements
    .filter(a => a.progress >= a.target)
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Achievements & Badges</h1>
        <p className="text-muted-foreground">
          Track your learning milestones
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                <p className="text-3xl font-bold mt-1">{totalPoints.toLocaleString()}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-3xl font-bold mt-1">
                  {completedAchievements.length}/{achievements.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                <p className="text-3xl font-bold mt-1">{badges.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold mt-1">{userProgress.streak || 0} days</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-6 space-y-8">
          {/* In Progress Section */}
          {inProgressAchievements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">In Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Card key={achievement.id} className="relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full bg-muted ${getTierColor(achievement.tier)}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {achievement.description}
                            </p>
                            <div className="mt-3 space-y-2">
                              <Progress
                                value={(achievement.progress / achievement.target) * 100}
                                className="h-2"
                              />
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">
                                  {achievement.progress}/{achievement.target}
                                </span>
                                <span className="font-medium">
                                  +{achievement.points} pts
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Section */}
          {completedAchievements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Completed</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Card
                      key={achievement.id}
                      className="relative overflow-hidden border-primary/20 bg-primary/5"
                    >
                      <div className="absolute top-0 right-0 p-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full bg-primary/10 ${getTierColor(achievement.tier)}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {achievement.description}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                Completed
                              </Badge>
                              <span className="text-xs font-medium text-primary">
                                +{achievement.points} pts
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {achievements.length === 0 && (
            <Card className="p-12 text-center">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No achievements yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Start practicing to unlock your first achievement!
              </p>
              <Button className="mt-4" onClick={() => window.location.href = "/practice"}>
                Start Learning
              </Button>
            </Card>
          )}
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="mt-6">
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <Card key={badge.id} className="text-center hover:scale-105 transition-transform">
                  <CardContent className="p-4">
                    <div className={`text-4xl mb-2 p-3 rounded-full inline-block ${getRarityColor(badge.rarity)}`}>
                      {badge.icon}
                    </div>
                    <h4 className="font-semibold text-sm">{badge.name}</h4>
                    <Badge variant="outline" className="mt-2 text-xs capitalize">
                      {badge.rarity}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      {badge.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No badges earned yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Complete achievements to earn your first badge!
              </p>
              <Button className="mt-4" onClick={() => window.location.href = "/practice"}>
                Start Learning
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
