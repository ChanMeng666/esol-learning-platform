"use server";

import { fetchWithDrizzle } from "@/lib/db";
import { cefrProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { CEFRLevel, SkillType } from "@/types";

/**
 * CEFR Progress Server Actions
 *
 * Handles all CEFR-based general practice progress tracking
 * Parallel to NZCEL progress system but for general English learning
 *
 * Multi-tenant: All operations are scoped to user's organization
 */

// ============================================================================
// GET CEFR PROGRESS
// ============================================================================

/**
 * Get user's CEFR progress
 * Creates initial progress record if none exists
 * Multi-tenant: Scoped to user's organization
 */
export async function getCEFRProgress() {
  return await fetchWithDrizzle(async (db, { userId, organizationId }) => {
    try {
      if (!organizationId) {
        throw new Error("Organization context required");
      }

      // Check if progress exists
      const existing = await db.query.cefrProgress.findFirst({
        where: and(
          eq(cefrProgress.userId, userId),
          eq(cefrProgress.organizationId, organizationId)
        ),
      });

      // Create initial progress if none exists
      if (!existing) {
        const [newProgress] = await db
          .insert(cefrProgress)
          .values({
            organizationId,
            userId,
            currentLevel: "A1",
            targetLevel: null,
            listeningProgress: 0,
            speakingProgress: 0,
            readingProgress: 0,
            writingProgress: 0,
            totalPoints: 0,
            questionsCompleted: 0,
          })
          .returning();

        return {
          currentLevel: newProgress.currentLevel as CEFRLevel,
          targetLevel: newProgress.targetLevel as CEFRLevel | null,
          skillProgress: {
            listening: newProgress.listeningProgress,
            speaking: newProgress.speakingProgress,
            reading: newProgress.readingProgress,
            writing: newProgress.writingProgress,
          },
          totalPoints: newProgress.totalPoints,
          questionsCompleted: newProgress.questionsCompleted,
        };
      }

      return {
        currentLevel: existing.currentLevel as CEFRLevel,
        targetLevel: existing.targetLevel as CEFRLevel | null,
        skillProgress: {
          listening: existing.listeningProgress,
          speaking: existing.speakingProgress,
          reading: existing.readingProgress,
          writing: existing.writingProgress,
        },
        totalPoints: existing.totalPoints,
        questionsCompleted: existing.questionsCompleted,
      };
    } catch (error) {
      console.error("[getCEFRProgress] Error:", error);
      throw new Error("Failed to get CEFR progress");
    }
  });
}

// ============================================================================
// UPDATE CEFR PROGRESS
// ============================================================================

/**
 * Update CEFR skill progress
 * Multi-tenant: Updates within user's organization only
 * @param skill - The skill to update (listening, speaking, reading, writing)
 * @param progress - Progress value (0-100)
 */
export async function updateCEFRSkillProgress(
  skill: SkillType,
  progress: number
) {
  return await fetchWithDrizzle(async (db, { userId, organizationId }) => {
    try {
      if (!organizationId) {
        throw new Error("Organization context required");
      }

      // Ensure progress exists
      await getCEFRProgress();

      // Clamp progress to 0-100
      const clampedProgress = Math.max(0, Math.min(100, progress));

      // Map skill to column name
      const skillColumnMap = {
        listening: "listeningProgress",
        speaking: "speakingProgress",
        reading: "readingProgress",
        writing: "writingProgress",
      };

      const columnName = skillColumnMap[skill];

      // Update the specific skill progress
      await db
        .update(cefrProgress)
        .set({
          [columnName]: clampedProgress,
          updatedAt: new Date(),
        })
        .where(and(
          eq(cefrProgress.userId, userId),
          eq(cefrProgress.organizationId, organizationId)
        ));

      revalidatePath("/practice/general");
      revalidatePath("/dashboard");

      return { success: true, skill, progress: clampedProgress };
    } catch (error) {
      console.error("[updateCEFRSkillProgress] Error:", error);
      throw new Error("Failed to update CEFR skill progress");
    }
  });
}

/**
 * Set user's current CEFR level
 * Multi-tenant: Updates within user's organization only
 * @param level - The CEFR level to set (A1-C2)
 */
export async function setCEFRLevel(level: CEFRLevel) {
  return await fetchWithDrizzle(async (db, { userId, organizationId }) => {
    try {
      if (!organizationId) {
        throw new Error("Organization context required");
      }

      // Ensure progress exists
      await getCEFRProgress();

      await db
        .update(cefrProgress)
        .set({
          currentLevel: level,
          updatedAt: new Date(),
        })
        .where(and(
          eq(cefrProgress.userId, userId),
          eq(cefrProgress.organizationId, organizationId)
        ));

      revalidatePath("/practice/general");
      revalidatePath("/dashboard");

      return { success: true, level };
    } catch (error) {
      console.error("[setCEFRLevel] Error:", error);
      throw new Error("Failed to set CEFR level");
    }
  });
}

/**
 * Set user's target CEFR level
 * Multi-tenant: Updates within user's organization only
 * @param level - The target CEFR level (A1-C2)
 */
export async function setCEFRTargetLevel(level: CEFRLevel | null) {
  return await fetchWithDrizzle(async (db, { userId, organizationId }) => {
    try {
      if (!organizationId) {
        throw new Error("Organization context required");
      }

      // Ensure progress exists
      await getCEFRProgress();

      await db
        .update(cefrProgress)
        .set({
          targetLevel: level,
          updatedAt: new Date(),
        })
        .where(and(
          eq(cefrProgress.userId, userId),
          eq(cefrProgress.organizationId, organizationId)
        ));

      revalidatePath("/practice/general");
      revalidatePath("/dashboard");

      return { success: true, targetLevel: level };
    } catch (error) {
      console.error("[setCEFRTargetLevel] Error:", error);
      throw new Error("Failed to set CEFR target level");
    }
  });
}

/**
 * Increment CEFR question completed count and add points
 * Multi-tenant: Updates within user's organization only
 * @param pointsEarned - Points to add
 */
export async function incrementCEFRStats(pointsEarned: number) {
  return await fetchWithDrizzle(async (db, { userId, organizationId }) => {
    try {
      if (!organizationId) {
        throw new Error("Organization context required");
      }

      // Ensure progress exists
      const currentProgress = await getCEFRProgress();

      await db
        .update(cefrProgress)
        .set({
          questionsCompleted: currentProgress.questionsCompleted + 1,
          totalPoints: currentProgress.totalPoints + pointsEarned,
          updatedAt: new Date(),
        })
        .where(and(
          eq(cefrProgress.userId, userId),
          eq(cefrProgress.organizationId, organizationId)
        ));

      revalidatePath("/practice/general");
      revalidatePath("/dashboard");

      return {
        success: true,
        questionsCompleted: currentProgress.questionsCompleted + 1,
        totalPoints: currentProgress.totalPoints + pointsEarned,
      };
    } catch (error) {
      console.error("[incrementCEFRStats] Error:", error);
      throw new Error("Failed to increment CEFR stats");
    }
  });
}

/**
 * Reset CEFR progress (for testing or user request)
 * Multi-tenant: Resets within user's organization only
 */
export async function resetCEFRProgress() {
  return await fetchWithDrizzle(async (db, { userId, organizationId }) => {
    try {
      if (!organizationId) {
        throw new Error("Organization context required");
      }

      await db
        .update(cefrProgress)
        .set({
          currentLevel: "A1",
          targetLevel: null,
          listeningProgress: 0,
          speakingProgress: 0,
          readingProgress: 0,
          writingProgress: 0,
          totalPoints: 0,
          questionsCompleted: 0,
          updatedAt: new Date(),
        })
        .where(and(
          eq(cefrProgress.userId, userId),
          eq(cefrProgress.organizationId, organizationId)
        ));

      revalidatePath("/practice/general");
      revalidatePath("/dashboard");

      return { success: true };
    } catch (error) {
      console.error("[resetCEFRProgress] Error:", error);
      throw new Error("Failed to reset CEFR progress");
    }
  });
}
