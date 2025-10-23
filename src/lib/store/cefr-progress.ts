import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CEFRLevel, SkillProgress } from "@/types";

/**
 * CEFR Progress Store (Client-side Cache)
 *
 * Parallel to user-progress.ts but for CEFR-based general practice
 * Cached in localStorage for fast UI updates
 * Server Actions are the source of truth
 */

interface CEFRProgressState {
  // Current state
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel | null;
  skillProgress: SkillProgress;
  totalPoints: number;
  questionsCompleted: number;

  // Actions
  setCurrentLevel: (level: CEFRLevel) => void;
  setTargetLevel: (level: CEFRLevel | null) => void;
  updateSkillProgress: (skill: keyof SkillProgress, progress: number) => void;
  incrementStats: (pointsEarned: number) => void;
  resetProgress: () => void;
  loadFromServer: (serverData: Partial<CEFRProgressState>) => void;
}

// Initial state with demo data for development
const initialState = {
  currentLevel: "A1" as CEFRLevel,
  targetLevel: "B2" as CEFRLevel,
  skillProgress: {
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
  },
  totalPoints: 0,
  questionsCompleted: 0,
};

export const useCEFRProgress = create<CEFRProgressState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentLevel: (level) =>
        set(() => ({
          currentLevel: level,
        })),

      setTargetLevel: (level) =>
        set(() => ({
          targetLevel: level,
        })),

      updateSkillProgress: (skill, progress) =>
        set((state) => ({
          skillProgress: {
            ...state.skillProgress,
            [skill]: Math.max(0, Math.min(100, progress)),
          },
        })),

      incrementStats: (pointsEarned) =>
        set((state) => ({
          questionsCompleted: state.questionsCompleted + 1,
          totalPoints: state.totalPoints + pointsEarned,
        })),

      resetProgress: () =>
        set(() => ({
          ...initialState,
        })),

      /**
       * Load data from server
       * Should be called after fetching from Server Actions
       */
      loadFromServer: (serverData) =>
        set((state) => ({
          ...state,
          ...serverData,
        })),
    }),
    {
      name: "cefr-progress-storage",
      // Only persist specific fields to localStorage
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        targetLevel: state.targetLevel,
        skillProgress: state.skillProgress,
        totalPoints: state.totalPoints,
        questionsCompleted: state.questionsCompleted,
      }),
    }
  )
);

/**
 * Helper hook to get average skill progress
 */
export function useAverageCEFRProgress() {
  const { skillProgress } = useCEFRProgress();
  return Math.round(
    (skillProgress.listening +
      skillProgress.speaking +
      skillProgress.reading +
      skillProgress.writing) /
      4
  );
}

/**
 * Helper hook to get progress towards target level
 * Simple heuristic: average skill progress determines level progression
 */
export function useCEFRLevelProgress() {
  const { currentLevel, targetLevel } = useCEFRProgress();
  const averageProgress = useAverageCEFRProgress();

  const levelOrder: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const currentIndex = levelOrder.indexOf(currentLevel);
  const targetIndex = targetLevel ? levelOrder.indexOf(targetLevel) : -1;

  if (targetIndex === -1 || targetIndex <= currentIndex) {
    return {
      currentLevel,
      targetLevel,
      levelsToGo: 0,
      progressToNextLevel: averageProgress,
    };
  }

  return {
    currentLevel,
    targetLevel,
    levelsToGo: targetIndex - currentIndex,
    progressToNextLevel: averageProgress,
  };
}
