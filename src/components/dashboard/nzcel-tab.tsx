"use client";

import { useRouter } from "next/navigation";
import { Trophy, Flame, Target, BookOpen, Award, Calendar, CheckCircle, Headphones, Mic, PenTool, PlayCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProgress } from "@/lib/store/user-progress";
import { NZCEL_LEVELS } from "@/data/nzcel-levels";
import { SkillRadarChart } from "@/components/dashboard/skill-radar-chart";
import { ProgressLineChart } from "@/components/dashboard/progress-line-chart";

export function NZCELTab() {
  const router = useRouter();
  const userProgress = useUserProgress();
  const currentLevelInfo = NZCEL_LEVELS.find((l) => l.id === userProgress.currentLevel);

  const skills = [
    { id: "listening", label: "Listening", icon: Headphones },
    { id: "speaking", label: "Speaking", icon: Mic },
    { id: "reading", label: "Reading", icon: BookOpen },
    { id: "writing", label: "Writing", icon: PenTool },
  ] as const;

  const completedAchievements = userProgress.achievements.filter((a) => a.completed);
  const inProgressAchievements = userProgress.achievements.filter((a) => !a.completed);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-2 justify-end">
        <Button onClick={() => router.push("/practice/nzcel/skills")} variant="default">
          <PlayCircle className="mr-2 h-4 w-4" />
          Practice Skills
        </Button>
        <Button onClick={() => router.push("/practice/nzcel/conversation")} variant="outline">
          <Mic className="mr-2 h-4 w-4" />
          Conversation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <Trophy className="w-6 h-6 text-primary mb-3" />
            <p className="text-2xl font-bold mb-1">{userProgress.totalPoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Flame className="w-6 h-6 text-primary mb-3" />
            <p className="text-2xl font-bold mb-1">{userProgress.streak} days</p>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <BookOpen className="w-6 h-6 text-primary mb-3" />
            <p className="text-2xl font-bold mb-1">{userProgress.completedQuestions.length.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Award className="w-6 h-6 text-primary mb-3" />
            <p className="text-2xl font-bold mb-1">{userProgress.badges.length}</p>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualization Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkillRadarChart />
        <ProgressLineChart />
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Skills Progress */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Skills Progress
              </CardTitle>
              <CardDescription>
                Progress by skill (NZCEL framework)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <skill.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{skill.label}</span>
                      </div>
                      <Badge variant="outline">
                        {userProgress.skillProgress[skill.id]}%
                      </Badge>
                    </div>
                    <Progress
                      value={userProgress.skillProgress[skill.id]}
                      className="h-3"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Achievements
              </CardTitle>
              <CardDescription>Learning milestones for NZCEL</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="in-progress" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="in-progress">
                    In Progress ({inProgressAchievements.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({completedAchievements.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="in-progress" className="space-y-4 mt-4">
                  {inProgressAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant="secondary">+{achievement.reward} pts</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={(achievement.progress / achievement.target) * 100}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                    </div>
                  ))}
                  {inProgressAchievements.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      All achievements completed!
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4 mt-4">
                  {completedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1" />
                          <div>
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                    </div>
                  ))}
                  {completedAchievements.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Complete your first achievement!
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Level */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg">Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Badge className="mb-3 px-4 py-2 text-lg">
                  {currentLevelInfo?.name || userProgress.currentLevel}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {currentLevelInfo?.description}
                </p>
                {currentLevelInfo?.strategicPurpose && (
                  <div className="mt-4 p-3 rounded-lg bg-muted text-left">
                    <p className="text-xs font-semibold mb-1">Strategic Purpose</p>
                    <p className="text-xs text-muted-foreground">{currentLevelInfo.strategicPurpose}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Badges
              </CardTitle>
              <CardDescription>
                {userProgress.badges.length} earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProgress.badges.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {userProgress.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex flex-col items-center p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                      title={badge.description}
                    >
                      <Award className="h-8 w-8 text-primary mb-1" />
                      <span className="text-xs text-center font-medium line-clamp-2">
                        {badge.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="mt-2 text-xs px-1"
                      >
                        {badge.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  Earn badges by completing achievements!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Study Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Study Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                {userProgress.lastStudyDate ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">Last study session:</p>
                    <p className="font-semibold">
                      {new Date(userProgress.lastStudyDate).toLocaleDateString()}
                    </p>
                    <div className="mt-4 p-3 rounded-lg border bg-gradient-to-br from-orange-500/10 to-red-500/10">
                      <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                      <p className="text-sm font-medium">
                        {userProgress.streak} day{userProgress.streak !== 1 ? "s" : ""} streak!
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Start practicing to build your streak
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
