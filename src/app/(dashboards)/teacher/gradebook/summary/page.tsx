"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useGradebookContext } from "../context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, TrendingUp, TrendingDown, Award, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GradebookSummaryPage() {
  return (
    <ProtectedRoute>
      <SummaryContent />
    </ProtectedRoute>
  );
}

function SummaryContent() {
  const { selectedClass, studentGrades, gradeDistribution, classStats } = useGradebookContext();

  if (!selectedClass) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>Please select a class to view the summary</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600";
    if (grade.startsWith("B")) return "text-blue-600";
    if (grade.startsWith("C")) return "text-yellow-600";
    if (grade.startsWith("D")) return "text-orange-600";
    return "text-red-600";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <span className="h-3 w-3 block" />;
  };

  return (
    <div className="space-y-6">
      {/* Performance Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-green-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {studentGrades
                .filter(s => s.overall >= 90)
                .map(student => (
                  <div key={student.id} className="flex justify-between items-center">
                    <span className="text-sm">{student.name}</span>
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">{student.overall}%</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Need Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {studentGrades
                .filter(s => s.overall < 70)
                .map(student => (
                  <div key={student.id} className="flex justify-between items-center">
                    <span className="text-sm">{student.name}</span>
                    <Badge variant="destructive">{student.overall}%</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Grade Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Grade Summary</CardTitle>
          <CardDescription>
            Overview of all student grades with performance trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
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
                {studentGrades.map((student, index) => (
                  <tr
                    key={student.id}
                    className={cn(
                      "border-b hover:bg-muted/30 transition-colors",
                      index % 2 === 0 ? "bg-background" : "bg-muted/10"
                    )}
                  >
                    <td className="p-3 font-medium">{student.name}</td>
                    <td className="text-center p-3">{student.assignments}%</td>
                    <td className="text-center p-3">{student.quizzes}%</td>
                    <td className="text-center p-3">{student.midterm}%</td>
                    <td className="text-center p-3">{student.final}%</td>
                    <td className="text-center p-3">{student.participation}%</td>
                    <td className="text-center p-3 font-bold">{student.overall}%</td>
                    <td className="text-center p-3">
                      <span className={cn("font-bold", getGradeColor(student.letterGrade))}>
                        {student.letterGrade}
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <div className="flex justify-center">
                        {getTrendIcon(student.trend)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Grade Distribution Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>
            Breakdown of grades across the class
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gradeDistribution.map(dist => (
              <div key={dist.grade} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        dist.grade === "A" && "bg-green-100 text-green-800",
                        dist.grade === "B" && "bg-blue-100 text-blue-800",
                        dist.grade === "C" && "bg-yellow-100 text-yellow-800",
                        dist.grade === "D" && "bg-orange-100 text-orange-800",
                        dist.grade === "F" && "bg-red-100 text-red-800"
                      )}
                    >
                      {dist.grade}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{dist.range}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{dist.count} students</span>
                    <span className="text-sm text-muted-foreground">({dist.percentage}%)</span>
                  </div>
                </div>
                <Progress
                  value={dist.percentage}
                  className={cn(
                    "h-2",
                    dist.grade === "A" && "[&>div]:bg-green-500",
                    dist.grade === "B" && "[&>div]:bg-blue-500",
                    dist.grade === "C" && "[&>div]:bg-yellow-500",
                    dist.grade === "D" && "[&>div]:bg-orange-500",
                    dist.grade === "F" && "[&>div]:bg-red-500"
                  )}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline">Generate Report</Button>
        <Button>Send Grade Reports</Button>
      </div>
    </div>
  );
}