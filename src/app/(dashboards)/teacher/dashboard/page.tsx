"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartRevenue } from "@/components/charts/chart-revenue";
import { ChartVisitors } from "@/components/charts/chart-visitors";
import { ClassScheduleCalendar } from "@/components/calendar/fullcalendar-schedule";
import { GradeSpreadsheet } from "@/components/spreadsheet/grade-spreadsheet";
import { DataTable } from "@/components/data-table/data-table";
import { getTeacherClasses } from "@/actions/classes";
import { getTeacherAssignments } from "@/actions/assignments";
import {
  Users,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  Clock,
  ArrowRight,
  Calendar,
  Table,
  BarChart3,
  FileText,
  Lightbulb,
  FlaskConical,
  Eye,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

// Define columns for student data table
const studentColumns = [
  {
    accessorKey: "name",
    header: "Student Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "progress",
    header: "Progress",
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
];

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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

  // Calculate completion rate
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.status === "completed").length;
  const completionRate = totalAssignments > 0
    ? Math.round((completedAssignments / totalAssignments) * 100)
    : 0;

  // Mock trends (replace with real data from API)
  const mockTrends = {
    students: { value: 5.2, label: "vs last month" },
    classes: { value: 0, label: "no change" },
    assignments: { value: 12.8, label: "vs last month" },
    reviews: { value: -8.5, label: "vs last week" },
  };

  // Generate class performance data for bar chart
  const classPerformanceData = classes.slice(0, 6).map((cls) => ({
    label: cls.name.length > 15 ? cls.name.substring(0, 15) + "..." : cls.name,
    students: cls.studentCount || 0,
    avgScore: cls.averageScore || 75,
  }));

  const classPerformanceConfig = {
    students: {
      label: "Students",
      color: "hsl(var(--chart-1))",
    },
    avgScore: {
      label: "Avg Score",
      color: "hsl(var(--chart-2))",
    },
  };

  // Assignment status distribution for pie chart
  const assignmentStatusData = [
    {
      category: "completed",
      value: completedAssignments,
      fill: "hsl(var(--chart-1))",
    },
    {
      category: "in_progress",
      value: assignments.filter((a) => a.status === "active").length,
      fill: "hsl(var(--chart-2))",
    },
    {
      category: "not_started",
      value: assignments.filter((a) => a.status === "draft").length,
      fill: "hsl(var(--chart-3))",
    },
  ];

  const assignmentStatusConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-1))",
    },
    in_progress: {
      label: "In Progress",
      color: "hsl(var(--chart-2))",
    },
    not_started: {
      label: "Not Started",
      color: "hsl(var(--chart-3))",
    },
  };

  // Mock student data for table
  const mockStudentData = [
    { id: "1", name: "John Doe", email: "john@example.com", progress: "75%", lastActive: "2 hours ago", grade: "A" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", progress: "82%", lastActive: "1 day ago", grade: "A+" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", progress: "65%", lastActive: "3 days ago", grade: "B" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your classes, assignments, and track student progress
        </p>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-3xl grid-cols-6 lg:grid-cols-6">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="classes" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Classes</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="grades" className="gap-2">
            <Table className="h-4 w-4" />
            <span className="hidden sm:inline">Grades</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Classes"
              value={totalClasses}
              description="Active classes you're teaching"
              icon={GraduationCap}
              trend={mockTrends.classes}
              variant="info"
            />
            <StatCard
              title="Total Students"
              value={totalStudents}
              description="Across all your classes"
              icon={Users}
              trend={mockTrends.students}
              variant="success"
            />
            <StatCard
              title="Active Assignments"
              value={activeAssignments}
              description="Currently assigned"
              icon={ClipboardList}
              trend={mockTrends.assignments}
              variant="warning"
            />
            <StatCard
              title="Pending Reviews"
              value={pendingReviews}
              description="Submissions to review"
              icon={Clock}
              trend={mockTrends.reviews}
              variant="primary"
              footer={{
                label: "Review Now",
                sublabel: "→"
              }}
            />
          </div>

          {/* Charts Row */}
          {classes.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <ChartRevenue
                title={`${totalStudents} Total Students`}
                description="Students per class"
                data={classPerformanceData}
                config={classPerformanceConfig}
                stacked={false}
                footerDescription="Showing your top 6 classes"
              />
              {assignments.length > 0 && (
                <ChartVisitors
                  title="Assignment Status"
                  description="Current assignment distribution"
                  data={assignmentStatusData}
                  config={assignmentStatusConfig}
                  centerLabel="Total"
                />
              )}
            </div>
          )}

          {/* Main Content Grid */}
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
                  <div className="space-y-3">
                    {assignments.slice(0, 5).map((assignment) => (
                      <div
                        key={assignment.id.toString()}
                        className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/teacher/assignments/${assignment.id}`)}
                      >
                        <div className="flex-1 space-y-1">
                          <h4 className="font-semibold leading-none">{assignment.title}</h4>
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
                  <div className="space-y-3">
                    {classes.slice(0, 5).map((cls) => (
                      <div
                        key={cls.id.toString()}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                      >
                        <div className="space-y-1">
                          <h4 className="font-semibold leading-none">{cls.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cls.academicYear}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            <Users className="w-3 h-3 mr-1" />
                            {cls.studentCount || 0}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View and manage students across all your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filter placeholder - can be implemented later */}
                <div className="text-sm text-muted-foreground">
                  Filter functionality coming soon
                </div>
                <DataTable
                  columns={studentColumns}
                  data={mockStudentData}
                  searchKey="name"
                  pageSize={10}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Management</CardTitle>
              <CardDescription>Create and manage assignments for your classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">All Assignments</h3>
                <div className="flex gap-2">
                  <Button onClick={() => router.push("/teacher/assignments/create")}>
                    Create Assignment
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/teacher/dashboard/enhanced-page")}>
                    <FlaskConical className="w-4 h-4 mr-2" />
                    Advanced View
                  </Button>
                </div>
              </div>
              {assignments.map((assignment) => (
                <Card key={assignment.id.toString()}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-base">{assignment.title}</CardTitle>
                        <CardDescription>{assignment.description}</CardDescription>
                      </div>
                      <Badge>{assignment.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {assignment.stats?.completedCount || 0} of {assignment.stats?.totalStudents || 0} completed
                      </span>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/teacher/assignments/${assignment.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grade Management</CardTitle>
              <CardDescription>Manage student grades and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <GradeSpreadsheet
                organizationId={BigInt(1)}
                classId="class-1"
                className="h-[600px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>View and manage your teaching schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <ClassScheduleCalendar
                organizationId={BigInt(1)} // Will be replaced with actual organizationId
                userId="teacher-user-id" // Will be replaced with actual userId
                userRole="teacher"
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Insights</CardTitle>
              <CardDescription>AI-powered insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Class Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your Monday morning class shows 23% higher engagement. Consider scheduling important topics during this time.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Student Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      3 students have shown declining participation. Consider reaching out for support.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Assignment Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Essay assignments have a 40% higher completion rate when given 2-week deadlines vs 1-week.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Based on current progress, consider introducing more speaking exercises for intermediate students.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
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
              onClick={() => router.push("/teacher/assignments")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Create Assignment</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Assign tasks to students
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/teacher/classes")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Manage Classes</div>
                <div className="text-sm text-muted-foreground mt-1">
                  View your classes
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/diagnostic")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Student Progress</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Track performance
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/teacher/dashboard/enhanced-page")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <FlaskConical className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Enhanced Dashboard</div>
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