"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";
import type { LearningPath } from "@/types";

// ============================================================================
// MODULE PROGRESS TRACKING
// ============================================================================

/**
 * Get or create module progress for a specific module
 * Multi-tenant: Scoped to user's organization
 *
 * @param moduleType - Type of learning module (general, nzcel, etc.)
 * @returns Module progress record
 */
export async function getModuleProgress(moduleType: LearningPath) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Try to find existing record
    const existing = await db
      .select()
      .from(schema.moduleProgress)
      .where(
        and(
          eq(schema.moduleProgress.userId, userId),
          eq(schema.moduleProgress.organizationId, organizationId),
          eq(schema.moduleProgress.moduleType, moduleType)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Create new record if doesn't exist
    const [newRecord] = await db
      .insert(schema.moduleProgress)
      .values({
        organizationId,
        userId,
        moduleType,
        totalTime: 0,
        questionsCompleted: 0,
        pointsEarned: 0,
        lastAccessed: new Date(),
      })
      .returning();

    return newRecord;
  });
}

/**
 * Get all module progress for current user
 * Multi-tenant: Returns only modules from user's organization
 *
 * @returns Array of module progress records
 */
export async function getAllModuleProgress() {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const modules = await db
      .select()
      .from(schema.moduleProgress)
      .where(and(
        eq(schema.moduleProgress.userId, userId),
        eq(schema.moduleProgress.organizationId, organizationId)
      ))
      .orderBy(desc(schema.moduleProgress.lastAccessed));

    return modules;
  });
}

/**
 * Update module progress
 * Multi-tenant: Updates within user's organization only
 *
 * @param moduleType - Type of learning module
 * @param timeSpent - Time spent in seconds
 * @param questionsCompleted - Number of questions completed
 * @param pointsEarned - Points earned
 */
export async function updateModuleProgress(
  moduleType: LearningPath,
  timeSpent: number = 0,
  questionsCompleted: number = 0,
  pointsEarned: number = 0
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Get or create module progress
    const existing = await getModuleProgress(moduleType);

    // Update the record
    const [updated] = await db
      .update(schema.moduleProgress)
      .set({
        totalTime: existing.totalTime + timeSpent,
        questionsCompleted: existing.questionsCompleted + questionsCompleted,
        pointsEarned: existing.pointsEarned + pointsEarned,
        lastAccessed: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.moduleProgress.userId, userId),
          eq(schema.moduleProgress.organizationId, organizationId),
          eq(schema.moduleProgress.moduleType, moduleType)
        )
      )
      .returning();

    return updated;
  });
}

// ============================================================================
// SPEAKING PRACTICE STATISTICS
// ============================================================================

/**
 * Get speaking practice statistics
 * Multi-tenant: Returns only stats from user's organization
 *
 * @returns Speaking practice stats
 */
export async function getSpeakingStats() {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Get all conversation sessions
    const sessions = await db
      .select()
      .from(schema.conversationSessions)
      .where(and(
        eq(schema.conversationSessions.userId, userId),
        eq(schema.conversationSessions.organizationId, organizationId)
      ))
      .orderBy(desc(schema.conversationSessions.startedAt));

    // Get total conversation turns
    const turnsResult = await db
      .select({ count: count() })
      .from(schema.conversationTurns)
      .where(
        sql`${schema.conversationTurns.sessionId} IN (
          SELECT ${schema.conversationSessions.id}
          FROM ${schema.conversationSessions}
          WHERE ${schema.conversationSessions.userId} = ${userId}
          AND ${schema.conversationSessions.organizationId} = ${organizationId}
        )`
      );

    const totalTurns = turnsResult[0]?.count || 0;
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.isCompleted).length;

    // Calculate duration from startedAt and endedAt for each session
    const sessionsWithDuration = sessions.map(session => {
      let durationSeconds = null;
      if (session.startedAt && session.endedAt) {
        const start = new Date(session.startedAt).getTime();
        const end = new Date(session.endedAt).getTime();
        durationSeconds = Math.round((end - start) / 1000); // Convert ms to seconds
      }
      return {
        ...session,
        durationSeconds,
      };
    });

    // Calculate average session duration
    const completedSessionsWithDuration = sessionsWithDuration.filter(
      s => s.isCompleted && s.durationSeconds !== null
    );
    const averageDuration = completedSessionsWithDuration.length > 0
      ? Math.round(
          completedSessionsWithDuration.reduce((sum, s) => sum + (s.durationSeconds || 0), 0) /
          completedSessionsWithDuration.length
        )
      : 0;

    return {
      totalSessions,
      completedSessions,
      totalTurns,
      averageDuration,
      recentSessions: sessionsWithDuration.slice(0, 5), // Last 5 sessions with calculated duration
    };
  });
}

// ============================================================================
// AGGREGATED STATISTICS
// ============================================================================

/**
 * Get aggregated statistics across all modules
 * Multi-tenant: Returns aggregated stats from user's organization only
 *
 * @returns Aggregated stats
 */
export async function getAggregatedStats() {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Get all module progress
    const modules = await getAllModuleProgress();

    // Get NZCEL progress
    const nzcelProgress = await db
      .select()
      .from(schema.userProgress)
      .where(and(
        eq(schema.userProgress.userId, userId),
        eq(schema.userProgress.organizationId, organizationId)
      ))
      .limit(1);

    // Get CEFR progress
    const cefrProgress = await db
      .select()
      .from(schema.cefrProgress)
      .where(and(
        eq(schema.cefrProgress.userId, userId),
        eq(schema.cefrProgress.organizationId, organizationId)
      ))
      .limit(1);

    // Get speaking stats
    const speakingStats = await getSpeakingStats();

    // Calculate totals
    const totalModuleTime = modules.reduce((sum, m) => sum + m.totalTime, 0);
    const totalModuleQuestions = modules.reduce((sum, m) => sum + m.questionsCompleted, 0);

    const nzcelPoints = nzcelProgress[0]?.totalPoints || 0;
    const cefrPoints = cefrProgress[0]?.totalPoints || 0;

    return {
      // Module-specific stats
      modules,

      // Aggregated totals
      totalPoints: nzcelPoints + cefrPoints,
      totalTime: totalModuleTime,
      totalQuestions: totalModuleQuestions,

      // Individual system stats
      nzcel: nzcelProgress[0] || null,
      cefr: cefrProgress[0] || null,
      speaking: speakingStats,

      // Most active module
      mostActiveModule: modules.length > 0
        ? modules.reduce((prev, current) =>
            (current.lastAccessed && prev.lastAccessed && current.lastAccessed > prev.lastAccessed)
              ? current
              : prev
          )
        : null,
    };
  });
}
