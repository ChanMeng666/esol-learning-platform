"use client";

import { useState, useEffect, ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTeacherClasses } from "@/actions/classes";
import { getClassInsights } from "@/actions/teacher-insights";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { InsightsContext } from './context';

// Navigation tabs for insights sub-pages
const insightsNavItems = [
  { href: "/teacher/insights", label: "Overview" },
  { href: "/teacher/insights/students", label: "Student Insights" },
  { href: "/teacher/insights/patterns", label: "Learning Patterns" },
  { href: "/teacher/insights/recommendations", label: "Recommendations" },
];

export default function InsightsLayout({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [timeframe, setTimeframe] = useState("week");
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const loadData = async () => {
      try {
        const classData = await getTeacherClasses();
        setClasses(classData || []);
        if (classData && classData.length > 0) {
          setSelectedClass(classData[0]);

          // Load real insights for first class
          try {
            const classInsights = await getClassInsights(classData[0].id);
            setInsights(classInsights || []);
          } catch (err) {
            console.error("Failed to load insights:", err);
            setInsights([]);
          }
        }
      } catch (error) {
        console.error("Failed to load insights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Load insights when selected class changes
  useEffect(() => {
    const loadInsights = async () => {
      if (selectedClass) {
        try {
          const classInsights = await getClassInsights(selectedClass.id);
          setInsights(classInsights || []);
        } catch (err) {
          console.error("Failed to load insights:", err);
          setInsights([]);
        }
      }
    };

    loadInsights();
  }, [selectedClass]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <InsightsContext.Provider
      value={{
        classes,
        selectedClass,
        setSelectedClass,
        timeframe,
        setTimeframe,
        isLoading,
        insightsData: insights,
      }}
    >
      <div className="flex flex-col gap-8">
        {/* Simplified Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={selectedClass?.id?.toString()}
            onValueChange={(value) => {
              const classItem = classes.find((c) => c.id.toString() === value);
              setSelectedClass(classItem);
            }}
          >
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((classItem) => (
                <SelectItem key={classItem.id.toString()} value={classItem.id.toString()}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8" aria-label="Insights navigation">
            {insightsNavItems.map((item) => (
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
    </InsightsContext.Provider>
  );
}