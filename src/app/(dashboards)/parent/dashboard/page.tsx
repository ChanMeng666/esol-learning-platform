"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { DataTable } from "@/components/data-table/data-table";
import { ClassScheduleCalendar } from "@/components/calendar/fullcalendar-schedule";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  BookOpen,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Calendar,
  Award,
  Eye,
  Activity,
  Target,
  FileText,
  XCircle,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { type ColumnDef } from "@tanstack/react-table";

// Define columns for children data table
const childrenColumns = [
  {
    accessorKey: "name",
    header: "Child Name",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "avgScore",
    header: "Average Score",
  },
  {
    accessorKey: "attendance",
    header: "Attendance",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
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

export default function ParentDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with real API calls
  const [children] = useState<any[]>([
    {
      id: "1",
      name: "Alice Johnson",
      grade: "Grade 5",
      class: "5A",
      avgScore: "85%",
      attendance: "95%",
      status: "active",
      gradeLevel: 5,
      className: "5A",
      averageScore: 85,
      avatar: "/avatars/alice.jpg",
      cefrLevel: "B1",
      level: "Level 3",
      progress: 75,
      lastActive: "2 hours ago"
    },
    {
      id: "2",
      name: "Bob Johnson",
      grade: "Grade 3",
      class: "3B",
      avgScore: "78%",
      attendance: "92%",
      status: "active",
      gradeLevel: 3,
      className: "3B",
      averageScore: 78,
      avatar: "/avatars/bob.jpg",
      cefrLevel: "A2",
      level: "Level 2",
      progress: 62,
      lastActive: "1 day ago"
    }
  ]);

  // Selected child for detailed view
  const [selectedChild, setSelectedChild] = useState(children[0]);

  // Mock activity log
  const [activityData] = useState<ActivityLog[]>([
    {
      id: "1",
      childName: "Alice Johnson",
      action: "Completed Practice",
      details: "Finished Level 3 Reading Exercise with 85% accuracy",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "practice"
    },
    {
      id: "2",
      childName: "Bob Johnson",
      action: "Achievement Unlocked",
      details: "Earned 'Consistent Learner' badge - 7 day streak!",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: "achievement"
    },
    {
      id: "3",
      childName: "Alice Johnson",
      action: "Test Completed",
      details: "NZCEL Diagnostic Test - Score: 78/100",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: "test"
    }
  ]);

  const [assignments] = useState<any[]>([
    {
      id: "1",
      title: "Math Homework Week 10",
      childName: "Alice Johnson",
      subject: "Mathematics",
      status: "completed",
      dueDate: "2024-03-20"
    },
    {
      id: "2",
      title: "Science Project",
      childName: "Bob Johnson",
      subject: "Science",
      status: "in_progress",
      dueDate: "2024-03-25"
    },
    {
      id: "3",
      title: "English Essay",
      childName: "Alice Johnson",
      subject: "English",
      status: "not_started",
      dueDate: "2024-03-28"
    }
  ]);

  const [messages] = useState<any[]>([
    {
      id: "1",
      subject: "Alice's Progress Update",
      teacherName: "Ms. Smith",
      date: "2 hours ago",
      read: false,
      preview: "Alice has been showing excellent progress in Mathematics..."
    },
    {
      id: "2",
      subject: "Parent-Teacher Conference Reminder",
      teacherName: "Mr. Brown",
      date: "1 day ago",
      read: true,
      preview: "Just a reminder about the upcoming parent-teacher conference..."
    }
  ]);

  // Calculate statistics
  const totalChildren = children.length;
  const completedAssignments = assignments.filter((a) => a.status === "completed").length;
  const pendingAssignments = assignments.filter((a) => a.status === "in_progress").length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  const mockTrends = {
    children: { value: 0, label: "no change" },
    completed: { value: 15.2, label: "vs last week" },
    pending: { value: -5.1, label: "vs last week" },
    messages: { value: 3, label: "new today" },
  };

  // Mock progress data for charts
  const progressData = [
    { date: "Week 1", alice: 72, bob: 65 },
    { date: "Week 2", alice: 75, bob: 68 },
    { date: "Week 3", alice: 78, bob: 70 },
    { date: "Week 4", alice: 82, bob: 74 },
    { date: "Week 5", alice: 85, bob: 78 },
  ];

  const skillsData = [
    { skill: "Listening", alice: 88, bob: 75 },
    { skill: "Speaking", alice: 82, bob: 80 },
    { skill: "Reading", alice: 90, bob: 85 },
    { skill: "Writing", alice: 78, bob: 72 },
    { skill: "Grammar", alice: 85, bob: 76 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Child Selector */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your children's learning progress and communicate with teachers
          </p>
        </div>

        {/* Child Selector */}
        <div className="flex items-center gap-2">
          {children.map(child => (
            <Button
              key={child.id}
              variant={selectedChild.id === child.id ? "default" : "outline"}
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

      {/* Simplified Tabs - Only Core Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Progress</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="h-4 w-4" />
            <span>Recent Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="My Children"
              value={totalChildren}
              description="Currently enrolled"
              icon={Users}
              trend={mockTrends.children}
              variant="info"
            />
            <StatCard
              title="Completed Tasks"
              value={completedAssignments}
              description="This month"
              icon={CheckCircle2}
              trend={mockTrends.completed}
              variant="success"
            />
            <StatCard
              title="Pending Tasks"
              value={pendingAssignments}
              description="Due this week"
              icon={Clock}
              trend={mockTrends.pending}
              variant="warning"
            />
            <StatCard
              title="Unread Messages"
              value={unreadMessages}
              description="From teachers"
              icon={MessageCircle}
              trend={mockTrends.messages}
              variant="primary"
              footer={{
                label: "View Messages",
                sublabel: "→"
              }}
            />
          </div>

          {/* Charts Row */}
          {children.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Progress</CardTitle>
                  <CardDescription>Weekly performance trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Charts feature coming soon
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Skills Overview</CardTitle>
                  <CardDescription>Performance across different skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Charts feature coming soon
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Children Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Children</CardTitle>
                    <CardDescription>Academic progress overview</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("children")}
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/parent/children/${child.id}`)}
                    >
                      <div className="space-y-1">
                        <h4 className="font-semibold leading-none">{child.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Grade {child.gradeLevel} • {child.className}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {child.averageScore}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Assignments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Assignments</CardTitle>
                    <CardDescription>Latest assignment updates</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("assignments")}
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignments.slice(0, 3).map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/parent/assignments/${assignment.id}`)}
                    >
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold leading-none">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {assignment.childName} • {assignment.subject}
                        </p>
                      </div>
                      <Badge
                        variant={
                          assignment.status === "completed"
                            ? "default"
                            : assignment.status === "in_progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {assignment.status === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {assignment.status === "in_progress" && <Clock className="w-3 h-3 mr-1" />}
                        {assignment.status === "not_started" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {assignment.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>


        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
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
        <TabsContent value="activity" className="space-y-6">
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

      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for parents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Button
              onClick={() => router.push("/parent/children")}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Users className="h-5 w-5" />
              <span className="text-xs">My Children</span>
            </Button>

            <Button
              onClick={() => router.push("/parent/activity")}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Activity className="h-5 w-5" />
              <span className="text-xs">Activity</span>
            </Button>

            <Button
              onClick={() => router.push("/parent/assignments")}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs">Assignments</span>
            </Button>

            <Button
              onClick={() => router.push("/parent/communication")}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">Messages</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}