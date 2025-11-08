"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Assignment {
  id: string;
  title: string;
  description: string;
  childName: string;
  childAvatar?: string;
  subject: string;
  teacher: string;
  status: "completed" | "in_progress" | "not_started" | "overdue";
  dueDate: Date;
  submittedDate?: Date;
  grade?: number;
  feedback?: string;
  attachments?: string[];
  type: "homework" | "project" | "quiz" | "exam";
}

// Context for sharing assignment data across pages
interface AssignmentContextType {
  assignments: Assignment[];
  selectedChild: string;
  setSelectedChild: (child: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  isLoading: boolean;
  children: Array<{ id: string; name: string; avatar: string }>;
}

const AssignmentContext = createContext<AssignmentContextType | null>(null);

export function useAssignmentContext() {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error("useAssignmentContext must be used within AssignmentLayout");
  }
  return context;
}

// Navigation items for assignment sub-pages
const assignmentNavItems = [
  { href: "/parent/assignments", label: "All Assignments" },
  { href: "/parent/assignments/upcoming", label: "Upcoming" },
  { href: "/parent/assignments/graded", label: "Graded" },
];

export default function AssignmentLayout({ children: layoutChildren }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const children = [
    { id: "1", name: "Alice Johnson", avatar: "/avatars/alice.jpg" },
    { id: "2", name: "Bob Johnson", avatar: "/avatars/bob.jpg" },
  ];

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        // Mock data - replace with actual API call
        const mockAssignments: Assignment[] = [
          {
            id: "1",
            title: "English Essay - My Favorite Book",
            description: "Write a 500-word essay about your favorite book",
            childName: "Alice Johnson",
            childAvatar: "/avatars/alice.jpg",
            subject: "English",
            teacher: "Ms. Smith",
            status: "completed",
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            grade: 85,
            feedback: "Well-written essay with good structure. Great job!",
            type: "homework",
          },
          {
            id: "2",
            title: "Math Problem Set - Chapter 5",
            description: "Complete problems 1-20 from Chapter 5",
            childName: "Alice Johnson",
            childAvatar: "/avatars/alice.jpg",
            subject: "Mathematics",
            teacher: "Mr. Johnson",
            status: "in_progress",
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            type: "homework",
          },
          {
            id: "3",
            title: "Science Project - Solar System",
            description: "Create a model or presentation about the solar system",
            childName: "Bob Johnson",
            childAvatar: "/avatars/bob.jpg",
            subject: "Science",
            teacher: "Dr. Lee",
            status: "not_started",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            type: "project",
          },
          {
            id: "4",
            title: "History Quiz - Chapter 3",
            description: "Online quiz covering World War II",
            childName: "Alice Johnson",
            childAvatar: "/avatars/alice.jpg",
            subject: "History",
            teacher: "Mr. Brown",
            status: "completed",
            dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            submittedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            grade: 92,
            feedback: "Excellent understanding of the material!",
            type: "quiz",
          },
          {
            id: "5",
            title: "Art Assignment - Self Portrait",
            description: "Draw or paint a self-portrait",
            childName: "Bob Johnson",
            childAvatar: "/avatars/bob.jpg",
            subject: "Art",
            teacher: "Ms. Garcia",
            status: "overdue",
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            type: "homework",
          },
          {
            id: "6",
            title: "Mathematics Mid-term Exam",
            description: "Comprehensive exam covering chapters 1-5",
            childName: "Alice Johnson",
            childAvatar: "/avatars/alice.jpg",
            subject: "Mathematics",
            teacher: "Mr. Johnson",
            status: "completed",
            dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            submittedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            grade: 88,
            feedback: "Good work! Review fractions for improvement.",
            type: "exam",
          },
          {
            id: "7",
            title: "English Reading Comprehension",
            description: "Read chapter 5 and answer questions",
            childName: "Bob Johnson",
            childAvatar: "/avatars/bob.jpg",
            subject: "English",
            teacher: "Ms. Smith",
            status: "in_progress",
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            type: "homework",
          },
        ];

        // Filter based on selected child
        let filteredAssignments = mockAssignments;
        if (selectedChild !== "all") {
          const child = children.find(c => c.id === selectedChild);
          if (child) {
            filteredAssignments = mockAssignments.filter(a => a.childName === child.name);
          }
        }

        // Filter based on status
        if (statusFilter !== "all") {
          filteredAssignments = filteredAssignments.filter(a => a.status === statusFilter);
        }

        setAssignments(filteredAssignments);
      } catch (error) {
        console.error("Failed to load assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignments();
  }, [selectedChild, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        selectedChild,
        setSelectedChild,
        statusFilter,
        setStatusFilter,
        isLoading,
        children,
      }}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">
            Track and monitor your children's school assignments
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {children.map(child => (
                <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        <div className="border-b">
          <nav className="flex space-x-8" aria-label="Assignments navigation">
            {assignmentNavItems.map((item) => (
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
        {layoutChildren}
      </div>
    </AssignmentContext.Provider>
  );
}