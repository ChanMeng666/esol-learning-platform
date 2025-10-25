"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyStudentsState } from "@/components/shared/empty-state";
import { Progress } from "@/components/ui/progress";
import { getClassStudents, getClassAnalyticsSummary } from "@/actions/classes";
import {
  Users,
  TrendingUp,
  ArrowLeft,
  Search,
  UserPlus,
  ClipboardList,
  BarChart,
  Mic,
} from "lucide-react";
import { toast } from "sonner";

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = BigInt(params.classId as string);

  const [students, setStudents] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClassData();
  }, [classId]);

  async function loadClassData() {
    try {
      setLoading(true);
      const [studentsData, analyticsData] = await Promise.all([
        getClassStudents(classId),
        getClassAnalyticsSummary(classId),
      ]);

      setStudents(studentsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error loading class data:", error);
      toast.error("Failed to load class data");
      router.push("/teacher/classes");
    } finally {
      setLoading(false);
    }
  }

  function handleStudentClick(studentId: bigint) {
    router.push(`/teacher/students/${studentId}`);
  }

  const filteredStudents = searchQuery
    ? students.filter((s) =>
        s.student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  if (loading) {
    return <LoadingState message="Loading class details..." fullScreen />;
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/teacher/classes")}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classes
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{analytics.classInfo.name}</h1>
              <p className="text-muted-foreground">
                Academic Year: {analytics.classInfo.academicYear}
              </p>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              {analytics.totalStudents} Students
            </Badge>
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
              <div className="text-2xl font-bold">{analytics.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.activeStudents} active this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  (analytics.avgProgress.listening +
                    analytics.avgProgress.speaking +
                    analytics.avgProgress.reading +
                    analytics.avgProgress.writing) /
                  4
                ).toFixed(0)}
                %
              </div>
              <p className="text-xs text-muted-foreground">Across all skills</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Completed</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalQuestionsCompleted}</div>
              <p className="text-xs text-muted-foreground">Total by all students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.averageAccuracy.toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">Average class accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="students">
              <Users className="w-4 h-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <ClipboardList className="w-4 h-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="recordings">
              <Mic className="w-4 h-4 mr-2" />
              Recordings
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Students
              </Button>
            </div>

            {/* Students Table */}
            {filteredStudents.length === 0 ? (
              searchQuery ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No students match your search</p>
                </div>
              ) : (
                <EmptyStudentsState onAddStudents={() => toast.info("Add students feature")} />
              )
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Listening</TableHead>
                      <TableHead>Speaking</TableHead>
                      <TableHead>Reading</TableHead>
                      <TableHead>Writing</TableHead>
                      <TableHead>Avg Progress</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((item) => (
                      <TableRow
                        key={item.student.id.toString()}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {item.student.fullName}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={item.nzcelProgress?.listeningProgress || 0}
                              className="w-16 h-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {item.nzcelProgress?.listeningProgress || 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={item.nzcelProgress?.speakingProgress || 0}
                              className="w-16 h-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {item.nzcelProgress?.speakingProgress || 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={item.nzcelProgress?.readingProgress || 0}
                              className="w-16 h-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {item.nzcelProgress?.readingProgress || 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={item.nzcelProgress?.writingProgress || 0}
                              className="w-16 h-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {item.nzcelProgress?.writingProgress || 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {item.avgProgress.toFixed(0)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.nzcelProgress?.lastStudyDate
                            ? new Date(item.nzcelProgress.lastStudyDate).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStudentClick(item.student.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Analytics</CardTitle>
                <CardDescription>
                  Detailed breakdown of class performance across skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skill Progress */}
                {Object.entries(analytics.avgProgress as Record<string, number>).map(
                  ([skill, progress]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold capitalize">{skill}</h4>
                        <span className="text-lg font-bold">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Class Assignments</CardTitle>
                    <CardDescription>
                      Assignments created for this class
                    </CardDescription>
                  </div>
                  <Button>
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  No assignments created yet
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recordings Tab */}
          <TabsContent value="recordings">
            <Card>
              <CardHeader>
                <CardTitle>Student Recordings</CardTitle>
                <CardDescription>
                  Voice recordings from students in this class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Recordings feature coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
