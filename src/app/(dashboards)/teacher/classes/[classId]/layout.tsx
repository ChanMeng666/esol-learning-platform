"use client";

import { useState, useEffect, ReactNode } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTeacherClasses, getClassStudents } from "@/actions/classes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { ClassContext } from './context';

export default function ClassLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const classId = params.classId as string;
  const [classData, setClassData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation tabs for class sub-pages
  const classNavItems = [
    { href: `/teacher/classes/${classId}`, label: "Students" },
    { href: `/teacher/classes/${classId}/schedule`, label: "Schedule" },
    { href: `/teacher/classes/${classId}/materials`, label: "Materials" },
    { href: `/teacher/classes/${classId}/attendance`, label: "Attendance" },
  ];

  useEffect(() => {
    const loadClassData = async () => {
      try {
        const classes = await getTeacherClasses();
        const currentClass = classes?.find(
          (c: any) => c.id.toString() === classId
        );
        setClassData(currentClass);

        // Load students if class found
        if (currentClass) {
          const studentsData = await getClassStudents(currentClass.id);
          setStudents(studentsData || []);
        }
      } catch (error) {
        console.error("Failed to load class data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClassData();
  }, [classId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Class not found</p>
        <Link href="/teacher/classes" className="mt-4 text-primary hover:underline">
          Back to Classes
        </Link>
      </div>
    );
  }

  const studentCount = classData.enrollmentCount || classData.enrollmentCount || 0;

  return (
    <ClassContext.Provider value={{ classData, students, isLoading }}>
      <div className="flex flex-col gap-8">
        {/* Streamlined Class Header Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div>
                <h1 className="text-3xl font-bold">{classData.name}</h1>
                <p className="text-muted-foreground text-base">{classData.code} • {classData.academicYear}</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                <Users className="h-3.5 w-3.5" />
                {studentCount} {studentCount === 1 ? "student" : "students"}
              </Badge>
            </div>
            <Link
              href="/teacher/classes"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </Link>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8" aria-label="Class navigation">
            {classNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  pathname === item.href
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </ClassContext.Provider>
  );
}