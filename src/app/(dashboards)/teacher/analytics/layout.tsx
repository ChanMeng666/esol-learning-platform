"use client";

import { useState, useEffect, ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTeacherClasses, getLatestClassAnalytics } from "@/actions/classes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnalyticsContext } from './context';

// Navigation tabs for analytics sub-pages
const analyticsNavItems = [
  { href: "/teacher/analytics", label: "Performance" },
  { href: "/teacher/analytics/engagement", label: "Engagement" },
  { href: "/teacher/analytics/progress", label: "Progress" },
  { href: "/teacher/analytics/insights", label: "Insights" },
];

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("week");
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const loadData = async () => {
      try {
        const classData = await getTeacherClasses();
        setClasses(classData || []);
        if (classData && classData.length > 0) {
          setSelectedClass(classData[0]);
          // Load analytics for first class
          try {
            const analytics = await getLatestClassAnalytics(classData[0].id);
            setAnalyticsData(analytics);
          } catch (err) {
            console.error("Failed to load analytics:", err);
            setAnalyticsData(null);
          }
        }
      } catch (error) {
        console.error("Failed to load analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Load analytics when selected class changes
  useEffect(() => {
    const loadAnalytics = async () => {
      if (selectedClass) {
        try {
          const analytics = await getLatestClassAnalytics(selectedClass.id);
          setAnalyticsData(analytics);
        } catch (err) {
          console.error("Failed to load analytics:", err);
          setAnalyticsData(null);
        }
      }
    };

    loadAnalytics();
  }, [selectedClass]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <AnalyticsContext.Provider
      value={{
        classes,
        selectedClass,
        setSelectedClass,
        analyticsData,
        timeRange,
        setTimeRange,
        isLoading,
      }}
    >
      <div className="flex flex-col gap-8">
        {/* Simplified Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
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

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8" aria-label="Analytics navigation">
            {analyticsNavItems.map((item) => (
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
    </AnalyticsContext.Provider>
  );
}