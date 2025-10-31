"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table/data-table";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { ClassScheduleCalendar } from "@/components/calendar/fullcalendar-schedule";
import { getTeacherClasses } from "@/actions/classes";
import {
  Users,
  GraduationCap,
  Clock,
  Calendar,
  MapPin,
  BookOpen,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Define columns for students in class
const studentColumns = [
  {
    accessorKey: "name",
    header: "Student Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "attendance",
    header: "Attendance",
    cell: ({ row }: any) => {
      const attendance = row.original.attendance || 0;
      return (
        <div className="flex items-center gap-2">
          <Progress value={attendance} className="w-20 h-2" />
          <span className="text-xs text-muted-foreground">{attendance}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }: any) => {
      const progress = row.original.progress || 0;
      return (
        <div className="flex items-center gap-2">
          <Progress value={progress} className="w-20 h-2" />
          <span className="text-xs font-medium">{progress}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "grade",
    header: "Current Grade",
    cell: ({ row }: any) => {
      const grade = row.original.grade;
      const gradeColor = grade >= 90 ? "success" : grade >= 80 ? "info" : grade >= 70 ? "warning" : "destructive";
      return <Badge variant={gradeColor as any}>{grade}%</Badge>;
    },
  },
];

export default function TeacherClassesPage() {
  return (
    <ProtectedRoute>
      <ClassesPageContent />
    </ProtectedRoute>
  );
}

function ClassesPageContent() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<any>(null);

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
        toast.error("Failed to load your classes");
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

  // Mock student data for selected class
  const mockStudents = selectedClass ? [
    { id: "1", name: "Alex Chen", email: "alex@example.com", attendance: 95, progress: 87, grade: 92 },
    { id: "2", name: "Sarah Kim", email: "sarah@example.com", attendance: 88, progress: 92, grade: 88 },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", attendance: 75, progress: 68, grade: 72 },
    { id: "4", name: "Emma Wilson", email: "emma@example.com", attendance: 92, progress: 85, grade: 86 },
    { id: "5", name: "James Lee", email: "james@example.com", attendance: 100, progress: 95, grade: 94 },
  ] : [];

  if (isLoading) {
    return <LoadingState />;
  }

  if (classes.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">Manage your classes and students</p>
        </div>
        <EmptyState
          title="No classes yet"
          description="You haven't been assigned to any classes"
          icon={<GraduationCap className="w-16 h-16" />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
        <p className="text-muted-foreground">
          Manage your {classes.length} {classes.length === 1 ? "class" : "classes"} and track student progress
        </p>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) => {
          const studentCount = classItem.enrollmentCount || classItem.enrollmentCount || 0;
          const isSelected = selectedClass?.id === classItem.id;

          return (
            <Card
              key={classItem.id.toString()}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedClass(classItem)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <CardDescription>{classItem.code}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/teacher/classes/${classItem.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Class
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Students
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Archive Class
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{studentCount} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.schedule || "MWF 9-10am"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.room || "Room 204"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.level || "NZCEL Level 3"}</span>
                  </div>
                </div>

                {/* Class Stats */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Attendance</span>
                    <span className="font-medium">88%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Progress</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/teacher/classes/${classItem.id}/attendance`);
                    }}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Attendance
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/teacher/classes/${classItem.id}/materials`);
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Materials
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Class Details */}
      {selectedClass && (
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedClass.name} - Students</CardTitle>
                    <CardDescription>
                      Manage and track student progress
                    </CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={studentColumns}
                  data={mockStudents}
                  searchKey="name"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-6">
            <Card className="p-0">
              <CardContent className="p-0">
                <ClassScheduleCalendar
                  organizationId={BigInt(1)}
                  userId="teacher-user"
                  userRole="teacher"
                  className="w-full"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Class Materials</CardTitle>
                    <CardDescription>
                      Resources and materials for {selectedClass.name}
                    </CardDescription>
                  </div>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Material
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Unit 1 - Introduction.pdf", size: "2.4 MB", uploaded: "2 days ago" },
                    { name: "Grammar Exercises.docx", size: "1.1 MB", uploaded: "1 week ago" },
                    { name: "Speaking Practice Audio.mp3", size: "5.2 MB", uploaded: "2 weeks ago" },
                    { name: "Assignment Guidelines.pdf", size: "0.8 MB", uploaded: "3 weeks ago" },
                  ].map((material, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{material.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {material.size} • Uploaded {material.uploaded}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}