"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Progress } from "@/components/ui/progress";
import { getTeacherAssignments } from "@/actions/assignments";
import {
  ClipboardList,
  Search,
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

type AssignmentStatus = "draft" | "active" | "completed" | "archived";
type AssignmentType = "practice" | "diagnostic" | "conversation" | "custom";

export default function TeacherAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchQuery, statusFilter, typeFilter]);

  async function loadAssignments() {
    try {
      setLoading(true);
      const data = await getTeacherAssignments();
      setAssignments(data);
    } catch (error) {
      console.error("Error loading assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }

  function filterAssignments() {
    let filtered = [...assignments];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((assignment) => assignment.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((assignment) => assignment.assignmentType === typeFilter);
    }

    setFilteredAssignments(filtered);
  }

  function handleAssignmentClick(assignmentId: bigint) {
    router.push(`/teacher/assignments/${assignmentId}`);
  }

  function handleCreateAssignment() {
    router.push("/teacher/assignments/create");
  }

  function getStatusBadgeVariant(status: string) {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "draft":
        return "outline";
      case "archived":
        return "secondary";
      default:
        return "outline";
    }
  }

  function getCompletionColor(percentage: number) {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  }

  const activeAssignments = assignments.filter((a) => a.status === "active");
  const draftAssignments = assignments.filter((a) => a.status === "draft");
  const totalStudentsAssigned = assignments.reduce(
    (sum, a) => sum + (a.stats?.totalStudents || 0),
    0
  );
  const pendingReviews = assignments.reduce(
    (sum, a) => sum + (a.stats?.submittedCount || 0),
    0
  );

  if (loading) {
    return <LoadingState message="Loading assignments..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Assignments</h1>
              <p className="text-muted-foreground">
                Create and manage assignments for your students
              </p>
            </div>
            <Button onClick={handleCreateAssignment} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeAssignments.length} active, {draftAssignments.length} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Assigned</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudentsAssigned}</div>
              <p className="text-xs text-muted-foreground">Across all assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews}</div>
              <p className="text-xs text-muted-foreground">Submissions to review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignments.length > 0
                  ? (
                      assignments.reduce(
                        (sum, a) => sum + (a.stats?.completionRate || 0),
                        0
                      ) / assignments.length
                    ).toFixed(0)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Overall completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="practice">Practice</SelectItem>
              <SelectItem value="diagnostic">Diagnostic</SelectItem>
              <SelectItem value="conversation">Conversation</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Assignments List */}
        {filteredAssignments.length === 0 ? (
          searchQuery || statusFilter !== "all" || typeFilter !== "all" ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No assignments found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <EmptyState
              icon={<ClipboardList className="w-16 h-16" />}
              title="No assignments yet"
              description="Create your first assignment to get started"
              action={{
                label: "Create Assignment",
                onClick: handleCreateAssignment,
              }}
            />
          )
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssignments.map((assignment) => {
              const stats = assignment.stats || {};
              const completionRate = stats.completionRate || 0;
              const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
              const isOverdue = dueDate && dueDate < new Date() && assignment.status === "active";

              return (
                <Card
                  key={assignment.id.toString()}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleAssignmentClick(assignment.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={getStatusBadgeVariant(assignment.status)} className="capitalize">
                        {assignment.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {assignment.assignmentType}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{assignment.title}</CardTitle>
                    {assignment.description && (
                      <CardDescription className="line-clamp-2">
                        {assignment.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Due Date */}
                    {dueDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className={isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}>
                          Due: {dueDate.toLocaleDateString()}
                          {isOverdue && " (Overdue)"}
                        </span>
                      </div>
                    )}

                    {/* Student Stats */}
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {stats.totalStudents || 0} student{stats.totalStudents !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Completion Progress */}
                    {assignment.status === "active" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Completion</span>
                          <span className={`font-bold ${getCompletionColor(completionRate)}`}>
                            {completionRate.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{stats.completedCount || 0} completed</span>
                          <span>{stats.inProgressCount || 0} in progress</span>
                        </div>
                      </div>
                    )}

                    {/* Submission Status */}
                    {stats.submittedCount > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600">
                          {stats.submittedCount} submission{stats.submittedCount !== 1 ? "s" : ""} to review
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
