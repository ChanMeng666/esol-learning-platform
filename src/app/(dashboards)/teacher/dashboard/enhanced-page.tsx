"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/data-table";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { LearningTimeChart } from "@/components/charts/learning-time-chart";
import { ClassScheduleCalendar } from "@/components/calendar/fullcalendar-schedule";
import { GradeSpreadsheet } from "@/components/spreadsheet/grade-spreadsheet";
import { AdvancedFilter, type FilterConfig, type FilterValue } from "@/components/filters/advanced-filter";
import { useContainerQuery } from "@/hooks/use-container-query";
import {
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  Calendar,
  FileSpreadsheet,
  BarChart3,
  Target,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

// Sample data for charts
const progressData = [
  { date: "Mon", listening: 75, speaking: 68, reading: 82, writing: 70, overall: 74 },
  { date: "Tue", listening: 78, speaking: 70, reading: 85, writing: 72, overall: 76 },
  { date: "Wed", listening: 80, speaking: 73, reading: 87, writing: 75, overall: 79 },
  { date: "Thu", listening: 82, speaking: 75, reading: 88, writing: 78, overall: 81 },
  { date: "Fri", listening: 85, speaking: 78, reading: 90, writing: 80, overall: 83 },
  { date: "Sat", listening: 87, speaking: 80, reading: 92, writing: 82, overall: 85 },
  { date: "Sun", listening: 88, speaking: 82, reading: 93, writing: 85, overall: 87 },
];

const skillData = [
  { skill: "Listening", current: 85, target: 90 },
  { skill: "Speaking", current: 78, target: 85 },
  { skill: "Reading", current: 92, target: 95 },
  { skill: "Writing", current: 80, target: 88 },
  { skill: "Grammar", current: 88, target: 90 },
  { skill: "Vocabulary", current: 75, target: 85 },
];

const timeData = [
  { day: "Mon", time: 45, sessions: 2 },
  { day: "Tue", time: 30, sessions: 1 },
  { day: "Wed", time: 60, sessions: 3 },
  { day: "Thu", time: 25, sessions: 1 },
  { day: "Fri", time: 50, sessions: 2 },
  { day: "Sat", time: 40, sessions: 2 },
  { day: "Sun", time: 35, sessions: 2 },
];

// Sample student data for table
interface Student {
  id: string;
  name: string;
  email: string;
  level: string;
  progress: number;
  lastActive: string;
  status: "active" | "inactive" | "pending";
}

const students: Student[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    level: "Level 3",
    progress: 75,
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    name: "Emma Johnson",
    email: "emma.j@example.com",
    level: "Level 4",
    progress: 88,
    lastActive: "1 day ago",
    status: "active",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    level: "Level 2",
    progress: 62,
    lastActive: "3 days ago",
    status: "inactive",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    level: "Level 3",
    progress: 80,
    lastActive: "5 hours ago",
    status: "active",
  },
];

// Table columns definition
const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const progress = row.getValue("progress") as number;
      return (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colors = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        pending: "bg-yellow-100 text-yellow-800",
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
          {status}
        </span>
      );
    },
  },
];

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    id: "level",
    label: "Level",
    type: "multiselect",
    options: [
      { value: "level-1", label: "Level 1" },
      { value: "level-2", label: "Level 2" },
      { value: "level-3", label: "Level 3" },
      { value: "level-4", label: "Level 4" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    id: "progress",
    label: "Progress",
    type: "range",
    min: 0,
    max: 100,
    step: 10,
  },
  {
    id: "lastActive",
    label: "Last Active",
    type: "daterange",
  },
];

export default function EnhancedTeacherDashboard() {
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const { ref, when, isLgUp, isMdUp } = useContainerQuery<HTMLDivElement>();

  return (
    <div ref={ref} className="space-y-8 p-8 container-responsive">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enhanced Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive overview with advanced components
        </p>
      </div>

      {/* Stats Overview */}
      <div className={`grid gap-4 ${isLgUp ? "grid-cols-4" : isMdUp ? "grid-cols-2" : "grid-cols-1"}`}>
        <StatCard
          title="Total Students"
          value="156"
          description="Active learners"
          icon={Users}
          trend={{ value: 12, label: "+12% this month" }}
          variant="info"
        />
        <StatCard
          title="Avg Progress"
          value="78%"
          description="Class average"
          icon={TrendingUp}
          trend={{ value: 5, label: "+5% from last week" }}
          variant="success"
          footer={{
            label: "On track to meet goals"
          }}
        />
        <StatCard
          title="Lessons Completed"
          value="1,284"
          description="This month"
          icon={BookOpen}
          trend={{ value: 8, label: "+8% increase" }}
          variant="primary"
        />
        <StatCard
          title="Achievements"
          value="342"
          description="Badges earned"
          icon={Trophy}
          variant="warning"
          footer={{
            label: "🏆 42 this week"
          }}
        />
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className={`grid gap-4 ${isLgUp ? "grid-cols-2" : "grid-cols-1"}`}>
            <ProgressLineChart
              data={progressData}
              title="Weekly Progress"
              description="Student skill improvement trends"
              className="card-container"
            />
            <SkillRadarChart
              data={skillData}
              title="Class Skill Balance"
              description="Average proficiency distribution"
              className="card-container"
            />
          </div>
          <LearningTimeChart
            data={timeData}
            title="Study Time Distribution"
            description="Daily learning activity patterns"
            className="chart-container"
          />
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdvancedFilter
                filters={filterConfig}
                values={filterValues}
                onChange={setFilterValues}
                onApply={(values) => console.log("Filters applied:", values)}
                onReset={() => setFilterValues({})}
              />
              <DataTable
                columns={columns}
                data={students}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <ClassScheduleCalendar
            organizationId={BigInt(1)}
            userId="teacher-1"
            userRole="teacher"
          />
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades">
          <GradeSpreadsheet
            organizationId={BigInt(1)}
            classId="class-1"
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className={`grid gap-4 ${isMdUp ? "grid-cols-3" : "grid-cols-1"}`}>
            <Card className="card-container">
              <CardHeader>
                <CardTitle className="text-base">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  Assignment completion this week
                </p>
                <div className="mt-3 h-32">
                  <BarChart3 className="h-full w-full text-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-container">
              <CardHeader>
                <CardTitle className="text-base">Engagement Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.5/10</div>
                <p className="text-xs text-muted-foreground">
                  Average class engagement
                </p>
                <div className="mt-3 h-32">
                  <Target className="h-full w-full text-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-container">
              <CardHeader>
                <CardTitle className="text-base">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Students online now
                </p>
                <div className="mt-3 h-32">
                  <Users className="h-full w-full text-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={`grid gap-4 ${isLgUp ? "grid-cols-2" : "grid-cols-1"}`}>
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <SkillRadarChart
                  data={[
                    { skill: "A+ Students", current: 15, target: 20 },
                    { skill: "A Students", current: 35, target: 40 },
                    { skill: "B Students", current: 40, target: 30 },
                    { skill: "C Students", current: 8, target: 8 },
                    { skill: "D Students", current: 2, target: 2 },
                  ]}
                  showTarget={false}
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <LearningTimeChart
                  data={[
                    { day: "Mon", time: 320, sessions: 45 },
                    { day: "Tue", time: 280, sessions: 38 },
                    { day: "Wed", time: 350, sessions: 52 },
                    { day: "Thu", time: 290, sessions: 41 },
                    { day: "Fri", time: 310, sessions: 44 },
                    { day: "Sat", time: 180, sessions: 24 },
                    { day: "Sun", time: 150, sessions: 20 },
                  ]}
                  title=""
                  description=""
                  height={250}
                  goalMinutes={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}