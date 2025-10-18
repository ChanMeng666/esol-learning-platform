import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProgress, Badge, AnswerSubmission, NZCELLevel, SkillType } from "@/types";

interface UserProgressState extends UserProgress {
  // Actions
  setCurrentLevel: (level: NZCELLevel) => void;
  setTargetLevel: (level: NZCELLevel | null) => void;
  updateSkillProgress: (skill: SkillType, value: number) => void;
  addCompletedQuestion: (questionId: string) => void;
  addPoints: (points: number) => void;
  updateStreak: () => void;
  addBadge: (badge: Badge) => void;
  updateAchievement: (achievementId: string, progress: number) => void;
  completeAchievement: (achievementId: string) => void;
  submitAnswer: (submission: AnswerSubmission) => void;
  resetProgress: () => void;
}

const initialState: UserProgress = {
  currentLevel: "foundation",
  targetLevel: null,
  skillProgress: {
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
  },
  completedQuestions: [],
  totalPoints: 0,
  streak: 0,
  lastStudyDate: null,
  badges: [],
  achievements: [
    {
      id: "first-question",
      title: "First Steps",
      description: "Complete your first question",
      progress: 0,
      target: 1,
      completed: false,
      reward: 50,
    },
    {
      id: "ten-questions",
      title: "Getting Started",
      description: "Complete 10 questions",
      progress: 0,
      target: 10,
      completed: false,
      reward: 100,
    },
    {
      id: "fifty-questions",
      title: "Dedicated Learner",
      description: "Complete 50 questions",
      progress: 0,
      target: 50,
      completed: false,
      reward: 250,
    },
    {
      id: "hundred-questions",
      title: "NZCEL Master",
      description: "Complete 100 questions",
      progress: 0,
      target: 100,
      completed: false,
      reward: 500,
    },
    {
      id: "seven-day-streak",
      title: "Week Warrior",
      description: "Maintain a 7-day study streak",
      progress: 0,
      target: 7,
      completed: false,
      reward: 200,
    },
    {
      id: "perfect-score",
      title: "Perfectionist",
      description: "Get 10 questions correct in a row",
      progress: 0,
      target: 10,
      completed: false,
      reward: 300,
    },
  ],
};

export const useUserProgress = create<UserProgressState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentLevel: (level) => set({ currentLevel: level }),

      setTargetLevel: (level) => set({ targetLevel: level }),

      updateSkillProgress: (skill, value) =>
        set((state) => ({
          skillProgress: {
            ...state.skillProgress,
            [skill]: Math.min(100, Math.max(0, value)),
          },
        })),

      addCompletedQuestion: (questionId) =>
        set((state) => {
          if (state.completedQuestions.includes(questionId)) {
            return state;
          }
          return {
            completedQuestions: [...state.completedQuestions, questionId],
          };
        }),

      addPoints: (points) =>
        set((state) => ({
          totalPoints: state.totalPoints + points,
        })),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          const lastStudy = state.lastStudyDate ? new Date(state.lastStudyDate).toDateString() : null;

          if (lastStudy === today) {
            // Already studied today, no change
            return state;
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          let newStreak = state.streak;
          if (lastStudy === yesterdayStr) {
            // Continued streak
            newStreak = state.streak + 1;
          } else if (lastStudy !== today) {
            // Broke streak
            newStreak = 1;
          }

          return {
            streak: newStreak,
            lastStudyDate: today,
          };
        }),

      addBadge: (badge) =>
        set((state) => {
          if (state.badges.some((b) => b.id === badge.id)) {
            return state;
          }
          return {
            badges: [...state.badges, { ...badge, earnedAt: new Date().toISOString() }],
          };
        }),

      updateAchievement: (achievementId, progress) =>
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === achievementId
              ? { ...achievement, progress: Math.min(achievement.target, progress) }
              : achievement
          ),
        })),

      completeAchievement: (achievementId) =>
        set((state) => {
          const achievement = state.achievements.find((a) => a.id === achievementId);
          if (!achievement || achievement.completed) {
            return state;
          }

          return {
            achievements: state.achievements.map((a) =>
              a.id === achievementId ? { ...a, completed: true, progress: a.target } : a
            ),
            totalPoints: state.totalPoints + achievement.reward,
          };
        }),

      submitAnswer: (submission) =>
        set((state) => {
          const newState = { ...state };

          // Add completed question
          if (!newState.completedQuestions.includes(submission.questionId)) {
            newState.completedQuestions = [...newState.completedQuestions, submission.questionId];
          }

          // Update streak
          const today = new Date().toDateString();
          if (newState.lastStudyDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (newState.lastStudyDate === yesterdayStr) {
              newState.streak = newState.streak + 1;
            } else {
              newState.streak = 1;
            }
            newState.lastStudyDate = today;
          }

          // Check achievements
          const questionCount = newState.completedQuestions.length;
          newState.achievements = newState.achievements.map((achievement) => {
            if (achievement.id === "first-question" && questionCount >= 1 && !achievement.completed) {
              newState.totalPoints += achievement.reward;
              return { ...achievement, progress: questionCount, completed: true };
            }
            if (achievement.id === "ten-questions" && questionCount >= 10 && !achievement.completed) {
              newState.totalPoints += achievement.reward;
              return { ...achievement, progress: questionCount, completed: true };
            }
            if (achievement.id === "fifty-questions" && questionCount >= 50 && !achievement.completed) {
              newState.totalPoints += achievement.reward;
              return { ...achievement, progress: questionCount, completed: true };
            }
            if (achievement.id === "hundred-questions" && questionCount >= 100 && !achievement.completed) {
              newState.totalPoints += achievement.reward;
              return { ...achievement, progress: questionCount, completed: true };
            }
            if (achievement.id === "seven-day-streak" && newState.streak >= 7 && !achievement.completed) {
              newState.totalPoints += achievement.reward;
              return { ...achievement, progress: newState.streak, completed: true };
            }
            if (["first-question", "ten-questions", "fifty-questions", "hundred-questions"].includes(achievement.id)) {
              return { ...achievement, progress: questionCount };
            }
            if (achievement.id === "seven-day-streak") {
              return { ...achievement, progress: newState.streak };
            }
            return achievement;
          });

          return newState;
        }),

      resetProgress: () => set(initialState),
    }),
    {
      name: "nzcel-user-progress",
    }
  )
);
