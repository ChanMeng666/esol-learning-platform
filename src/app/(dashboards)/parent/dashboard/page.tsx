"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
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
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ParentDashboardPage() {
  const router = useRouter();

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
      status: "online",
      gradeLevel: 3,
      className: "3B",
      averageScore: 78,
      avatar: "/avatars/bob.jpg",
      cefrLevel: "A2",
      level: "Level 2",
      progress: 65,
      lastActive: "Currently online"
    },
  ]);

  const [selectedChild, setSelectedChild] = useState(children[0]);

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

  // Get the most urgent alert
  const getUrgentAlert = () => {
    if (selectedChild.progress < 70) {
      return {
        type: "error",
        icon: XCircle,
        message: `${selectedChild.name}'s progress is below target. Consider scheduling extra practice sessions.`
      };
    }
    if (selectedChild.status === "online") {
      return {
        type: "success",
        icon: CheckCircle2,
        message: `${selectedChild.name} is currently online and practicing`
      };
    }
    return {
      type: "warning",
      icon: AlertCircle,
      message: `${selectedChild.name} has a diagnostic test scheduled for tomorrow at 3:00 PM`
    };
  };

  const urgentAlert = getUrgentAlert();

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Child Selector */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your children's learning progress
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

      {/* Single Most Important Alert */}
      <Alert className={`
        ${urgentAlert.type === 'error' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
          urgentAlert.type === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-900/20' :
          'border-amber-200 bg-amber-50 dark:bg-amber-900/20'}
      `}>
        <urgentAlert.icon className={`h-4 w-4
          ${urgentAlert.type === 'error' ? 'text-red-600' :
            urgentAlert.type === 'success' ? 'text-green-600' :
            'text-amber-600'}`}
        />
        <AlertDescription>{urgentAlert.message}</AlertDescription>
      </Alert>

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
        />
      </div>

      {/* Current Child Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedChild.name}'s Overview</CardTitle>
              <CardDescription>Current performance and progress</CardDescription>
            </div>
            <Badge variant="outline">{selectedChild.level}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Progress Section */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{selectedChild.progress}%</span>
                </div>
                <Progress value={selectedChild.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="font-medium">{selectedChild.avgScore}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium">{selectedChild.attendance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CEFR Level</span>
                  <span className="font-medium">{selectedChild.cefrLevel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Active</span>
                  <span className="font-medium">{selectedChild.lastActive}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <Link href="/parent/reports">
                <Button variant="outline" className="w-full justify-between group">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    View Full Progress Report
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/parent/activity">
                <Button variant="outline" className="w-full justify-between group">
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    View Activity Log
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={`/parent/dashboard/speaking-progress?child=${selectedChild.id}`}>
                <Button variant="outline" className="w-full justify-between group">
                  <span className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Speaking Progress
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Assignments and Messages Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Assignments</CardTitle>
              <Link href="/parent/assignments">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments.slice(0, 3).map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium text-sm">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.childName} • {assignment.subject}
                    </p>
                  </div>
                  <Badge
                    variant={
                      assignment.status === "completed" ? "default" :
                      assignment.status === "in_progress" ? "secondary" :
                      "outline"
                    }
                  >
                    {assignment.status === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {assignment.status === "in_progress" && <Clock className="h-3 w-3 mr-1" />}
                    {assignment.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
              {assignments.length === 0 && (
                <EmptyState
                  icon={<ClipboardList className="w-16 h-16" />}
                  title="No assignments"
                  description="No assignments have been posted yet"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Teacher Messages</CardTitle>
              <Link href="/parent/communication">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.slice(0, 3).map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => router.push('/parent/communication')}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{message.subject}</p>
                      {!message.read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.teacherName} • {message.date}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                      {message.preview}
                    </p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <EmptyState
                  icon={<MessageCircle className="w-16 h-16" />}
                  title="No messages"
                  description="No messages from teachers yet"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push('/parent/children')}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs">My Children</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push('/parent/schedule')}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Schedule</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push('/parent/feedback')}
            >
              <Award className="h-5 w-5" />
              <span className="text-xs">Feedback</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push('/parent/reports')}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}