"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Target, BookOpen, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProgress } from "@/lib/store/user-progress";
import { NZCEL_LEVELS } from "@/data/nzcel-levels";

export default function DashboardPage() {
  const userProgress = useUserProgress();
  const currentLevelInfo = NZCEL_LEVELS.find((l) => l.id === userProgress.currentLevel);

  const skills = [
    { id: "listening", label: "Listening", icon: "🎧", color: "bg-blue-500" },
    { id: "speaking", label: "Speaking", icon: "🗣️", color: "bg-green-500" },
    { id: "reading", label: "Reading", icon: "📖", color: "bg-purple-500" },
    { id: "writing", label: "Writing", icon: "✍️", color: "bg-orange-500" },
  ] as const;

  const stats = [
    {
      icon: Trophy,
      label: "Total Points",
      value: userProgress.totalPoints.toLocaleString(),
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${userProgress.streak} days`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: BookOpen,
      label: "Questions Completed",
      value: userProgress.completedQuestions.length.toLocaleString(),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Award,
      label: "Badges Earned",
      value: userProgress.badges.length.toString(),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const completedAchievements = userProgress.achievements.filter((a) => a.completed);
  const inProgressAchievements = userProgress.achievements.filter((a) => !a.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-gray-600">
            Track your progress and achievements on your NZCEL journey
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-3`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Skills Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Skills Progress
                </CardTitle>
                <CardDescription>
                  Your progress across the four core English skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{skill.icon}</span>
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
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </CardTitle>
                <CardDescription>Your learning milestones</CardDescription>
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
                        className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                          <Badge variant="secondary">+{achievement.reward} pts</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={(achievement.progress / achievement.target) * 100}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {achievement.progress}/{achievement.target}
                          </span>
                        </div>
                      </div>
                    ))}
                    {inProgressAchievements.length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        All achievements completed! 🎉
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-4">
                    {completedAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="p-4 rounded-lg border bg-green-50 border-green-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Trophy className="w-5 h-5 text-green-600 mt-1" />
                            <div>
                              <h4 className="font-semibold text-green-900">{achievement.title}</h4>
                              <p className="text-sm text-green-700">{achievement.description}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-600">✓ Completed</Badge>
                        </div>
                      </div>
                    ))}
                    {completedAchievements.length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        Complete your first achievement!
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Current Level */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Badge className="mb-3 px-4 py-2 text-lg bg-gradient-to-r from-blue-500 to-purple-500">
                    {currentLevelInfo?.name || userProgress.currentLevel}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    {currentLevelInfo?.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" />
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
                        className="flex flex-col items-center p-3 rounded-lg border bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-md transition-shadow cursor-pointer"
                        title={badge.description}
                      >
                        <span className="text-3xl mb-1">{badge.icon}</span>
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
                  <p className="text-center text-gray-500 py-8 text-sm">
                    Earn badges by completing achievements!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Study Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Study Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  {userProgress.lastStudyDate ? (
                    <>
                      <p className="text-sm text-gray-600 mb-2">Last study session:</p>
                      <p className="font-semibold">
                        {new Date(userProgress.lastStudyDate).toLocaleDateString()}
                      </p>
                      <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                        <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                        <p className="text-sm font-medium">
                          {userProgress.streak} day{userProgress.streak !== 1 ? "s" : ""} streak!
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Start practicing to begin your streak!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
