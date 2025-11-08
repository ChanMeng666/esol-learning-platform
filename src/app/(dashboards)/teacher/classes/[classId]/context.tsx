"use client";

import { createContext, useContext } from "react";

// Context for sharing class data across sub-pages
interface ClassContextType {
  classData: any;
  students: any[];
  isLoading: boolean;
}

export const ClassContext = createContext<ClassContextType | null>(null);

export function useClassContext() {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within ClassLayout");
  }
  return context;
}
