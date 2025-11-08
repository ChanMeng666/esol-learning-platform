"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAssignmentContext } from "./layout";
import { type ColumnDef } from "@tanstack/react-table";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Calendar,
  Eye,
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
      <AssignmentsContent />
    </ProtectedRoute>
  );
}

function AssignmentsContent() {
  const router = useRouter();
  const { assignments } = useAssignmentContext();

  // Assignment table columns
  const assignmentColumns: ColumnDef<Assignment>[] = [
    {
      accessorKey: "title",
      header: "Assignment",
      cell: ({ row }) => {
        const type = row.original.type;
        const icons = {
          homework: <BookOpen className="h-4 w-4 text-blue-500" />,
          project: <FileText className="h-4 w-4 text-purple-500" />,
          quiz: <CheckCircle2 className="h-4 w-4 text-green-500" />,
          exam: <AlertCircle className="h-4 w-4 text-red-500" />,
        };

        return (
          <div className="flex items-center gap-2">
            {icons[type]}
            <div>
              <p className="font-medium">{row.getValue("title")}</p>
              <p className="text-xs text-muted-foreground">{row.original.description}</p>
            </div>
          </div>
        );
      },
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
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("subject")}</Badge>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate") as Date;
        const now = new Date();
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm">{dueDate.toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">
                {daysUntilDue > 0
                  ? `In ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`
                  : daysUntilDue === 0
                  ? 'Today'
                  : `${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) === 1 ? '' : 's'} ago`}
              </p>
            </div>
          </div>
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
          completed: <CheckCircle2 className="h-3 w-3" />,
          in_progress: <Clock className="h-3 w-3" />,
          not_started: <AlertCircle className="h-3 w-3" />,
          overdue: <XCircle className="h-3 w-3" />,
        };

        return (
          <Badge variant={variants[status] || "outline"} className="gap-1">
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
        const grade = row.original.grade;
        if (!grade) return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${
              grade >= 90 ? "text-green-600" :
              grade >= 80 ? "text-blue-600" :
              grade >= 70 ? "text-amber-600" :
              "text-red-600"
            }`}>
              {grade}%
            </span>
          </div>
        );
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
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      ),
    },
  ];

  // Calculate statistics
  const totalAssignments = assignments.length;
  const completedCount = assignments.filter(a => a.status === "completed").length;
  const inProgressCount = assignments.filter(a => a.status === "in_progress").length;
  const overdueCount = assignments.filter(a => a.status === "overdue").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
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
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>
            Complete list of assignments across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={assignmentColumns}
            data={assignments}
            searchKey="title"
          />
        </CardContent>
      </Card>
    </div>
  );
}