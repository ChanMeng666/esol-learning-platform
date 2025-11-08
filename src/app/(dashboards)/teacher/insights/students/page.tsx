"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useInsightsContext } from "../context";
import { Users, TrendingUp, TrendingDown, AlertTriangle, Target, Award } from "lucide-react";

export default function TeacherInsightsStudentsPage() {
  return (
    <ProtectedRoute>
      <StudentsInsightsContent />
    </ProtectedRoute>
  );
}

function StudentsInsightsContent() {
  const { selectedClass, timeframe } = useInsightsContext();

  // Mock student insights data
  const studentInsights = [
    {
      studentName: "Alex Chen",
      studentId: "1",
      insights: {
        strengths: ["Excellent listening comprehension", "Strong vocabulary retention", "Active participation"],
        weaknesses: ["Grammar accuracy needs improvement", "Writing structure"],
        recommendations: ["Provide additional grammar exercises", "Pair with stronger writers for peer review"],
        predictedGrade: "A-",
        riskLevel: "low" as const,
        currentScore: 88,
        improvement: 12,
      },
    },
    {
      studentName: "Sarah Kim",
      studentId: "2",
      insights: {
        strengths: ["Creative writing skills", "Good pronunciation"],
        weaknesses: ["Time management", "Test anxiety"],
        recommendations: ["Practice timed exercises", "Provide stress management resources"],
        predictedGrade: "B+",
        riskLevel: "medium" as const,
        currentScore: 82,
        improvement: 5,
      },
    },
    {
      studentName: "Mike Johnson",
      studentId: "3",
      insights: {
        strengths: ["Strong effort and motivation"],
        weaknesses: ["Speaking confidence", "Vocabulary range", "Reading comprehension"],
        recommendations: ["One-on-one speaking sessions", "Vocabulary building apps", "Simplified reading materials"],
        predictedGrade: "C+",
        riskLevel: "high" as const,
        currentScore: 68,
        improvement: -3,
      },
    },
  ];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-amber-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "default";
      case "medium":
        return "secondary";
      case "high":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">In selected class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-xs text-red-600">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">On Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">18</span>
            </div>
            <p className="text-xs text-green-600">Meeting expectations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Excelling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">4</span>
            </div>
            <p className="text-xs text-purple-600">Above expectations</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Student Cards */}
      <div className="space-y-4">
        {studentInsights.map((student) => (
          <Card key={student.studentId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{student.studentName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">Predicted: {student.insights.predictedGrade}</Badge>
                      <Badge variant={getRiskBadge(student.insights.riskLevel) as any}>
                        {student.insights.riskLevel} risk
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Current: {student.insights.currentScore}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {student.insights.improvement > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${student.insights.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {student.insights.improvement > 0 ? '+' : ''}{student.insights.improvement}%
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Full Profile
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-green-600">Strengths</h4>
                  <ul className="space-y-1">
                    {student.insights.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-amber-600">Areas for Improvement</h4>
                  <ul className="space-y-1">
                    {student.insights.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-600 mt-1.5" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Recommendations</h4>
                <div className="space-y-1">
                  {student.insights.recommendations.map((rec, idx) => (
                    <div key={idx} className="text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex items-start gap-2">
                      <span className="font-medium text-blue-600">{idx + 1}.</span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t">
                <Progress value={student.insights.currentScore} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Progress towards target grade
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Class Performance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Class Performance Distribution</CardTitle>
          <CardDescription>Student distribution across performance levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Excellent (90-100%)</span>
                <span>4 students</span>
              </div>
              <Progress value={16} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Good (80-89%)</span>
                <span>8 students</span>
              </div>
              <Progress value={32} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average (70-79%)</span>
                <span>10 students</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Below Average (60-69%)</span>
                <span>2 students</span>
              </div>
              <Progress value={8} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Needs Support (&lt;60%)</span>
                <span>1 student</span>
              </div>
              <Progress value={4} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}