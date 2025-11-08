"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useClassContext } from "../context";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClassAttendancePage() {
  return (
    <ProtectedRoute>
      <AttendanceContent />
    </ProtectedRoute>
  );
}

function AttendanceContent() {
  const { classData } = useClassContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState("today");

  // Mock attendance data
  const todayAttendance = [
    { id: "1", name: "Alex Chen", status: "present", time: "8:55 AM" },
    { id: "2", name: "Sarah Kim", status: "present", time: "8:58 AM" },
    { id: "3", name: "Mike Johnson", status: "late", time: "9:15 AM" },
    { id: "4", name: "Emma Wilson", status: "present", time: "8:52 AM" },
    { id: "5", name: "James Lee", status: "present", time: "8:57 AM" },
    { id: "6", name: "Lisa Wang", status: "absent", time: "-" },
    { id: "7", name: "Tom Davis", status: "absent", time: "-" },
    { id: "8", name: "Amy Zhang", status: "present", time: "9:00 AM" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "late":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "excused":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Present</Badge>;
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "late":
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Late</Badge>;
      case "excused":
        return <Badge variant="secondary">Excused</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const presentCount = todayAttendance.filter(s => s.status === "present").length;
  const absentCount = todayAttendance.filter(s => s.status === "absent").length;
  const lateCount = todayAttendance.filter(s => s.status === "late").length;
  const attendanceRate = ((presentCount + lateCount) / todayAttendance.length) * 100;

  return (
    <div className="space-y-6">
      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Today's Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1 mt-1">
              {attendanceRate >= 85 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={cn(
                "text-xs",
                attendanceRate >= 85 ? "text-green-600" : "text-red-600"
              )}>
                {attendanceRate >= 85 ? "Good" : "Low"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{presentCount}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">On time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{absentCount}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Not present</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{lateCount}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tardy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Monthly Avg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-muted-foreground mt-1">December</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Attendance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendance Sheet</CardTitle>
                  <CardDescription>
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={view} onValueChange={setView}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayAttendance.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.status !== "absent" ? `Arrived: ${student.time}` : "Not present"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(student.status)}
                      <div className="flex gap-1">
                        <Button
                          variant={student.status === "present" ? "default" : "ghost"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {/* Update status */}}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={student.status === "absent" ? "destructive" : "ghost"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {/* Update status */}}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={student.status === "late" ? "secondary" : "ghost"}
                          size="icon"
                          className={cn("h-8 w-8", student.status === "late" && "bg-yellow-100 hover:bg-yellow-200 text-yellow-600")}
                          onClick={() => {/* Update status */}}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1">Save Attendance</Button>
                <Button variant="outline" className="flex-1">Mark All Present</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>Choose a date to view or edit attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          {/* Attendance Patterns */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Attendance Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Best Day</span>
                    <span className="font-medium">Wednesday</span>
                  </div>
                  <p className="text-xs text-muted-foreground">92% average attendance</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Worst Day</span>
                    <span className="font-medium">Monday</span>
                  </div>
                  <p className="text-xs text-muted-foreground">81% average attendance</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Chronic Absences</span>
                    <span className="font-medium text-amber-600">2 students</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Missing &gt;10% of classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}