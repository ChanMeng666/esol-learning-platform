"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Users,
  BookOpen,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function ParentDashboardPage() {
  const router = useRouter();

  // Mock data - replace with real API calls
  const [children] = useState<any[]>([]);
  const [assignments] = useState<any[]>([]);
  const [messages] = useState<any[]>([]);

  // Mock statistics
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your children's learning progress and communicate with teachers
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Children"
          value={totalChildren}
          description="Currently enrolled"
          icon={Users}
          trend={mockTrends.children}
          variant="primary"
        />
        <StatCard
          title="Completed Assignments"
          value={completedAssignments}
          description="This month"
          icon={CheckCircle2}
          trend={mockTrends.completed}
          variant="success"
        />
        <StatCard
          title="Pending Assignments"
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
          variant="default"
        />
      </div>

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
                onClick={() => router.push("/parent/children")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <EmptyState
                title="No children registered"
                description="Contact school admin to register your children"
              />
            ) : (
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
            )}
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
                onClick={() => router.push("/parent/assignments")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <EmptyState
                title="No assignments yet"
                description="Assignment updates will appear here"
              />
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
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
                      {assignment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Teacher Messages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Teacher Messages</CardTitle>
              <CardDescription>Communication from your children's teachers</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/parent/messages")}
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <EmptyState
              title="No messages"
              description="Messages from teachers will appear here"
            />
          ) : (
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for parents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
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
                  Read detailed feedback
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
