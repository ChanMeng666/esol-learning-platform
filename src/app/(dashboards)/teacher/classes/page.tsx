"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { getTeacherClasses } from "@/actions/classes";
import {
  Users,
  GraduationCap,
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
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getTeacherClasses();
        setClasses(data || []);
      } catch (error) {
        console.error("Failed to load classes:", error);
        toast.error("Failed to load your classes");
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

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
          action={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">
            Manage your {classes.length} {classes.length === 1 ? "class" : "classes"} and track student progress
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Avg. Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">88%</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Next Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">ENG-301</div>
            <p className="text-xs text-muted-foreground">In 2 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) => {
          const studentCount = classItem.enrollmentCount || 0;

          return (
            <Card
              key={classItem.id.toString()}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
              onClick={() => router.push(`/teacher/classes/${classItem.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <CardDescription>{classItem.code}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/teacher/classes/${classItem.id}`);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Class
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Students
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Attendance</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Progress</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across all your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Assignment submitted</p>
                <p className="text-xs text-muted-foreground">5 students from ENG-301 submitted their essays</p>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">New material uploaded</p>
                <p className="text-xs text-muted-foreground">Grammar workbook added to ENG-201</p>
              </div>
              <span className="text-xs text-muted-foreground">5 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-amber-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Low attendance alert</p>
                <p className="text-xs text-muted-foreground">ENG-101 had only 75% attendance yesterday</p>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}