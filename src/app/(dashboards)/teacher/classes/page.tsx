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
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
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
    <div className="flex flex-col gap-8">
      {/* Simplified Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
      </div>

      {/* Streamlined Class Cards Grid - 2 columns for better readability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((classItem) => {
          const studentCount = classItem.enrollmentCount || 0;

          return (
            <Card
              key={classItem.id.toString()}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => router.push(`/teacher/classes/${classItem.id}`)}
            >
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="text-xl">{classItem.name}</CardTitle>
                    <CardDescription className="text-base">{classItem.code} • {classItem.academicYear}</CardDescription>
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {studentCount} {studentCount === 1 ? "student" : "students"}
                  </span>
                  {classItem.averageScore && (
                    <>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="text-sm">Avg: {classItem.averageScore}%</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}