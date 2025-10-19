"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Get user progress data
 */
export async function getUserProgress() {
  return fetchWithDrizzle(async (db, { userId }) => {
    const progress = await db.query.userProgress.findFirst({
      where: eq(schema.userProgress.userId, userId),
    });
    
    return progress;
  });
}

/**
 * Initialize user progress for first-time users
 */
export async function initializeUserProgress() {
  return fetchWithDrizzle(async (db, { userId }) => {
    // Check if user already has progress
    const existing = await db.query.userProgress.findFirst({
      where: eq(schema.userProgress.userId, userId),
    });
    
    if (existing) {
      return existing;
    }
    
    // Create initial progress
    const [newProgress] = await db.insert(schema.userProgress).values({
      userId,
      currentLevel: "foundation",
    }).returning();
    
    // Initialize default achievements
    await initializeAchievements(userId);
    
    revalidatePath("/dashboard");
    return newProgress;
  });
}

/**
 * Initialize default achievements for a new user
 */
async function initializeAchievements(userId: string) {
  return fetchWithDrizzle(async (db) => {
    const defaultAchievements = [
      {
        userId,
        achievementId: "first-question",
        title: "First Steps",
        description: "Complete your first question",
        progress: 0,
        target: 1,
        reward: 50,
      },
      {
        userId,
        achievementId: "ten-questions",
        title: "Getting Started",
        description: "Complete 10 questions",
        progress: 0,
        target: 10,
        reward: 100,
      },
      {
        userId,
        achievementId: "fifty-questions",
        title: "Dedicated Learner",
        description: "Complete 50 questions",
        progress: 0,
        target: 50,
        reward: 250,
      },
      {
        userId,
        achievementId: "hundred-questions",
        title: "NZCEL Master",
        description: "Complete 100 questions",
        progress: 0,
        target: 100,
        reward: 500,
      },
      {
        userId,
        achievementId: "seven-day-streak",
        title: "Week Warrior",
        description: "Maintain a 7-day study streak",
        progress: 0,
        target: 7,
        reward: 200,
      },
      {
        userId,
        achievementId: "perfect-score",
        title: "Perfectionist",
        description: "Get 10 questions correct in a row",
        progress: 0,
        target: 10,
        reward: 300,
      },
    ];
    
    await db.insert(schema.achievements).values(defaultAchievements);
  });
}

/**
 * Update skill progress
 */
export async function updateSkillProgress(
  skill: "listening" | "speaking" | "reading" | "writing", 
  value: number
) {
  return fetchWithDrizzle(async (db, { userId }) => {
    const update = {
      [`${skill}Progress`]: Math.min(100, Math.max(0, value)),
      updatedAt: new Date(),
    };
    
    await db.update(schema.userProgress)
      .set(update)
      .where(eq(schema.userProgress.userId, userId));
    
    revalidatePath("/dashboard");
    revalidatePath("/practice");
  });
}

/**
 * Update current level
 */
export async function updateCurrentLevel(level: string) {
  return fetchWithDrizzle(async (db, { userId }) => {
    await db.update(schema.userProgress)
      .set({
        currentLevel: level,
        updatedAt: new Date(),
      })
      .where(eq(schema.userProgress.userId, userId));
    
    revalidatePath("/dashboard");
    revalidatePath("/practice");
  });
}

/**
 * Get all completed questions for the user
 */
export async function getCompletedQuestions() {
  return fetchWithDrizzle(async (db, { userId }) => {
    return db.query.completedQuestions.findMany({
      where: eq(schema.completedQuestions.userId, userId),
      orderBy: (questions, { desc }) => [desc(questions.completedAt)],
    });
  });
}

/**
 * Get all achievements for the user
 */
export async function getAchievements() {
  return fetchWithDrizzle(async (db, { userId }) => {
    return db.query.achievements.findMany({
      where: eq(schema.achievements.userId, userId),
    });
  });
}

/**
 * Get all badges for the user
 */
export async function getBadges() {
  return fetchWithDrizzle(async (db, { userId }) => {
    return db.query.badges.findMany({
      where: eq(schema.badges.userId, userId),
      orderBy: (badges, { desc }) => [desc(badges.earnedAt)],
    });
  });
}

/**
 * Submit an answer and update progress
 */
export async function submitAnswer(questionId: string, isCorrect: boolean, points: number) {
  return fetchWithDrizzle(async (db, { userId }) => {
    // Record completed question
    await db.insert(schema.completedQuestions).values({
      userId,
      questionId,
      isCorrect,
      pointsEarned: isCorrect ? points : 0,
    });

    // Get current progress
    const progress = await db.query.userProgress.findFirst({
      where: eq(schema.userProgress.userId, userId),
    });

    if (!progress) return;

    // Update points and questions completed
    const newTotalPoints = (progress.totalPoints || 0) + (isCorrect ? points : 0);
    const newQuestionsCompleted = (progress.questionsCompleted || 0) + 1;
    const newCorrectAnswers = (progress.correctAnswers || 0) + (isCorrect ? 1 : 0);
    const newPerfectStreak = isCorrect ? (progress.perfectStreak || 0) + 1 : 0;

    // Update streak
    const lastStudy = progress.lastStudyDate ? new Date(progress.lastStudyDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = progress.streak || 0;
    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Same day, keep streak
        newStreak = progress.streak || 0;
      } else if (daysDiff === 1) {
        // Next day, increment streak
        newStreak = (progress.streak || 0) + 1;
      } else {
        // Gap, reset streak
        newStreak = 1;
      }
    } else {
      // First time
      newStreak = 1;
    }

    await db.update(schema.userProgress)
      .set({
        totalPoints: newTotalPoints,
        questionsCompleted: newQuestionsCompleted,
        correctAnswers: newCorrectAnswers,
        perfectStreak: newPerfectStreak,
        streak: newStreak,
        lastStudyDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.userProgress.userId, userId));

    // Check and update achievements
    await checkAndUpdateAchievements(userId, {
      questionsCompleted: newQuestionsCompleted,
      streak: newStreak,
      perfectStreak: newPerfectStreak,
    });

    revalidatePath("/dashboard");
    revalidatePath("/practice");

    return {
      totalPoints: newTotalPoints,
      questionsCompleted: newQuestionsCompleted,
      streak: newStreak,
    };
  });
}

/**
 * Check and update achievements based on progress
 */
async function checkAndUpdateAchievements(
  userId: string,
  stats: { questionsCompleted: number; streak: number; perfectStreak: number }
) {
  return fetchWithDrizzle(async (db) => {
    const achievements = await db.query.achievements.findMany({
      where: eq(schema.achievements.userId, userId),
    });

    const updates: Array<{ id: bigint; progress: number; completed: boolean; reward: number }> = [];

    for (const achievement of achievements) {
      let newProgress = achievement.progress || 0;
      let shouldUpdate = false;

      // Update progress based on achievement type
      if (achievement.achievementId.includes('question')) {
        newProgress = stats.questionsCompleted;
        shouldUpdate = true;
      } else if (achievement.achievementId.includes('streak') && !achievement.achievementId.includes('perfect')) {
        newProgress = stats.streak;
        shouldUpdate = true;
      } else if (achievement.achievementId.includes('perfect')) {
        newProgress = stats.perfectStreak;
        shouldUpdate = true;
      }

      // Check if newly completed
      if (shouldUpdate && !achievement.isCompleted && newProgress >= achievement.target) {
        updates.push({
          id: achievement.id,
          progress: newProgress,
          completed: true,
          reward: achievement.reward || 0,
        });
      } else if (shouldUpdate && newProgress !== achievement.progress) {
        updates.push({
          id: achievement.id,
          progress: newProgress,
          completed: false,
          reward: 0,
        });
      }
    }

    // Apply updates
    for (const update of updates) {
      await db.update(schema.achievements)
        .set({
          progress: update.progress,
          isCompleted: update.completed,
          completedAt: update.completed ? new Date() : null,
        })
        .where(eq(schema.achievements.id, update.id));

      // Award bonus points for completed achievements
      if (update.completed && update.reward > 0) {
        const progress = await db.query.userProgress.findFirst({
          where: eq(schema.userProgress.userId, userId),
        });

        if (progress) {
          await db.update(schema.userProgress)
            .set({
              totalPoints: (progress.totalPoints || 0) + update.reward,
            })
            .where(eq(schema.userProgress.userId, userId));
        }
      }
    }
  });
}

/**
 * Award a badge to the user
 */
export async function awardBadge(
  badgeId: string,
  name: string,
  description: string,
  rarity: "common" | "rare" | "epic" | "legendary"
) {
  return fetchWithDrizzle(async (db, { userId }) => {
    // Check if badge already exists
    const existing = await db.query.badges.findFirst({
      where: eq(schema.badges.userId, userId),
    });

    if (existing) return existing;

    const [badge] = await db.insert(schema.badges).values({
      userId,
      badgeId,
      name,
      description,
      rarity,
    }).returning();

    revalidatePath("/dashboard");
    return badge;
  });
}

/**
 * Add points to user progress
 */
export async function addPoints(points: number) {
  return fetchWithDrizzle(async (db, { userId }) => {
    const progress = await db.query.userProgress.findFirst({
      where: eq(schema.userProgress.userId, userId),
    });

    if (!progress) return;

    const newTotal = (progress.totalPoints || 0) + points;

    await db.update(schema.userProgress)
      .set({
        totalPoints: newTotal,
        updatedAt: new Date(),
      })
      .where(eq(schema.userProgress.userId, userId));

    revalidatePath("/dashboard");
    return newTotal;
  });
}
