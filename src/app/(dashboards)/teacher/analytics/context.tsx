"use client";

import { createContext, useContext } from "react";

// Context for sharing analytics data
interface AnalyticsContextType {
  classes: any[];
  selectedClass: any;
  setSelectedClass: (cls: any) => void;
  analyticsData: any;
  timeRange: string;
  setTimeRange: (range: string) => void;
  isLoading: boolean;
}

export const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalyticsContext must be used within AnalyticsLayout");
  }
  return context;
}