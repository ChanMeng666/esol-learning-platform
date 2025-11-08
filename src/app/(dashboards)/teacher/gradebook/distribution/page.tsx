"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useGradebookContext } from "../layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { useState } from "react";

export default function GradebookDistributionPage() {
  return (
    <ProtectedRoute>
      <DistributionContent />
    </ProtectedRoute>
  );
}

function DistributionContent() {
  const { selectedClass, studentGrades, gradeDistribution } = useGradebookContext();
  const [selectedCategory, setSelectedCategory] = useState("overall");

  if (!selectedClass) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>Please select a class to view the distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate distribution for selected category
  const getCategoryData = () => {
    switch (selectedCategory) {
      case "assignments":
        return studentGrades.map(s => s.assignments);
      case "quizzes":
        return studentGrades.map(s => s.quizzes);
      case "midterm":
        return studentGrades.map(s => s.midterm);
      case "final":
        return studentGrades.map(s => s.final);
      case "participation":
        return studentGrades.map(s => s.participation);
      default:
        return studentGrades.map(s => s.overall);
    }
  };

  const categoryData = getCategoryData();
  const average = Math.round(categoryData.reduce((sum, val) => sum + val, 0) / categoryData.length);
  const highest = Math.max(...categoryData);
  const lowest = Math.min(...categoryData);
  const median = categoryData.sort((a, b) => a - b)[Math.floor(categoryData.length / 2)];

  // Calculate standard deviation
  const variance = categoryData.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / categoryData.length;
  const stdDev = Math.round(Math.sqrt(variance));

  // Score range distribution
  const scoreRanges = [
    { range: "90-100", count: categoryData.filter(s => s >= 90).length },
    { range: "80-89", count: categoryData.filter(s => s >= 80 && s < 90).length },
    { range: "70-79", count: categoryData.filter(s => s >= 70 && s < 80).length },
    { range: "60-69", count: categoryData.filter(s => s >= 60 && s < 70).length },
    { range: "0-59", count: categoryData.filter(s => s < 60).length },
  ];

  const maxCount = Math.max(...scoreRanges.map(r => r.count));

  return (
    <div className="space-y-6">
      {/* Distribution Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Grade Distribution Analysis</CardTitle>
              <CardDescription>
                Analyze grade distribution by category
              </CardDescription>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall Grade</SelectItem>
                <SelectItem value="assignments">Assignments</SelectItem>
                <SelectItem value="quizzes">Quizzes</SelectItem>
                <SelectItem value="midterm">Midterm</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="participation">Participation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Statistical Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{average}%</div>
            <p className="text-xs text-muted-foreground">Mean score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Highest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{highest}%</div>
            <p className="text-xs text-muted-foreground">Maximum score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Lowest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowest}%</div>
            <p className="text-xs text-muted-foreground">Minimum score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Median</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{median}%</div>
            <p className="text-xs text-muted-foreground">Middle value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Std Dev</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">±{stdDev}</div>
            <p className="text-xs text-muted-foreground">Spread</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Score Distribution
          </CardTitle>
          <CardDescription>
            Number of students in each score range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoreRanges.map((range) => (
              <div key={range.range} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium w-16">{range.range}%</span>
                  <div className="flex-1 mx-4">
                    <div className="h-8 bg-muted rounded-md relative overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(range.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-muted-foreground w-20 text-right">
                    {range.count} students
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box Plot Visualization (simplified) */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution Box</CardTitle>
            <CardDescription>
              Quartile distribution of {selectedCategory} grades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative h-12 bg-muted rounded-lg">
                <div className="absolute inset-y-0 flex items-center w-full">
                  {/* Min line */}
                  <div
                    className="absolute h-8 w-0.5 bg-foreground"
                    style={{ left: `${(lowest / 100) * 100}%` }}
                  />
                  {/* Q1 to Q3 box */}
                  <div
                    className="absolute h-6 bg-primary/20 border-2 border-primary"
                    style={{
                      left: `${((categoryData[Math.floor(categoryData.length * 0.25)] || 0) / 100) * 100}%`,
                      width: `${(((categoryData[Math.floor(categoryData.length * 0.75)] || 0) - (categoryData[Math.floor(categoryData.length * 0.25)] || 0)) / 100) * 100}%`
                    }}
                  />
                  {/* Median line */}
                  <div
                    className="absolute h-8 w-1 bg-primary"
                    style={{ left: `${(median / 100) * 100}%` }}
                  />
                  {/* Max line */}
                  <div
                    className="absolute h-8 w-0.5 bg-foreground"
                    style={{ left: `${(highest / 100) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-5 text-xs text-muted-foreground">
                <div>0%</div>
                <div className="text-center">25%</div>
                <div className="text-center">50%</div>
                <div className="text-center">75%</div>
                <div className="text-right">100%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>
              Key observations about {selectedCategory} grades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {average >= 75 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Class is performing well above average</span>
                  </>
                ) : average >= 60 ? (
                  <>
                    <span className="h-4 w-4 block" />
                    <span className="text-sm">Class performance is satisfactory</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Class needs additional support</span>
                  </>
                )}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Range: {highest - lowest} points between highest and lowest</p>
                <p>• {categoryData.filter(s => s >= 70).length} students are passing (≥70%)</p>
                <p>• {categoryData.filter(s => s >= 90).length} students achieved excellence (≥90%)</p>
                <p>• Standard deviation of ±{stdDev} indicates {stdDev > 15 ? "high" : "moderate"} variability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Student Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Performance</CardTitle>
          <CardDescription>
            Each student's {selectedCategory} score relative to class average
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {studentGrades.map(student => {
              const score = student[selectedCategory as keyof typeof student] as number;
              const deviation = score - average;
              return (
                <div key={student.id} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-32 truncate">{student.name}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full relative">
                      <div
                        className={`absolute h-full rounded-full ${
                          score >= average ? "bg-green-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${score}%` }}
                      />
                      <div
                        className="absolute h-4 w-0.5 bg-primary -top-1"
                        style={{ left: `${average}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-20 text-right">
                      {deviation > 0 ? "+" : ""}{deviation}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}