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
  category: "academic" | "financial" | "attendance" | "performance";
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annual";
  lastGenerated?: Date;
  icon: React.ElementType;
}

export default function SchoolAdminReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsPageContent />
    </ProtectedRoute>
  );
}

function ReportsPageContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: "enrollment",
      name: "Enrollment Report",
      description: "Student enrollment trends and demographics",
      category: "academic",
      frequency: "monthly",
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: Users,
    },
    {
      id: "performance",
      name: "Academic Performance",
      description: "Overall student performance and achievement metrics",
      category: "performance",
      frequency: "quarterly",
      lastGenerated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      icon: TrendingUp,
    },
    {
      id: "attendance",
      name: "Attendance Summary",
      description: "Student and teacher attendance rates",
      category: "attendance",
      frequency: "weekly",
      lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      icon: CheckCircle2,
    },
    {
      id: "department",
      name: "Department Analysis",
      description: "Detailed analysis of department performance",
      category: "academic",
      frequency: "monthly",
      lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      icon: BookOpen,
    },
    {
      id: "teacher",
      name: "Teacher Performance",
      description: "Teacher effectiveness and student feedback",
      category: "performance",
      frequency: "quarterly",
      lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      icon: GraduationCap,
    },
    {
      id: "completion",
      name: "Course Completion",
      description: "Course completion rates and student progression",
      category: "academic",
      frequency: "monthly",
      icon: Target,
    },
  ];

  // Recent reports
  const recentReports = [
    {
      id: "1",
      name: "Monthly Performance Summary - March 2024",
      type: "Performance",
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      size: "2.4 MB",
    },
    {
      id: "2",
      name: "Enrollment Trends Q1 2024",
      type: "Enrollment",
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      size: "1.8 MB",
    },
    {
      id: "3",
      name: "Department Analysis - February 2024",
      type: "Department",
      generatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      size: "3.1 MB",
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
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage school reports and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="english">English Language</SelectItem>
              <SelectItem value="esol">ESOL Foundation</SelectItem>
              <SelectItem value="advanced">Advanced Studies</SelectItem>
              <SelectItem value="business">Business English</SelectItem>
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
              <SelectItem value="year">This Year</SelectItem>
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
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs text-muted-foreground mt-1">This year</p>
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
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">124MB</p>
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
              <CardDescription>Recently generated reports and documents</CardDescription>
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
                      <p className="font-medium">Weekly Attendance Report</p>
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
                      <p className="font-medium">Quarterly Analysis</p>
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