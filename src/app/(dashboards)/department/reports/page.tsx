"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  BarChart3,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: "academic" | "performance" | "attendance" | "teacher";
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  lastGenerated?: Date;
  icon: React.ElementType;
}

export default function DepartmentReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsPageContent />
    </ProtectedRoute>
  );
}

function ReportsPageContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedClass, setSelectedClass] = useState("all");

  // Report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: "student-progress",
      name: "Student Progress Report",
      description: "Detailed progress tracking for all department students",
      category: "academic",
      frequency: "weekly",
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: TrendingUp,
    },
    {
      id: "teacher-performance",
      name: "Teacher Performance",
      description: "Teaching effectiveness and student feedback summary",
      category: "teacher",
      frequency: "monthly",
      lastGenerated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      icon: GraduationCap,
    },
    {
      id: "attendance",
      name: "Attendance Summary",
      description: "Student attendance rates and patterns",
      category: "attendance",
      frequency: "weekly",
      lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      icon: CheckCircle2,
    },
    {
      id: "class-performance",
      name: "Class Performance Analysis",
      description: "Performance metrics by class and level",
      category: "performance",
      frequency: "monthly",
      lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      icon: BookOpen,
    },
    {
      id: "skill-assessment",
      name: "Skills Assessment",
      description: "Student skills development across all areas",
      category: "academic",
      frequency: "quarterly",
      lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      icon: Target,
    },
    {
      id: "achievement",
      name: "Achievement Report",
      description: "Student achievements and milestones",
      category: "performance",
      frequency: "monthly",
      icon: Award,
    },
  ];

  // Recent reports
  const recentReports = [
    {
      id: "1",
      name: "Weekly Progress Summary - Week 10",
      type: "Progress",
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      size: "1.2 MB",
    },
    {
      id: "2",
      name: "Teacher Performance - March 2024",
      type: "Performance",
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      size: "890 KB",
    },
    {
      id: "3",
      name: "Class Attendance Analysis",
      type: "Attendance",
      generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      size: "650 KB",
    },
  ];

  const handleGenerateReport = (reportId: string) => {
    console.log("Generating report:", reportId);
    // Implement report generation logic
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Department Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage department reports and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="eng-401">ENG-401</SelectItem>
              <SelectItem value="esol-101">ESOL-101</SelectItem>
              <SelectItem value="bus-301">BUS-301</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground mt-1">This quarter</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">6</p>
                <p className="text-xs text-muted-foreground mt-1">Automated reports</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Generated</p>
                <p className="text-2xl font-bold">2d</p>
                <p className="text-xs text-muted-foreground mt-1">ago</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">28MB</p>
                <p className="text-xs text-muted-foreground mt-1">All reports</p>
              </div>
              <BarChart3 className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map(template => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <template.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline" className="capitalize">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Frequency</span>
                    <Badge variant="secondary" className="capitalize">
                      {template.frequency}
                    </Badge>
                  </div>
                  {template.lastGenerated && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Generated</span>
                      <span className="text-xs">
                        {Math.floor((Date.now() - template.lastGenerated.getTime()) / (1000 * 60 * 60 * 24))}d ago
                      </span>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => handleGenerateReport(template.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recent Reports Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Recently generated department reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map(report => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{report.type}</Badge>
                          <span>•</span>
                          <span>{report.size}</span>
                          <span>•</span>
                          <span>{report.generatedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Weekly Student Progress</p>
                      <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Monthly Performance Summary</p>
                      <p className="text-sm text-muted-foreground">1st of each month at 8:00 AM</p>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Quarterly Skills Assessment</p>
                      <p className="text-sm text-muted-foreground">End of each quarter</p>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
