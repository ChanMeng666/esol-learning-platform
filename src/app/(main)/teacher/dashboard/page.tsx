"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { getTeacherClasses } from "@/actions/classes";
import { getTeacherAssignments } from "@/actions/assignments";
import {
  Users,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [classesData, assignmentsData] = await Promise.all([
        getTeacherClasses(),
        getTeacherAssignments({ limit: 5 }),
      ]);

      setClasses(classesData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading your dashboard..." fullScreen />;
  }

  // Calculate statistics
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0);
  const totalClasses = classes.length;
  const activeAssignments = assignments.filter((a) => a.status === "active").length;
  const pendingReviews = assignments.reduce(
    (sum, a) => sum + (a.stats?.inProgressCount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your classes and assignments.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                Active classes you're teaching
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all your classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAssignments}</div>
              <p className="text-xs text-muted-foreground">
                Currently assigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews}</div>
              <p className="text-xs text-muted-foreground">
                Submissions to review
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Assignments</CardTitle>
                  <CardDescription>Your latest created assignments</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/teacher/assignments")}
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
                  description="Create your first assignment to get started"
                  action={{
                    label: "Create Assignment",
                    onClick: () => router.push("/teacher/assignments"),
                  }}
                />
              ) : (
                <div className="space-y-4">
                  {assignments.slice(0, 5).map((assignment) => (
                    <div
                      key={assignment.id.toString()}
                      className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition"
                      onClick={() => router.push(`/teacher/assignments/${assignment.id}`)}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{assignment.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="capitalize">
                            {assignment.assignmentType.replace("_", " ")}
                          </Badge>
                          {assignment.dueDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Due {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {assignment.stats?.completedCount || 0}/
                          {assignment.stats?.totalStudents || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Classes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Classes</CardTitle>
                  <CardDescription>Quick access to your classes</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/teacher/classes")}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {classes.length === 0 ? (
                <EmptyState
                  title="No classes yet"
                  description="Contact your admin to get assigned to classes"
                />
              ) : (
                <div className="space-y-4">
                  {classes.slice(0, 5).map((cls) => (
                    <div
                      key={cls.id.toString()}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition"
                      onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                    >
                      <div>
                        <h4 className="font-semibold">{cls.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cls.academicYear}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <Users className="w-3 h-3 mr-1" />
                          {cls.studentCount || 0} students
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={() => router.push("/teacher/assignments")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-2"
            >
              <ClipboardList className="w-6 h-6" />
              <span className="font-semibold">Create Assignment</span>
              <span className="text-sm text-muted-foreground">
                Assign tasks to your students
              </span>
            </Button>

            <Button
              onClick={() => router.push("/teacher/classes")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-2"
            >
              <Users className="w-6 h-6" />
              <span className="font-semibold">Manage Classes</span>
              <span className="text-sm text-muted-foreground">
                View and manage your classes
              </span>
            </Button>

            <Button
              onClick={() => router.push("/diagnostic")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-2"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="font-semibold">Student Progress</span>
              <span className="text-sm text-muted-foreground">
                Track student performance
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
