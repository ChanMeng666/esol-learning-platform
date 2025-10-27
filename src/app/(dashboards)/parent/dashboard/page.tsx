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
  FlaskConical,
  Eye,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

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
      status: "Active",
      gradeLevel: 5,
      className: "5A",
      averageScore: 85
    },
    {
      id: "2",
      name: "Bob Johnson",
      grade: "Grade 3",
      class: "3B",
      avgScore: "78%",
      attendance: "92%",
      status: "Active",
      gradeLevel: 3,
      className: "3B",
      averageScore: 78
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
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your children's learning progress and communicate with teachers
        </p>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-5 lg:grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="children" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Children</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
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

        {/* Children Tab */}
        <TabsContent value="children" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Children Details</CardTitle>
              <CardDescription>Comprehensive view of your children's academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={childrenColumns}
                data={children}
                searchKey="name"
                pageSize={10}
              />
            </CardContent>
          </Card>

          {/* Individual Child Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {children.map((child) => (
              <Card key={child.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{child.name}</CardTitle>
                    <Badge variant="outline">{child.className}</Badge>
                  </div>
                  <CardDescription>Grade {child.gradeLevel} Student</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold">{child.averageScore}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Attendance</p>
                      <p className="text-2xl font-bold">{child.attendance}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => router.push(`/parent/children/${child.id}`)}>
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => router.push(`/parent/children/${child.id}/progress`)}>
                      Progress Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>Detailed performance analytics for your children</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Overall Progress Trend</h3>
                <p className="text-xs text-muted-foreground">Monthly academic performance</p>
                <div className="flex items-center justify-center h-48 text-sm text-muted-foreground border rounded-lg">
                  Charts feature coming soon
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {children.map((child) => (
                  <Card key={child.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{child.name}'s Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground border rounded-lg">
                        Charts feature coming soon
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Assignments</CardTitle>
                  <CardDescription>Track assignment completion across all children</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {completedAssignments} Completed
                  </Badge>
                  <Badge variant="outline">
                    {pendingAssignments} Pending
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{assignment.title}</CardTitle>
                          <CardDescription>
                            {assignment.childName} • {assignment.subject}
                          </CardDescription>
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
                          {assignment.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => router.push(`/parent/assignments/${assignment.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Teacher Messages</CardTitle>
                  <CardDescription>Communication from your children's teachers</CardDescription>
                </div>
                <Button size="sm" onClick={() => router.push("/parent/messages/compose")}>
                  Compose Message
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/parent/messages/${message.id}`)}
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold leading-none">{message.subject}</h4>
                        {!message.read && (
                          <Badge variant="default" className="ml-2">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        From {message.teacherName} • {message.date}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.preview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="mt-6">
          <ClassScheduleCalendar
            organizationId={BigInt(1)}
            userId="parent-user"
            userRole="parent"
            className="w-full"
          />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and advanced features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              onClick={() => router.push("/parent/progress")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Progress Reports</div>
                <div className="text-sm text-muted-foreground mt-1">
                  View detailed progress
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/parent/messages")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Messages</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Contact teachers
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/parent/feedback")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Teacher Feedback</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Read feedback
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/parent/dashboard/enhanced-page")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <FlaskConical className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Enhanced View</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Test new features
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}