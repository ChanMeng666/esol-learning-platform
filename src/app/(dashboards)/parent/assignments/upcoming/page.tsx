"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAssignmentContext } from "../context";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Clock,
  Calendar,
  AlertCircle,
  BookOpen,
  FileText,
  CheckCircle2,
  TrendingUp,
  Users,
  ChevronRight,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  childName: string;
  childAvatar?: string;
  subject: string;
  teacher: string;
  status: "completed" | "in_progress" | "not_started" | "overdue";
  dueDate: Date;
  submittedDate?: Date;
  grade?: number;
  feedback?: string;
  attachments?: string[];
  type: "homework" | "project" | "quiz" | "exam";
}

export default function ParentAssignmentsUpcomingPage() {
  return (
    <ProtectedRoute>
      <UpcomingContent />
    </ProtectedRoute>
  );
}

function UpcomingContent() {
  const router = useRouter();
  const { assignments, children } = useAssignmentContext();

  // Filter upcoming assignments (not completed, due in the future or today)
  const upcomingAssignments = assignments.filter(a => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(a.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return a.status !== "completed" && dueDate >= now;
  }).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  // Group assignments by due date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() + 7);

  const todayAssignments = upcomingAssignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });

  const tomorrowAssignments = upcomingAssignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === tomorrow.getTime();
  });

  const thisWeekAssignments = upcomingAssignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate > tomorrow && dueDate <= thisWeek;
  });

  const laterAssignments = upcomingAssignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate > thisWeek;
  });

  if (upcomingAssignments.length === 0) {
    return (
      <EmptyState
        title="No upcoming assignments"
        description="All assignments have been completed or there are no new assignments"
        icon={<CheckCircle2 className="w-16 h-16 text-green-500" />}
      />
    );
  }

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
    const daysUntilDue = Math.ceil((assignment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const urgency = daysUntilDue <= 1 ? "high" : daysUntilDue <= 3 ? "medium" : "low";

    const typeIcons = {
      homework: <BookOpen className="h-4 w-4" />,
      project: <FileText className="h-4 w-4" />,
      quiz: <CheckCircle2 className="h-4 w-4" />,
      exam: <AlertCircle className="h-4 w-4" />,
    };

    return (
      <Card
        className={`cursor-pointer hover:shadow-md transition-all ${
          urgency === "high" ? "border-red-200 dark:border-red-900" :
          urgency === "medium" ? "border-amber-200 dark:border-amber-900" :
          ""
        }`}
        onClick={() => router.push(`/parent/assignments/${assignment.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {typeIcons[assignment.type]}
                <h4 className="font-medium">{assignment.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{assignment.description}</p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={assignment.childAvatar} />
                    <AvatarFallback>{assignment.childName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span>{assignment.childName}</span>
                </div>
                <Badge variant="outline">{assignment.subject}</Badge>
                <Badge variant={
                  assignment.status === "in_progress" ? "secondary" :
                  assignment.status === "not_started" ? "outline" :
                  "destructive"
                }>
                  {assignment.status.replace("_", " ")}
                </Badge>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className={`text-lg font-bold ${
                urgency === "high" ? "text-red-600" :
                urgency === "medium" ? "text-amber-600" :
                "text-muted-foreground"
              }`}>
                {daysUntilDue === 0 ? "Today" :
                 daysUntilDue === 1 ? "Tomorrow" :
                 `${daysUntilDue} days`}
              </div>
              <p className="text-xs text-muted-foreground">
                {assignment.dueDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Urgency Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Today</p>
                <p className="text-2xl font-bold text-red-600">{todayAssignments.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Tomorrow</p>
                <p className="text-2xl font-bold text-amber-600">{tomorrowAssignments.length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{thisWeekAssignments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Assignments */}
      {todayAssignments.length > 0 && (
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Due Today
            </CardTitle>
            <CardDescription>
              These assignments need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tomorrow's Assignments */}
      {tomorrowAssignments.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Due Tomorrow
            </CardTitle>
            <CardDescription>
              Assignments due in the next 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tomorrowAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* This Week's Assignments */}
      {thisWeekAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Due This Week</CardTitle>
            <CardDescription>
              Assignments due in the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {thisWeekAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Later Assignments */}
      {laterAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Later</CardTitle>
            <CardDescription>
              Assignments due after this week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {laterAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Workload by Child */}
      <Card>
        <CardHeader>
          <CardTitle>Workload Distribution</CardTitle>
          <CardDescription>
            Upcoming assignments per child
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {children.map(child => {
            const childAssignments = upcomingAssignments.filter(a => a.childName === child.name);
            const percentage = upcomingAssignments.length > 0
              ? Math.round((childAssignments.length / upcomingAssignments.length) * 100)
              : 0;

            return (
              <div key={child.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={child.avatar} />
                      <AvatarFallback>{child.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{child.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {childAssignments.length} assignment{childAssignments.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}