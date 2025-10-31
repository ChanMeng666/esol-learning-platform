"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DataTable } from "@/components/data-table/data-table";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  GraduationCap,
  Target,
  Activity,
  ChevronRight,
  School,
  CheckCircle2,
  AlertCircle,
  Globe,
  BarChart3,
} from "lucide-react";

export default function ParentChildrenPage() {
  return (
    <ProtectedRoute>
      <ChildrenPageContent />
    </ProtectedRoute>
  );
}

function ChildrenPageContent() {
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChildren = async () => {
      try {
        // Mock data - replace with actual API call
        const mockChildren = [
          {
            id: "1",
            name: "Alice Johnson",
            avatar: "/avatars/alice.jpg",
            grade: "Grade 5",
            class: "5A",
            teacher: "Ms. Smith",
            nzcelLevel: "Level 3",
            cefrLevel: "B1",
            averageScore: 85,
            attendance: 95,
            lastActive: "2 hours ago",
            status: "online",
            skills: {
              listening: 88,
              speaking: 82,
              reading: 90,
              writing: 78,
            },
            recentAchievements: [
              { id: "1", name: "7 Day Streak", icon: "🔥", date: new Date() },
              { id: "2", name: "Perfect Score", icon: "⭐", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            ],
            upcomingTasks: [
              { id: "1", title: "English Essay", dueDate: "Tomorrow", subject: "English" },
              { id: "2", title: "Math Homework", dueDate: "Friday", subject: "Mathematics" },
            ],
          },
          {
            id: "2",
            name: "Bob Johnson",
            avatar: "/avatars/bob.jpg",
            grade: "Grade 3",
            class: "3B",
            teacher: "Mr. Brown",
            nzcelLevel: "Level 2",
            cefrLevel: "A2",
            averageScore: 78,
            attendance: 92,
            lastActive: "1 day ago",
            status: "offline",
            skills: {
              listening: 75,
              speaking: 80,
              reading: 85,
              writing: 72,
            },
            recentAchievements: [
              { id: "1", name: "100 Questions", icon: "📚", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            ],
            upcomingTasks: [
              { id: "1", title: "Science Project", dueDate: "Next Week", subject: "Science" },
            ],
          },
        ];

        setChildren(mockChildren);
        setSelectedChild(mockChildren[0]);
      } catch (error) {
        console.error("Failed to load children:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChildren();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading children information...</p>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <EmptyState
        title="No Children Found"
        description="No children are linked to your account"
        icon={<Users className="w-16 h-16" />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Child Selector */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">My Children</h1>
          <p className="text-muted-foreground">
            Monitor academic progress and achievements
          </p>
        </div>

        {/* Child Selector */}
        <div className="flex items-center gap-2">
          {children.map(child => (
            <Button
              key={child.id}
              variant={selectedChild?.id === child.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChild(child)}
              className="flex items-center gap-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={child.avatar} />
                <AvatarFallback>{child.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {child.name}
            </Button>
          ))}
        </div>
      </div>

      {selectedChild && (
        <>
          {/* Selected Child Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Child Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedChild.avatar} />
                    <AvatarFallback>{selectedChild.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedChild.name}</CardTitle>
                    <CardDescription>
                      {selectedChild.grade} • {selectedChild.class}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Teacher</span>
                    <span className="text-sm font-medium">{selectedChild.teacher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">NZCEL Level</span>
                    <Badge variant="secondary">{selectedChild.nzcelLevel}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">CEFR Level</span>
                    <Badge variant="secondary">{selectedChild.cefrLevel}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={selectedChild.status === "online" ? "default" : "outline"}>
                      {selectedChild.status === "online" ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {selectedChild.lastActive}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold">{selectedChild.averageScore}%</p>
                      <p className="text-xs text-muted-foreground">Average Score</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{selectedChild.attendance}%</p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => router.push(`/parent/children/${selectedChild.id}/details`)}
                >
                  View Full Profile
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Skills Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Skills Performance</CardTitle>
                <CardDescription>Current proficiency levels across all skills</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkillRadarChart
                  data={[
                    { skill: "Listening", current: selectedChild.skills.listening, target: 85 },
                    { skill: "Speaking", current: selectedChild.skills.speaking, target: 85 },
                    { skill: "Reading", current: selectedChild.skills.reading, target: 90 },
                    { skill: "Writing", current: selectedChild.skills.writing, target: 85 },
                  ]}
                  title="Language Skills"
                  description="Performance vs targets"
                />
                <div className="space-y-4">
                  {Object.entries(selectedChild.skills).map(([skill, value]) => (
                    <div key={skill}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{skill}</span>
                        <span className="font-medium">{value as number}%</span>
                      </div>
                      <Progress value={value as number} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements & Upcoming Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Achievements</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/parent/children/${selectedChild.id}/achievements`)}
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedChild.recentAchievements.length > 0 ? (
                  <div className="space-y-3">
                    {selectedChild.recentAchievements.map((achievement: any) => (
                      <div key={achievement.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {achievement.date.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Award className="w-5 h-5 text-amber-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent achievements
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/parent/assignments")}
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedChild.upcomingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedChild.upcomingTasks.map((task: any) => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-primary/10">
                            <BookOpen className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.subject}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {task.dueDate}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming tasks
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Children Table */}
          {children.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>All Children Overview</CardTitle>
                <CardDescription>Compare progress across all your children</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {children.map(child => (
                    <Card
                      key={child.id}
                      className={`cursor-pointer transition-all ${selectedChild?.id === child.id ? 'ring-2 ring-primary' : 'hover:shadow-lg'}`}
                      onClick={() => setSelectedChild(child)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar>
                            <AvatarImage src={child.avatar} />
                            <AvatarFallback>{child.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{child.name}</p>
                            <p className="text-sm text-muted-foreground">{child.class}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Average</span>
                            <span className="font-medium">{child.averageScore}%</span>
                          </div>
                          <Progress value={child.averageScore} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}