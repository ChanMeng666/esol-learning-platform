"use client";

import { createContext, useContext } from "react";

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

export const AssignmentContext = createContext<AssignmentContextType | null>(null);

export function useAssignmentContext() {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error("useAssignmentContext must be used within AssignmentLayout");
  }
  return context;
}