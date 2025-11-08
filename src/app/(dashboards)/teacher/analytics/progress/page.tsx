"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAnalyticsContext } from "../layout";
import { TrendingUp, Award, AlertTriangle } from "lucide-react";

export default function TeacherAnalyticsProgressPage() {
  return (
    <ProtectedRoute>
      <ProgressContent />
    </ProtectedRoute>
  );
}

function ProgressContent() {
  const { selectedClass, timeRange } = useAnalyticsContext();

  // Mock data
  const topPerformers = [
    { name: "Alex Chen", score: 95, improvement: 8 },
    { name: "Sarah Kim", score: 92, improvement: 5 },
    { name: "James Lee", score: 90, improvement: 12 },
  ];

  const strugglingStudents = [
    { name: "Mike Johnson", score: 62, areas: ["Speaking", "Writing"] },
    { name: "Tom Davis", score: 58, areas: ["Listening", "Grammar"] },
  ];

  const modules = [
    { module: "Module 1: Introduction", completed: 100, status: "completed" },
    { module: "Module 2: Basic Grammar", completed: 100, status: "completed" },
    { module: "Module 3: Vocabulary Building", completed: 85, status: "in-progress" },
    { module: "Module 4: Speaking Practice", completed: 45, status: "in-progress" },
    { module: "Module 5: Writing Skills", completed: 0, status: "not-started" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Performers and Students Needing Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <CardTitle>Top Performers</CardTitle>
            </div>
            <CardDescription>Students showing excellent progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((student, index) => (
                <div key={student.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Score: {student.score}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">+{student.improvement}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Students Needing Support */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Needs Support</CardTitle>
            </div>
            <CardDescription>Students who may benefit from extra help</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strugglingStudents.map((student) => (
                <div key={student.name} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{student.name}</p>
                    <Badge variant="destructive">{student.score}%</Badge>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-muted-foreground">Weak areas:</span>
                    {student.areas.map(area => (
                      <Badge key={area} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle>Module Completion Status</CardTitle>
          <CardDescription>Track progress through course modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.module} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{module.module}</span>
                  <Badge variant={
                    module.status === "completed" ? "default" :
                    module.status === "in-progress" ? "secondary" :
                    "outline"
                  }>
                    {module.completed}%
                  </Badge>
                </div>
                <Progress value={module.completed} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Class Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <Progress value={73} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Across all modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">On Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18/25</div>
            <p className="text-xs text-green-600 mt-1">72% of students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4</div>
            <p className="text-xs text-muted-foreground mt-1">Modules per student</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}