"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { LearningTimeChart } from "@/components/charts/learning-time-chart";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useContainerQuery } from "@/hooks/use-container-query";
import {
  Users,
  TrendingUp,
  Calendar,
  Bell,
  BookOpen,
  Award,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MessageSquare,
  FileText,
  Activity
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

// Mock data for children (in production, this would come from server)
const mockChildren = [
  {
    id: "1",
    name: "Emma Johnson",
    avatar: "/avatars/emma.jpg",
    level: "Level 3",
    cefrLevel: "B1",
    progress: 75,
    lastActive: "2 hours ago",
    status: "online"
  },
  {
    id: "2",
    name: "Michael Johnson",
    avatar: "/avatars/michael.jpg",
    level: "Level 2",
    cefrLevel: "A2",
    progress: 62,
    lastActive: "1 day ago",
    status: "offline"
  }
];

// Activity log data structure
interface ActivityLog {
  id: string;
  childName: string;
  action: string;
  details: string;
  timestamp: Date;
  type: "achievement" | "practice" | "test" | "alert";
}

// Mock activity log
const mockActivityLog: ActivityLog[] = [
  {
    id: "1",
    childName: "Emma Johnson",
    action: "Completed Practice",
    details: "Finished Level 3 Reading Exercise with 85% accuracy",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "practice"
  },
  {
    id: "2",
    childName: "Michael Johnson",
    action: "Achievement Unlocked",
    details: "Earned 'Consistent Learner' badge - 7 day streak!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: "achievement"
  },
  {
    id: "3",
    childName: "Emma Johnson",
    action: "Test Completed",
    details: "NZCEL Diagnostic Test - Score: 78/100",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: "test"
  }
];

// Columns for activity table
const activityColumns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "childName",
    header: "Child",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("childName")}</div>
    )
  },
  {
    accessorKey: "action",
    header: "Activity",
    cell: ({ row }) => {
      const type = row.original.type;
      const icons = {
        achievement: <Award className="h-4 w-4 text-amber-500" />,
        practice: <BookOpen className="h-4 w-4 text-blue-500" />,
        test: <FileText className="h-4 w-4 text-purple-500" />,
        alert: <AlertCircle className="h-4 w-4 text-red-500" />
      };

      return (
        <div className="flex items-center gap-2">
          {icons[type]}
          <span>{row.getValue("action")}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "details",
    header: "Details"
  },
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as Date;
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return "Just now";
    }
  }
];

export default function EnhancedParentDashboard() {
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);
  const [activityData, setActivityData] = useState(mockActivityLog);
  const { ref, isLgUp, isMdUp } = useContainerQuery<HTMLDivElement>();

  // Weekly progress data for selected child
  const weeklyProgress = [
    { date: "Mon", listening: 72, speaking: 68, reading: 75, writing: 70, overall: 71 },
    { date: "Tue", listening: 74, speaking: 70, reading: 78, writing: 72, overall: 74 },
    { date: "Wed", listening: 75, speaking: 72, reading: 80, writing: 74, overall: 75 },
    { date: "Thu", listening: 76, speaking: 73, reading: 82, writing: 75, overall: 77 },
    { date: "Fri", listening: 78, speaking: 75, reading: 85, writing: 77, overall: 79 },
    { date: "Sat", listening: 0, speaking: 0, reading: 0, writing: 0, overall: 0 },
    { date: "Sun", listening: 80, speaking: 76, reading: 86, writing: 78, overall: 80 }
  ];

  // Skill balance for selected child
  const skillBalance = [
    { skill: "Listening", current: 78, target: 85 },
    { skill: "Speaking", current: 75, target: 85 },
    { skill: "Reading", current: 85, target: 90 },
    { skill: "Writing", current: 77, target: 85 },
    { skill: "Grammar", current: 82, target: 88 },
    { skill: "Vocabulary", current: 79, target: 85 }
  ];

  // Study time data
  const studyTime = [
    { day: "Mon", time: 45, sessions: 2 },
    { day: "Tue", time: 30, sessions: 1 },
    { day: "Wed", time: 60, sessions: 3 },
    { day: "Thu", time: 25, sessions: 1 },
    { day: "Fri", time: 50, sessions: 2 },
    { day: "Sat", time: 0, sessions: 0 },
    { day: "Sun", time: 35, sessions: 2 }
  ];

  return (
    <div ref={ref} className="space-y-8 p-8 container-responsive">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your children's learning progress and achievements
          </p>
        </div>

        {/* Child Selector */}
        <div className="flex items-center gap-2">
          {mockChildren.map(child => (
            <Button
              key={child.id}
              variant={selectedChild.id === child.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChild(child)}
              className="flex items-center gap-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={child.avatar} />
                <AvatarFallback>{child.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {child.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className={`grid gap-4 ${isLgUp ? "grid-cols-4" : isMdUp ? "grid-cols-2" : "grid-cols-1"}`}>
        <StatCard
          title="Overall Progress"
          value={`${selectedChild.progress}%`}
          description={`${selectedChild.name}'s progress`}
          icon={TrendingUp}
          trend={{
            value: 5,
            label: "+5% from last week"
          }}
          variant="info"
        />

        <StatCard
          title="Current Level"
          value={selectedChild.level}
          description={`CEFR: ${selectedChild.cefrLevel}`}
          icon={Award}
          variant="success"
          footer={{
            label: "On track"
          }}
        />

        <StatCard
          title="Study Time"
          value="5.2 hrs"
          description="This week"
          icon={Clock}
          trend={{
            value: -10,
            label: "-10% from last week"
          }}
          variant="primary"
        />

        <StatCard
          title="Assignments"
          value="3/5"
          description="Completed this week"
          icon={BookOpen}
          variant="warning"
          footer={{
            label: "3 of 5 completed"
          }}
        />
      </div>

      {/* Alerts Section */}
      <div className="space-y-3">
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <strong>{selectedChild.name}</strong> has a diagnostic test scheduled for tomorrow at 3:00 PM
          </AlertDescription>
        </Alert>

        {selectedChild.progress < 70 && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>{selectedChild.name}</strong>'s progress is below target. Consider scheduling extra practice sessions.
            </AlertDescription>
          </Alert>
        )}

        {selectedChild.status === "online" && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>{selectedChild.name}</strong> is currently online and practicing
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="communication">Messages</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className={`grid gap-4 ${isLgUp ? "grid-cols-2" : "grid-cols-1"}`}>
            <ProgressLineChart
              data={weeklyProgress}
              title="Weekly Progress"
              description={`${selectedChild.name}'s skill improvement this week`}
              className="chart-container"
            />

            <SkillRadarChart
              data={skillBalance}
              title="Skill Balance"
              description="Current proficiency vs targets"
              className="chart-container"
            />
          </div>

          <LearningTimeChart
            data={studyTime}
            title="Study Time This Week"
            description="Daily learning activity"
            goalMinutes={30}
            className="chart-container"
          />
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NZCEL Progress */}
            <Card>
              <CardHeader>
                <CardTitle>NZCEL Progress</CardTitle>
                <CardDescription>New Zealand Certificate in English Language</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="text-2xl font-bold">{selectedChild.level}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Target</p>
                    <p className="text-2xl font-bold">Level 4</p>
                  </div>
                </div>
                <Progress value={selectedChild.progress} className="h-3" />
              </CardContent>
            </Card>

            {/* CEFR Progress */}
            <Card>
              <CardHeader>
                <CardTitle>CEFR Progress</CardTitle>
                <CardDescription>Common European Framework</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="text-2xl font-bold">{selectedChild.cefrLevel}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Target</p>
                    <p className="text-2xl font-bold">B2</p>
                  </div>
                </div>
                <Progress value={65} className="h-3" />
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-sm font-medium">First Place</p>
                  <p className="text-xs text-muted-foreground">Class Quiz</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="text-3xl mb-2">📚</div>
                  <p className="text-sm font-medium">100 Questions</p>
                  <p className="text-xs text-muted-foreground">Milestone</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="text-3xl mb-2">🔥</div>
                  <p className="text-sm font-medium">7 Day Streak</p>
                  <p className="text-xs text-muted-foreground">Consistency</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-sm font-medium">Perfect Score</p>
                  <p className="text-xs text-muted-foreground">Writing Test</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Track {selectedChild.name}'s learning activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={activityColumns}
                data={activityData}
              />
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-xs text-muted-foreground">Sessions completed</p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Weekly Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Total sessions</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">82%</p>
                    <p className="text-xs text-muted-foreground">Average score</p>
                  </div>
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Reading Comprehension</p>
                    <p className="text-sm text-muted-foreground">Due tomorrow</p>
                  </div>
                </div>
                <Badge>In Progress</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Speaking Practice</p>
                    <p className="text-sm text-muted-foreground">Due in 3 days</p>
                  </div>
                </div>
                <Badge variant="outline">Not Started</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border opacity-60">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/20">
                    <FileText className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Essay Writing</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
                <Badge variant="secondary">85%</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Teacher Chen</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <p className="text-sm">
                      {selectedChild.name} did an excellent job in today's speaking practice!
                      Their pronunciation has improved significantly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Ms. Johnson</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                    <p className="text-sm">
                      Please remind {selectedChild.name} to complete the reading assignment
                      before tomorrow's class. Let me know if you have any questions!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Teacher
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}