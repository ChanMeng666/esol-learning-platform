"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getTeacherClasses } from "@/actions/classes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Download, Upload, Save } from "lucide-react";
import { toast } from "sonner";

// Context for sharing gradebook data across pages
interface GradebookContextType {
  classes: any[];
  selectedClass: any;
  setSelectedClass: (cls: any) => void;
  isLoading: boolean;
  isSaving: boolean;
  studentGrades: any[];
  classStats: any;
  gradeDistribution: any[];
  handleSaveGrades: () => Promise<void>;
  handleExportGrades: () => void;
}

const GradebookContext = createContext<GradebookContextType | null>(null);

export function useGradebookContext() {
  const context = useContext(GradebookContext);
  if (!context) {
    throw new Error("useGradebookContext must be used within GradebookLayout");
  }
  return context;
}

// Navigation tabs for gradebook sub-pages
const gradebookNavItems = [
  { href: "/teacher/gradebook", label: "Spreadsheet View" },
  { href: "/teacher/gradebook/summary", label: "Summary View" },
  { href: "/teacher/gradebook/distribution", label: "Distribution" },
  { href: "/teacher/gradebook/settings", label: "Grade Settings" },
];

export default function GradebookLayout({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const pathname = usePathname();

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
        toast.error("Failed to load classes");
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

  // Mock student grades data
  const studentGrades = selectedClass ? [
    { id: "1", name: "Alex Chen", assignments: 92, quizzes: 88, midterm: 90, final: 94, participation: 95, overall: 91, letterGrade: "A", trend: "up" },
    { id: "2", name: "Sarah Kim", assignments: 88, quizzes: 85, midterm: 87, final: 89, participation: 92, overall: 88, letterGrade: "B+", trend: "stable" },
    { id: "3", name: "Mike Johnson", assignments: 75, quizzes: 72, midterm: 70, final: 73, participation: 80, overall: 74, letterGrade: "C", trend: "down" },
    { id: "4", name: "Emma Wilson", assignments: 85, quizzes: 88, midterm: 86, final: 87, participation: 90, overall: 87, letterGrade: "B+", trend: "up" },
    { id: "5", name: "James Lee", assignments: 95, quizzes: 93, midterm: 94, final: 96, participation: 98, overall: 95, letterGrade: "A+", trend: "stable" },
    { id: "6", name: "Lisa Brown", assignments: 82, quizzes: 80, midterm: 78, final: 81, participation: 85, overall: 81, letterGrade: "B", trend: "up" },
    { id: "7", name: "Tom Davis", assignments: 68, quizzes: 65, midterm: 67, final: 70, participation: 72, overall: 68, letterGrade: "D+", trend: "down" },
  ] : [];

  // Calculate grade distribution
  const gradeDistribution = [
    { grade: "A", count: 2, percentage: 28, range: "90-100%" },
    { grade: "B", count: 3, percentage: 43, range: "80-89%" },
    { grade: "C", count: 1, percentage: 14, range: "70-79%" },
    { grade: "D", count: 1, percentage: 14, range: "60-69%" },
    { grade: "F", count: 0, percentage: 0, range: "Below 60%" },
  ];

  // Calculate class statistics
  const classStats = studentGrades.length > 0 ? {
    average: Math.round(studentGrades.reduce((sum, s) => sum + s.overall, 0) / studentGrades.length),
    highest: Math.max(...studentGrades.map(s => s.overall)),
    lowest: Math.min(...studentGrades.map(s => s.overall)),
    median: 87,
    passingRate: Math.round((studentGrades.filter(s => s.overall >= 60).length / studentGrades.length) * 100),
  } : null;

  const handleSaveGrades = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Grades saved successfully");
    } catch (error) {
      toast.error("Failed to save grades");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportGrades = () => {
    toast.success("Grades exported to Excel");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading gradebook...</p>
        </div>
      </div>
    );
  }

  return (
    <GradebookContext.Provider
      value={{
        classes,
        selectedClass,
        setSelectedClass,
        isLoading,
        isSaving,
        studentGrades,
        classStats,
        gradeDistribution,
        handleSaveGrades,
        handleExportGrades,
      }}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
          <p className="text-muted-foreground">
            Manage and track student grades across your classes
          </p>
        </div>

        {/* Class Selector and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Select
            value={selectedClass?.id?.toString()}
            onValueChange={(value) => {
              const classItem = classes.find((c) => c.id.toString() === value);
              setSelectedClass(classItem);
            }}
          >
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((classItem) => (
                <SelectItem key={classItem.id.toString()} value={classItem.id.toString()}>
                  {classItem.name} ({classItem.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportGrades}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleSaveGrades} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8" aria-label="Gradebook navigation">
            {gradebookNavItems.map((item) => (
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
    </GradebookContext.Provider>
  );
}