"use client";

import { createContext, useContext } from "react";

// Context for sharing insights data
interface InsightsContextType {
  classes: any[];
  selectedClass: any;
  setSelectedClass: (cls: any) => void;
  timeframe: string;
  setTimeframe: (frame: string) => void;
  isLoading: boolean;
  insightsData: any;
}

export const InsightsContext = createContext<InsightsContextType | null>(null);

export function useInsightsContext() {
  const context = useContext(InsightsContext);
  if (!context) {
    throw new Error("useInsightsContext must be used within InsightsLayout");
  }
  return context;
}
