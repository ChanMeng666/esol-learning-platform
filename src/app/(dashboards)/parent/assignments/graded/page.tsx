"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAssignmentContext } from "../layout";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import {
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  FileText,
  Users,
  Target,
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

export default function ParentAssignmentsGradedPage() {
  return (
    <ProtectedRoute>
      <GradedContent />
    </ProtectedRoute>
  );
}

function GradedContent() {
  const { assignments, children } = useAssignmentContext();

  // Filter graded assignments (completed with grades)
  const gradedAssignments = assignments.filter(a => a.status === "completed" && a.grade !== undefined)
    .sort((a, b) => (b.submittedDate?.getTime() || 0) - (a.submittedDate?.getTime() || 0));

  if (gradedAssignments.length === 0) {
    return (
      <EmptyState
        title="No graded assignments yet"
        description="Completed assignments with grades will appear here"
        icon={<FileText className="w-16 h-16 text-gray-400" />}
      />
    );
  }

  // Calculate statistics
  const averageGrade = Math.round(
    gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / gradedAssignments.length
  );

  const highestGrade = Math.max(...gradedAssignments.map(a => a.grade || 0));
  const lowestGrade = Math.min(...gradedAssignments.map(a => a.grade || 0));

  // Grade distribution
  const gradeRanges = [
    { range: "90-100", label: "A", count: gradedAssignments.filter(a => (a.grade || 0) >= 90).length },
    { range: "80-89", label: "B", count: gradedAssignments.filter(a => (a.grade || 0) >= 80 && (a.grade || 0) < 90).length },
    { range: "70-79", label: "C", count: gradedAssignments.filter(a => (a.grade || 0) >= 70 && (a.grade || 0) < 80).length },
    { range: "60-69", label: "D", count: gradedAssignments.filter(a => (a.grade || 0) >= 60 && (a.grade || 0) < 70).length },
    { range: "0-59", label: "F", count: gradedAssignments.filter(a => (a.grade || 0) < 60).length },
  ];

  // Performance by subject
  const subjectPerformance = Array.from(new Set(gradedAssignments.map(a => a.subject)))
    .map(subject => {
      const subjectAssignments = gradedAssignments.filter(a => a.subject === subject);
      const avgGrade = Math.round(
        subjectAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / subjectAssignments.length
      );
      return { subject, avgGrade, count: subjectAssignments.length };
    })
    .sort((a, b) => b.avgGrade - a.avgGrade);

  // Recent grades trend data
  const recentGrades = gradedAssignments.slice(0, 7).reverse();
  const trendData = recentGrades.map((a, index) => ({
    date: `Assignment ${index + 1}`,
    grade: a.grade || 0,
    average: averageGrade,
  }));

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-amber-600";
    if (grade >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeBadge = (grade: number) => {
    if (grade >= 90) return { label: "A", variant: "default" as const };
    if (grade >= 80) return { label: "B", variant: "secondary" as const };
    if (grade >= 70) return { label: "C", variant: "outline" as const };
    if (grade >= 60) return { label: "D", variant: "outline" as const };
    return { label: "F", variant: "destructive" as const };
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
                <p className={`text-2xl font-bold ${getGradeColor(averageGrade)}`}>{averageGrade}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Highest Grade</p>
                <p className={`text-2xl font-bold ${getGradeColor(highestGrade)}`}>{highestGrade}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Graded</p>
                <p className="text-2xl font-bold">{gradedAssignments.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((gradedAssignments.filter(a => (a.grade || 0) >= 60).length / gradedAssignments.length) * 100)}%
                </p>
              </div>
              <Award className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Trend Chart */}
      {trendData.length > 0 && (
        <ProgressLineChart
          data={trendData}
          title="Recent Grade Trend"
          description="Performance across recent graded assignments"
        />
      )}

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>
            Breakdown of grades across all completed assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gradeRanges.map(range => {
              const percentage = gradedAssignments.length > 0
                ? Math.round((range.count / gradedAssignments.length) * 100)
                : 0;

              return (
                <div key={range.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`w-8 ${
                        range.label === "A" ? "bg-green-100 text-green-800" :
                        range.label === "B" ? "bg-blue-100 text-blue-800" :
                        range.label === "C" ? "bg-amber-100 text-amber-800" :
                        range.label === "D" ? "bg-orange-100 text-orange-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {range.label}
                      </Badge>
                      <span className="text-sm font-medium">{range.range}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{range.count} assignments</span>
                      <Badge variant="secondary">{percentage}%</Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance by Subject */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Subject</CardTitle>
          <CardDescription>
            Average grades across different subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subjectPerformance.map(({ subject, avgGrade, count }) => (
              <div key={subject} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{subject}</p>
                    <p className="text-xs text-muted-foreground">{count} assignment{count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={avgGrade} className="w-24 h-2" />
                  <span className={`font-bold ${getGradeColor(avgGrade)}`}>{avgGrade}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Graded Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Graded</CardTitle>
          <CardDescription>
            Latest assignments with grades and feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {gradedAssignments.slice(0, 5).map(assignment => {
            const gradeBadge = getGradeBadge(assignment.grade || 0);

            return (
              <div key={assignment.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={assignment.childAvatar} />
                          <AvatarFallback>{assignment.childName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{assignment.childName}</span>
                      </div>
                      <Badge variant="outline">{assignment.subject}</Badge>
                      <span className="text-muted-foreground">
                        Submitted: {assignment.submittedDate?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant={gradeBadge.variant}>{gradeBadge.label}</Badge>
                      <span className={`text-2xl font-bold ${getGradeColor(assignment.grade || 0)}`}>
                        {assignment.grade}%
                      </span>
                    </div>
                  </div>
                </div>

                {assignment.feedback && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Teacher Feedback:</p>
                    <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Performance by Child */}
      <Card>
        <CardHeader>
          <CardTitle>Child Performance Comparison</CardTitle>
          <CardDescription>
            Individual performance across graded assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {children.map(child => {
            const childAssignments = gradedAssignments.filter(a => a.childName === child.name);
            if (childAssignments.length === 0) {
              return (
                <div key={child.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={child.avatar} />
                      <AvatarFallback>{child.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{child.name}</span>
                    <span className="text-sm text-muted-foreground">- No graded assignments yet</span>
                  </div>
                </div>
              );
            }

            const childAvg = Math.round(
              childAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / childAssignments.length
            );
            const childHighest = Math.max(...childAssignments.map(a => a.grade || 0));
            const childLowest = Math.min(...childAssignments.map(a => a.grade || 0));

            return (
              <div key={child.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={child.avatar} />
                      <AvatarFallback>{child.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{child.name}</span>
                  </div>
                  <Badge variant="outline">{childAssignments.length} graded</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Average</p>
                    <p className={`font-bold ${getGradeColor(childAvg)}`}>{childAvg}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Highest</p>
                    <p className={`font-bold ${getGradeColor(childHighest)}`}>{childHighest}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lowest</p>
                    <p className={`font-bold ${getGradeColor(childLowest)}`}>{childLowest}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}