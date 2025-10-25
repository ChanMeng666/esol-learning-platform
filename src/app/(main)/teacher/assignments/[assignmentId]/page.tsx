"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "@/components/shared/loading-state";
import {
  getAssignmentDetails,
  getAssignmentStudentStatuses,
  getAssignmentAnalytics,
} from "@/actions/assignments";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  Download,
  BarChart,
} from "lucide-react";
import { toast } from "sonner";

export default function AssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = BigInt(params.assignmentId as string);

  const [assignment, setAssignment] = useState<any>(null);
  const [studentStatuses, setStudentStatuses] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignmentData();
  }, [assignmentId]);

  async function loadAssignmentData() {
    try {
      setLoading(true);
      const [assignmentData, statusesData, analyticsData] = await Promise.all([
        getAssignmentDetails(assignmentId),
        getAssignmentStudentStatuses(assignmentId),
        getAssignmentAnalytics(assignmentId),
      ]);

      setAssignment(assignmentData);
      setStudentStatuses(statusesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error loading assignment data:", error);
      toast.error("Failed to load assignment details");
      router.push("/teacher/assignments");
    } finally {
      setLoading(false);
    }
  }

  function handleStudentClick(studentId: bigint) {
    router.push(`/teacher/students/${studentId}`);
  }

  function getStatusBadgeVariant(status: string) {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "submitted":
        return "outline";
      case "assigned":
        return "outline";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "submitted":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "overdue":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  }

  if (loading) {
    return <LoadingState message="Loading assignment details..." fullScreen />;
  }

  if (!assignment) {
    return null;
  }

  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && assignment.status === "active";

  const byStatus = {
    assigned: studentStatuses.filter((s) => s.status === "assigned"),
    inProgress: studentStatuses.filter((s) => s.status === "in_progress"),
    submitted: studentStatuses.filter((s) => s.status === "submitted"),
    completed: studentStatuses.filter((s) => s.status === "completed"),
    overdue: studentStatuses.filter((s) => s.status === "overdue"),
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/teacher/assignments")}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignments
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{assignment.title}</h1>
                <Badge variant={getStatusBadgeVariant(assignment.status)} className="capitalize">
                  {assignment.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {assignment.assignmentType}
                </Badge>
              </div>
              {assignment.description && (
                <p className="text-muted-foreground mb-2">{assignment.description}</p>
              )}
              {dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                    Due: {dueDate.toLocaleDateString()}
                    {isOverdue && " (Overdue)"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStatuses.length}</div>
              <p className="text-xs text-muted-foreground">
                {byStatus.completed.length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.completionRate?.toFixed(0) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {byStatus.inProgress.length} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{byStatus.submitted.length}</div>
              <p className="text-xs text-muted-foreground">Waiting for review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.averageScore?.toFixed(1) || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Out of 100</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="students">
              <Users className="w-4 h-4 mr-2" />
              Students ({studentStatuses.length})
            </TabsTrigger>
            <TabsTrigger value="submissions">
              <AlertCircle className="w-4 h-4 mr-2" />
              Pending Reviews ({byStatus.submitted.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>All Students</CardTitle>
                <CardDescription>Track progress for all assigned students</CardDescription>
              </CardHeader>
              <CardContent>
                {studentStatuses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No students assigned yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentStatuses.map((status) => (
                        <TableRow key={status.id.toString()}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div>
                                <div>{status.student.fullName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {status.student.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status.status)}
                              <Badge variant={getStatusBadgeVariant(status.status)} className="capitalize">
                                {status.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={status.progress || 0} className="w-16 h-2" />
                              <span className="text-sm text-muted-foreground">
                                {status.progress || 0}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {status.score !== null && status.score !== undefined ? (
                              <span className="font-medium">{status.score}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {status.lastActivityAt
                              ? new Date(status.lastActivityAt).toLocaleDateString()
                              : "Never"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStudentClick(status.student.id)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>
                  Student submissions waiting for your review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {byStatus.submitted.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                    <p>All caught up! No pending submissions.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {byStatus.submitted.map((status) => (
                      <div
                        key={status.id.toString()}
                        className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{status.student.fullName}</h4>
                              <Badge variant="outline">
                                {status.submittedAt
                                  ? new Date(status.submittedAt).toLocaleDateString()
                                  : "Recently"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {status.student.email}
                            </p>
                            {status.progress !== null && (
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-muted-foreground">Progress:</span>
                                <Progress value={status.progress} className="w-32 h-2" />
                                <span className="text-sm font-medium">{status.progress}%</span>
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => {
                              toast.info("Opening submission review (to be implemented)");
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Completion Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Completion Breakdown</CardTitle>
                  <CardDescription>
                    Student status distribution for this assignment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Completed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={
                            (byStatus.completed.length / studentStatuses.length) * 100
                          }
                          className="w-32 h-2"
                        />
                        <span className="text-sm font-medium w-12 text-right">
                          {byStatus.completed.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">Submitted</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={
                            (byStatus.submitted.length / studentStatuses.length) * 100
                          }
                          className="w-32 h-2"
                        />
                        <span className="text-sm font-medium w-12 text-right">
                          {byStatus.submitted.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">In Progress</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={
                            (byStatus.inProgress.length / studentStatuses.length) * 100
                          }
                          className="w-32 h-2"
                        />
                        <span className="text-sm font-medium w-12 text-right">
                          {byStatus.inProgress.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm">Not Started / Overdue</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={
                            ((byStatus.assigned.length + byStatus.overdue.length) /
                              studentStatuses.length) *
                            100
                          }
                          className="w-32 h-2"
                        />
                        <span className="text-sm font-medium w-12 text-right">
                          {byStatus.assigned.length + byStatus.overdue.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-border rounded">
                      <p className="text-sm text-muted-foreground">Assignment Type</p>
                      <p className="text-lg font-bold capitalize">{assignment.assignmentType}</p>
                    </div>
                    <div className="p-3 border border-border rounded">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="text-lg font-bold capitalize">{assignment.status}</p>
                    </div>
                    {dueDate && (
                      <div className="p-3 border border-border rounded">
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="text-lg font-bold">{dueDate.toLocaleDateString()}</p>
                      </div>
                    )}
                    {analytics?.averageScore && (
                      <div className="p-3 border border-border rounded">
                        <p className="text-sm text-muted-foreground">Average Score</p>
                        <p className="text-lg font-bold">{analytics.averageScore.toFixed(1)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
