"use client";

import { useCopilotReadable } from "@copilotkit/react-core";
import { useUserProgress } from "@/lib/store/user-progress";
import { NZCEL_LEVELS } from "@/data/nzcel-levels";

/**
 * CopilotContext provides the AI with real-time information about:
 * - Student's current level and progress
 * - Completed questions and achievements
 * - Learning streak and points
 * - NZCEL framework information
 */
export function CopilotContext({ children }: { children: React.ReactNode }) {
  const userProgress = useUserProgress();

  // Provide current user progress to Copilot
  useCopilotReadable({
    description: "The student's current NZCEL level and target level",
    value: {
      currentLevel: userProgress.currentLevel,
      targetLevel: userProgress.targetLevel,
    },
  });

  useCopilotReadable({
    description: "The student's skill progress across all four language skills (listening, speaking, reading, writing), represented as percentages from 0-100",
    value: userProgress.skillProgress,
  });

  useCopilotReadable({
    description: "The student's gamification stats including total points earned, current study streak in days, and number of questions completed",
    value: {
      totalPoints: userProgress.totalPoints,
      streak: userProgress.streak,
      completedQuestionsCount: userProgress.completedQuestions.length,
      lastStudyDate: userProgress.lastStudyDate,
    },
  });

  useCopilotReadable({
    description: "The student's achievements and badges, showing progress toward learning goals",
    value: {
      achievements: userProgress.achievements.map((a) => ({
        title: a.title,
        description: a.description,
        progress: a.progress,
        target: a.target,
        completed: a.completed,
      })),
      badges: userProgress.badges.map((b) => ({
        name: b.name,
        description: b.description,
        rarity: b.rarity,
      })),
    },
  });

  // Provide NZCEL framework information
  useCopilotReadable({
    description: "Complete NZCEL framework information including all levels (Foundation through Level 6), their descriptions, graduate outcomes, and pathways",
    value: NZCEL_LEVELS.map((level) => ({
      id: level.id,
      name: level.name,
      description: level.description,
      strategicPurpose: level.strategicPurpose,
      graduateOutcomes: level.graduateOutcomes,
      pathways: level.pathways,
      equivalency: level.equivalency,
    })),
  });

  return <>{children}</>;
}
