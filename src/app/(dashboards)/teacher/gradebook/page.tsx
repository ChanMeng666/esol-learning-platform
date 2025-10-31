"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { GradeSpreadsheet } from "@/components/spreadsheet/grade-spreadsheet";
import { DataTable } from "@/components/data-table/data-table";
import { Progress } from "@/components/ui/progress";
import { getTeacherClasses } from "@/actions/classes";
import {
  Download,
  Upload,
  Save,
  Filter,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  Info,
  Calculator,
  BarChart3,
  BookOpen,
  Users
} from "lucide-react";
import { toast } from "sonner";

// Grade distribution data
interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  range: string;
}

// Student grade summary
interface StudentGradeSummary {
  id: string;
  name: string;
  assignments: number;
  quizzes: number;
  midterm: number;
  final: number;
  participation: number;
  overall: number;
  letterGrade: string;
  trend: "up" | "down" | "stable";
}

export default function TeacherGradebookPage() {
  return (
    <ProtectedRoute>
      <GradebookPageContent />
    </ProtectedRoute>
  );
}

function GradebookPageContent() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getTeacherClasses();
        setClasses(data || []);
        if (data && data.length > 0) {
          setSelectedClass(data[0]);
        }
      } catch (error) {
        console.error("Failed to load classes:", error);
        toast.error("Failed to load classes");
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

  // Mock student grades data
  const mockStudentGrades: StudentGradeSummary[] = selectedClass ? [
    { id: "1", name: "Alex Chen", assignments: 92, quizzes: 88, midterm: 90, final: 94, participation: 95, overall: 91, letterGrade: "A", trend: "up" },
    { id: "2", name: "Sarah Kim", assignments: 88, quizzes: 85, midterm: 87, final: 89, participation: 92, overall: 88, letterGrade: "B+", trend: "stable" },
    { id: "3", name: "Mike Johnson", assignments: 75, quizzes: 72, midterm: 70, final: 73, participation: 80, overall: 74, letterGrade: "C", trend: "down" },
    { id: "4", name: "Emma Wilson", assignments: 85, quizzes: 88, midterm: 86, final: 87, participation: 90, overall: 87, letterGrade: "B+", trend: "up" },
    { id: "5", name: "James Lee", assignments: 95, quizzes: 93, midterm: 94, final: 96, participation: 98, overall: 95, letterGrade: "A+", trend: "stable" },
    { id: "6", name: "Lisa Brown", assignments: 82, quizzes: 80, midterm: 78, final: 81, participation: 85, overall: 81, letterGrade: "B", trend: "up" },
    { id: "7", name: "Tom Davis", assignments: 68, quizzes: 65, midterm: 67, final: 70, participation: 72, overall: 68, letterGrade: "D+", trend: "down" },
  ] : [];

  // Calculate grade distribution
  const gradeDistribution: GradeDistribution[] = [
    { grade: "A", count: 2, percentage: 28, range: "90-100%" },
    { grade: "B", count: 3, percentage: 43, range: "80-89%" },
    { grade: "C", count: 1, percentage: 14, range: "70-79%" },
    { grade: "D", count: 1, percentage: 14, range: "60-69%" },
    { grade: "F", count: 0, percentage: 0, range: "Below 60%" },
  ];

  // Calculate class statistics
  const classStats = {
    average: Math.round(mockStudentGrades.reduce((sum, s) => sum + s.overall, 0) / mockStudentGrades.length),
    highest: Math.max(...mockStudentGrades.map(s => s.overall)),
    lowest: Math.min(...mockStudentGrades.map(s => s.overall)),
    median: 87,
    passingRate: Math.round((mockStudentGrades.filter(s => s.overall >= 60).length / mockStudentGrades.length) * 100),
  };

  const handleSaveGrades = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Grades saved successfully");
    } catch (error) {
      toast.error("Failed to save grades");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportGrades = () => {
    toast.success("Grades exported to Excel");
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-amber-600";
    if (grade >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading gradebook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
        <p className="text-muted-foreground">
          Manage and track student grades across your classes
        </p>
      </div>

      {/* Class Selector and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Select value={selectedClass?.id?.toString()} onValueChange={(value) => {
          const classItem = classes.find(c => c.id.toString() === value);
          setSelectedClass(classItem);
        }}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classItem) => (
              <SelectItem key={classItem.id.toString()} value={classItem.id.toString()}>
                {classItem.name} ({classItem.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportGrades}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleSaveGrades} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {selectedClass && (
        <>
          {/* Class Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{classStats.average}%</div>
                <p className="text-xs text-muted-foreground">Class Average</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{classStats.highest}%</div>
                <p className="text-xs text-muted-foreground">Highest Grade</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{classStats.lowest}%</div>
                <p className="text-xs text-muted-foreground">Lowest Grade</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{classStats.median}%</div>
                <p className="text-xs text-muted-foreground">Median Grade</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{classStats.passingRate}%</div>
                <p className="text-xs text-muted-foreground">Passing Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="spreadsheet" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="spreadsheet">Spreadsheet View</TabsTrigger>
              <TabsTrigger value="summary">Summary View</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="settings">Grade Settings</TabsTrigger>
            </TabsList>

            {/* Spreadsheet Tab */}
            <TabsContent value="spreadsheet" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Entry</CardTitle>
                  <CardDescription>
                    Enter and modify student grades directly in the spreadsheet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GradeSpreadsheet
                    organizationId={BigInt(1)}
                    classId={selectedClass.id}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Summary</CardTitle>
                  <CardDescription>
                    Overview of all student grades and performance trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium">Student</th>
                          <th className="text-center p-3 font-medium">Assignments</th>
                          <th className="text-center p-3 font-medium">Quizzes</th>
                          <th className="text-center p-3 font-medium">Midterm</th>
                          <th className="text-center p-3 font-medium">Final</th>
                          <th className="text-center p-3 font-medium">Participation</th>
                          <th className="text-center p-3 font-medium">Overall</th>
                          <th className="text-center p-3 font-medium">Grade</th>
                          <th className="text-center p-3 font-medium">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockStudentGrades.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-muted/50">
                            <td className="p-3 font-medium">{student.name}</td>
                            <td className={`text-center p-3 ${getGradeColor(student.assignments)}`}>
                              {student.assignments}%
                            </td>
                            <td className={`text-center p-3 ${getGradeColor(student.quizzes)}`}>
                              {student.quizzes}%
                            </td>
                            <td className={`text-center p-3 ${getGradeColor(student.midterm)}`}>
                              {student.midterm}%
                            </td>
                            <td className={`text-center p-3 ${getGradeColor(student.final)}`}>
                              {student.final}%
                            </td>
                            <td className={`text-center p-3 ${getGradeColor(student.participation)}`}>
                              {student.participation}%
                            </td>
                            <td className={`text-center p-3 font-bold ${getGradeColor(student.overall)}`}>
                              {student.overall}%
                            </td>
                            <td className="text-center p-3">
                              <Badge variant={student.overall >= 80 ? "default" : student.overall >= 60 ? "secondary" : "destructive"}>
                                {student.letterGrade}
                              </Badge>
                            </td>
                            <td className="text-center p-3">
                              {getTrendIcon(student.trend)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Distribution Tab */}
            <TabsContent value="distribution" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Grade Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Distribution</CardTitle>
                    <CardDescription>
                      Distribution of grades across the class
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {gradeDistribution.map((grade) => (
                        <div key={grade.grade} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="min-w-[40px] justify-center">
                                {grade.grade}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {grade.range}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {grade.count} students ({grade.percentage}%)
                            </span>
                          </div>
                          <Progress value={grade.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Insights</CardTitle>
                    <CardDescription>
                      Key observations about class performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Strong Performance</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            71% of students are performing at B level or above
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Area of Concern</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Quiz scores are consistently lower than assignments
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Recommendation</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Consider offering extra support for students below 70%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Calculation Settings</CardTitle>
                  <CardDescription>
                    Configure how grades are calculated and weighted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Weight Settings */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Component Weights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Assignments</label>
                          <div className="flex items-center gap-2">
                            <Input type="number" defaultValue="30" className="w-20" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Quizzes</label>
                          <div className="flex items-center gap-2">
                            <Input type="number" defaultValue="20" className="w-20" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Midterm Exam</label>
                          <div className="flex items-center gap-2">
                            <Input type="number" defaultValue="20" className="w-20" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Final Exam</label>
                          <div className="flex items-center gap-2">
                            <Input type="number" defaultValue="25" className="w-20" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Participation</label>
                          <div className="flex items-center gap-2">
                            <Input type="number" defaultValue="5" className="w-20" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grade Scale */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Grade Scale</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { grade: "A+", min: 95 },
                          { grade: "A", min: 90 },
                          { grade: "B+", min: 85 },
                          { grade: "B", min: 80 },
                          { grade: "C+", min: 75 },
                          { grade: "C", min: 70 },
                          { grade: "D+", min: 65 },
                          { grade: "D", min: 60 },
                          { grade: "F", min: 0 },
                        ].map((scale) => (
                          <div key={scale.grade} className="flex items-center justify-between p-2 border rounded">
                            <Badge variant="outline">{scale.grade}</Badge>
                            <span className="text-sm">≥ {scale.min}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline">Reset to Default</Button>
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}