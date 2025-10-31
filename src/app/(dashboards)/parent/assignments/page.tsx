"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { type ColumnDef } from "@tanstack/react-table";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Calendar,
  Download,
  Eye,
  MessageSquare,
  TrendingUp,
  Target,
  Award,
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

export default function ParentAssignmentsPage() {
  return (
    <ProtectedRoute>
      <AssignmentsPageContent />
    </ProtectedRoute>
  );
}

function AssignmentsPageContent() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const children = [
    { id: "1", name: "Alice Johnson", avatar: "/avatars/alice.jpg" },
    { id: "2", name: "Bob Johnson", avatar: "/avatars/bob.jpg" },
  ];

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        // Mock data - replace with actual API call
        const mockAssignments: Assignment[] = [
          {
            id: "1",
            title: "English Essay - My Favorite Book",
            description: "Write a 500-word essay about your favorite book",
            childName: "Alice Johnson",
            childAvatar: "/avatars/alice.jpg",
            subject: "English",
            teacher: "Ms. Smith",
            status: "completed",
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            grade: 85,
            feedback: "Well-written essay with good structure. Great job!",
            type: "homework",
          },
          {
            id: "2",
            title: "Math Problem Set - Chapter 5",
            description: "Complete problems 1-20 from Chapter 5",
            childName: "Alice Johnson",
            childAvatar: "/avatars/alice.jpg",
            subject: "Mathematics",
            teacher: "Mr. Johnson",
            status: "in_progress",
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            type: "homework",
          },
          {
            id: "3",
            title: "Science Project - Solar System",
            description: "Create a model of the solar system",
            childName: "Bob Johnson",
            childAvatar: "/avatars/bob.jpg",
            subject: "Science",
            teacher: "Mr. Brown",
            status: "in_progress",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            type: "project",
          },
          {
            id: "4",
            title: "History Quiz - Ancient Civilizations",
            description: "Online quiz covering chapters 1-3",
            childName: "Bob Johnson",
            childAvatar: "/avatars/bob.jpg",
            subject: "History",
            teacher: "Ms. Davis",
            status: "not_started",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            type: "quiz",
          },
          {
            id: "5",
            title: "Reading Assignment - Chapter 6",
            description: "Read Chapter 6 and answer comprehension questions",
            childName: "Alice Johnson",
            childAvatar: "/avatars/alice.jpg",
            subject: "English",
            teacher: "Ms. Smith",
            status: "overdue",
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            type: "homework",
          },
        ];

        setAssignments(mockAssignments);
      } catch (error) {
        console.error("Failed to load assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignments();
  }, [selectedChild, statusFilter]);

  // Filter assignments based on selected child and status
  const filteredAssignments = assignments.filter(assignment => {
    const childMatch = selectedChild === "all" || assignment.childName === selectedChild;
    const statusMatch = statusFilter === "all" || assignment.status === statusFilter;
    return childMatch && statusMatch;
  });

  // Assignment table columns
  const columns: ColumnDef<Assignment>[] = [
    {
      accessorKey: "title",
      header: "Assignment",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("title")}</p>
          <p className="text-sm text-muted-foreground">{row.original.subject}</p>
        </div>
      ),
    },
    {
      accessorKey: "childName",
      header: "Child",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.childAvatar} />
            <AvatarFallback>{row.getValue("childName").toString().split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span>{row.getValue("childName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "teacher",
      header: "Teacher",
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate") as Date;
        const isOverdue = dueDate < new Date() && row.original.status !== "completed";
        return (
          <span className={isOverdue ? "text-red-600" : ""}>
            {dueDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
          completed: "default",
          in_progress: "secondary",
          not_started: "outline",
          overdue: "destructive",
        };
        const icons = {
          completed: <CheckCircle2 className="w-3 h-3 mr-1" />,
          in_progress: <Clock className="w-3 h-3 mr-1" />,
          not_started: <AlertCircle className="w-3 h-3 mr-1" />,
          overdue: <XCircle className="w-3 h-3 mr-1" />,
        };

        return (
          <Badge variant={variants[status]}>
            {icons[status]}
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => {
        const grade = row.getValue("grade") as number | undefined;
        if (!grade) return <span className="text-muted-foreground">-</span>;

        const color = grade >= 80 ? "text-green-600" : grade >= 60 ? "text-amber-600" : "text-red-600";
        return <span className={`font-semibold ${color}`}>{grade}%</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/parent/assignments/${row.original.id}`)}
        >
          View
          <Eye className="w-3 h-3 ml-1" />
        </Button>
      ),
    },
  ];

  // Calculate statistics
  const totalAssignments = assignments.length;
  const completedCount = assignments.filter(a => a.status === "completed").length;
  const inProgressCount = assignments.filter(a => a.status === "in_progress").length;
  const overdueCount = assignments.filter(a => a.status === "overdue").length;
  const averageGrade = assignments
    .filter(a => a.grade !== undefined)
    .reduce((sum, a) => sum + (a.grade || 0), 0) / completedCount || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">
          Track and monitor your children's assignments and homework
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{totalAssignments}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{overdueCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Grade</p>
                <p className="text-2xl font-bold">{Math.round(averageGrade)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-background"
        >
          <option value="all">All Children</option>
          {children.map(child => (
            <option key={child.id} value={child.name}>{child.name}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-background"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
          <option value="not_started">Not Started</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Assignments</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
        </TabsList>

        {/* All Assignments Tab */}
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
              <CardDescription>
                Complete list of all assignments across all children
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAssignments.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={filteredAssignments}
                  searchKey="title"
                />
              ) : (
                <EmptyState
                  title="No assignments found"
                  description="There are no assignments matching your filters"
                  icon={<BookOpen className="w-16 h-16" />}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssignments
              .filter(a => a.status === "in_progress" || a.status === "not_started")
              .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
              .map(assignment => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription>
                          {assignment.childName} • {assignment.subject}
                        </CardDescription>
                      </div>
                      <Badge variant={assignment.type === "project" ? "default" : "secondary"}>
                        {assignment.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Due: {assignment.dueDate.toLocaleDateString()}</span>
                      </div>
                      <Badge variant={assignment.status === "in_progress" ? "secondary" : "outline"}>
                        {assignment.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/parent/assignments/${assignment.id}`)}
                      >
                        View Details
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/parent/communication?subject=Assignment: ${assignment.title}`)}
                      >
                        Contact Teacher
                        <MessageSquare className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Graded Tab */}
        <TabsContent value="graded" className="space-y-6">
          <div className="space-y-4">
            {filteredAssignments
              .filter(a => a.status === "completed" && a.grade)
              .sort((a, b) => (b.submittedDate?.getTime() || 0) - (a.submittedDate?.getTime() || 0))
              .map(assignment => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={assignment.childAvatar} />
                          <AvatarFallback>{assignment.childName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.childName} • {assignment.subject}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          assignment.grade! >= 80 ? "text-green-600" :
                          assignment.grade! >= 60 ? "text-amber-600" : "text-red-600"
                        }`}>
                          {assignment.grade}%
                        </p>
                        <p className="text-xs text-muted-foreground">Grade</p>
                      </div>
                    </div>
                  </CardHeader>
                  {assignment.feedback && (
                    <CardContent>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-1">Teacher Feedback</p>
                        <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}