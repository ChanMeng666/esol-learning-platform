"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingState, SkeletonCard } from "@/components/shared/loading-state";
import { EmptyClassesState } from "@/components/shared/empty-state";
import { getTeacherClasses } from "@/actions/classes";
import { Users, Search, GraduationCap, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function TeacherClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    // Filter classes based on search query
    if (searchQuery) {
      const filtered = classes.filter(
        (cls) =>
          cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.academicYear.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses(classes);
    }
  }, [searchQuery, classes]);

  async function loadClasses() {
    try {
      setLoading(true);
      const data = await getTeacherClasses();
      setClasses(data);
      setFilteredClasses(data);
    } catch (error) {
      console.error("Error loading classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  }

  function handleClassClick(classId: bigint) {
    router.push(`/teacher/classes/${classId}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Classes</h1>
          <p className="text-muted-foreground">
            Manage your classes and track student progress
          </p>
        </div>

        {/* Search and Filters */}
        {classes.length > 0 && (
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No classes found</h3>
              <p className="text-muted-foreground">
                No classes match your search "{searchQuery}"
              </p>
            </div>
          ) : (
            <EmptyClassesState onCreateClass={() => toast.info("Contact admin to create classes")} />
          )
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((cls) => (
              <Card
                key={cls.id.toString()}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleClassClick(cls.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <GraduationCap className="w-10 h-10 text-primary" />
                    <Badge variant="secondary">{cls.academicYear}</Badge>
                  </div>
                  <CardTitle className="text-xl">{cls.name}</CardTitle>
                  <CardDescription>
                    {cls.isActive ? "Active" : "Inactive"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Student Count */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {cls.studentCount || 0} student{cls.studentCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">Assignments</p>
                      <p className="text-lg font-bold">-</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">Avg Progress</p>
                      <p className="text-lg font-bold">-</p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {classes.length > 0 && (
          <div className="mt-8 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Classes</p>
                <p className="text-2xl font-bold">{classes.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                <p className="text-2xl font-bold">
                  {classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Academic Year</p>
                <p className="text-2xl font-bold">
                  {classes[0]?.academicYear || "-"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
