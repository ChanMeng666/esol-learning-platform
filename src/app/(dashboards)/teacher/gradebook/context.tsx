"use client";

import { createContext, useContext } from "react";

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

export const GradebookContext = createContext<GradebookContextType | null>(null);

export function useGradebookContext() {
  const context = useContext(GradebookContext);
  if (!context) {
    throw new Error("useGradebookContext must be used within GradebookLayout");
  }
  return context;
}
