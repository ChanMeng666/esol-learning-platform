"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Session Management Server Actions
 * Multi-tenant: All operations are scoped to user's organization
 */

// ============================================================================
// PRACTICE SESSIONS
// ============================================================================

/**
 * Create a new practice session
 * Multi-tenant: Creates session within user's organization
 *
 * @param skill - Skill being practiced (listening, speaking, reading, writing)
 * @param level - NZCEL level
 * @returns Practice session record
 */
export async function createPracticeSession(
  skill: string,
  level: string
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const sessionId = crypto.randomUUID();

    const [session] = await db
      .insert(schema.practiceSessions)
      .values({
        organizationId,
        userId,
        sessionId,
        skill,
        level,
      })
      .returning();

    return session;
  });
}

/**
 * Save answer to a practice session
 * Multi-tenant: Saves answer within user's organization
 *
 * @param sessionId - Session ID (bigint)
 * @param questionId - Question ID
 * @param userAnswer - User's answer
 * @param correctAnswer - Correct answer
 * @param isCorrect - Whether answer is correct
 * @param pointsEarned - Points earned
 * @param timeSpent - Time spent on question (seconds)
 * @param audioRecordingId - Audio recording ID (optional)
 * @param transcriptionId - Transcription ID (optional)
 * @param aiFeedback - AI feedback text (optional)
 * @returns Answer record
 */
export async function saveSessionAnswer(
  sessionId: bigint,
  questionId: string,
  userAnswer: string,
  correctAnswer: string,
  isCorrect: boolean,
  pointsEarned: number,
  timeSpent?: number,
  audioRecordingId?: bigint,
  transcriptionId?: bigint,
  aiFeedback?: string
) {
  return fetchWithDrizzle(async (db, { organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const [answer] = await db
      .insert(schema.sessionAnswers)
      .values({
        organizationId,
        sessionId,
        questionId,
        userAnswer,
        correctAnswer,
        isCorrect,
        pointsEarned,
        timeSpent,
        audioRecordingId,
        transcriptionId,
        aiFeedback,
      })
      .returning();

    // Update session stats
    const session = await db.query.practiceSessions.findFirst({
      where: eq(schema.practiceSessions.id, sessionId),
    });

    if (session) {
      await db
        .update(schema.practiceSessions)
        .set({
          questionsAttempted: session.questionsAttempted + 1,
          questionsCorrect: isCorrect
            ? session.questionsCorrect + 1
            : session.questionsCorrect,
          totalPointsEarned: session.totalPointsEarned + pointsEarned,
        })
        .where(eq(schema.practiceSessions.id, sessionId));
    }

    return answer;
  });
}

/**
 * Complete a practice session
 * Multi-tenant: Completes session within user's organization only
 *
 * @param sessionId - Session ID (bigint)
 * @returns Updated session
 */
export async function completePracticeSession(sessionId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const session = await db.query.practiceSessions.findFirst({
      where: and(
        eq(schema.practiceSessions.id, sessionId),
        eq(schema.practiceSessions.userId, userId),
        eq(schema.practiceSessions.organizationId, organizationId)
      ),
    });

    if (!session) {
      throw new Error("Session not found");
    }

    const endedAt = new Date();
    const duration = Math.floor(
      (endedAt.getTime() - session.startedAt.getTime()) / 1000
    );

    const [updated] = await db
      .update(schema.practiceSessions)
      .set({
        endedAt,
        duration,
        isCompleted: true,
      })
      .where(eq(schema.practiceSessions.id, sessionId))
      .returning();

    return updated;
  });
}

/**
 * Get practice session with all answers
 * Multi-tenant: Returns session from user's organization only
 *
 * @param sessionId - Session ID (bigint)
 * @returns Session with answers
 */
export async function getPracticeSessionWithAnswers(sessionId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    return await db.query.practiceSessions.findFirst({
      where: and(
        eq(schema.practiceSessions.id, sessionId),
        eq(schema.practiceSessions.userId, userId),
        eq(schema.practiceSessions.organizationId, organizationId)
      ),
      with: {
        answers: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          orderBy: (answers: any, { asc }: any) => [asc(answers.answeredAt)],
        },
      },
    });
  });
}

/**
 * Get user's recent practice sessions
 * Multi-tenant: Returns sessions from user's organization only
 *
 * @param limit - Number of sessions to fetch
 * @returns List of practice sessions
 */
export async function getRecentPracticeSessions(limit: number = 20) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    return await db.query.practiceSessions.findMany({
      where: and(
        eq(schema.practiceSessions.userId, userId),
        eq(schema.practiceSessions.organizationId, organizationId)
      ),
      orderBy: desc(schema.practiceSessions.startedAt),
      limit,
    });
  });
}

// ============================================================================
// CONVERSATION SESSIONS
// ============================================================================

/**
 * Create a new conversation session
 * Multi-tenant: Creates session within user's organization
 *
 * @param scenarioId - Scenario ID
 * @param scenarioTitle - Scenario title
 * @param targetTurns - Target number of turns
 * @returns Conversation session record
 */
export async function createConversationSession(
  scenarioId: string,
  scenarioTitle: string,
  targetTurns: number
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const sessionId = crypto.randomUUID();

    const [session] = await db
      .insert(schema.conversationSessions)
      .values({
        organizationId,
        userId,
        sessionId,
        scenarioId,
        scenarioTitle,
        targetTurns,
      })
      .returning();

    return session;
  });
}

/**
 * Save conversation turn
 * Multi-tenant: Saves turn within user's organization
 *
 * @param sessionId - Session ID (bigint)
 * @param turnNumber - Turn number
 * @param speaker - Speaker (user or assistant)
 * @param audioUrl - Audio URL (optional)
 * @param audioFileId - Audio file ID (optional)
 * @param transcription - Transcription text (optional)
 * @param transcriptionId - Transcription ID (optional)
 * @param aiFeedback - AI feedback (optional)
 * @param scores - Speaking scores (optional)
 * @returns Turn record
 */
export async function saveConversationTurn(
  sessionId: bigint,
  turnNumber: number,
  speaker: "user" | "assistant",
  audioUrl?: string,
  audioFileId?: bigint,
  transcription?: string,
  transcriptionId?: bigint,
  aiFeedback?: string,
  scores?: {
    pronunciation?: number;
    fluency?: number;
    grammar?: number;
    vocabulary?: number;
  }
) {
  return fetchWithDrizzle(async (db, { organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const [turn] = await db
      .insert(schema.conversationTurns)
      .values({
        organizationId,
        sessionId,
        turnNumber,
        speaker,
        audioUrl,
        audioFileId,
        transcription,
        transcriptionId,
        aiFeedback,
        pronunciationScore: scores?.pronunciation
          ? scores.pronunciation.toString()
          : null,
        fluencyScore: scores?.fluency ? scores.fluency.toString() : null,
        grammarScore: scores?.grammar ? scores.grammar.toString() : null,
        vocabularyScore: scores?.vocabulary ? scores.vocabulary.toString() : null,
      })
      .returning();

    // Update session stats
    const session = await db.query.conversationSessions.findFirst({
      where: eq(schema.conversationSessions.id, sessionId),
    });

    if (session) {
      await db
        .update(schema.conversationSessions)
        .set({
          completedTurns: session.completedTurns + 1,
        })
        .where(eq(schema.conversationSessions.id, sessionId));
    }

    return turn;
  });
}

/**
 * Complete a conversation session
 * Multi-tenant: Completes session within user's organization only
 *
 * @param sessionId - Session ID (bigint)
 * @param totalPoints - Total points earned
 * @returns Updated session
 */
export async function completeConversationSession(
  sessionId: bigint,
  totalPoints: number
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const session = await db.query.conversationSessions.findFirst({
      where: and(
        eq(schema.conversationSessions.id, sessionId),
        eq(schema.conversationSessions.userId, userId),
        eq(schema.conversationSessions.organizationId, organizationId)
      ),
      with: {
        turns: true,
      },
    });

    if (!session) {
      throw new Error("Session not found");
    }

    // Calculate average scores from user turns
    const userTurns = session.turns.filter((t) => t.speaker === "user");
    const avgPronunciation =
      userTurns.length > 0
        ? userTurns.reduce(
            (sum, t) => sum + (parseFloat(t.pronunciationScore || "0") || 0),
            0
          ) / userTurns.length
        : null;
    const avgFluency =
      userTurns.length > 0
        ? userTurns.reduce(
            (sum, t) => sum + (parseFloat(t.fluencyScore || "0") || 0),
            0
          ) / userTurns.length
        : null;

    const [updated] = await db
      .update(schema.conversationSessions)
      .set({
        endedAt: new Date(),
        isCompleted: true,
        totalPointsEarned: totalPoints,
        averagePronunciationScore: avgPronunciation?.toString() || null,
        averageFluencyScore: avgFluency?.toString() || null,
      })
      .where(eq(schema.conversationSessions.id, sessionId))
      .returning();

    return updated;
  });
}

/**
 * Get conversation session with all turns
 * Multi-tenant: Returns session from user's organization only
 *
 * @param sessionId - Session ID (bigint)
 * @returns Session with turns
 */
export async function getConversationSessionWithTurns(sessionId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    return await db.query.conversationSessions.findFirst({
      where: and(
        eq(schema.conversationSessions.id, sessionId),
        eq(schema.conversationSessions.userId, userId),
        eq(schema.conversationSessions.organizationId, organizationId)
      ),
      with: {
        turns: {
          orderBy: (turns, { asc }) => [asc(turns.turnNumber)],
        },
      },
    });
  });
}

/**
 * Get user's recent conversation sessions
 * Multi-tenant: Returns sessions from user's organization only
 *
 * @param limit - Number of sessions to fetch
 * @returns List of conversation sessions
 */
export async function getRecentConversationSessions(limit: number = 20) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    return await db.query.conversationSessions.findMany({
      where: and(
        eq(schema.conversationSessions.userId, userId),
        eq(schema.conversationSessions.organizationId, organizationId)
      ),
      orderBy: desc(schema.conversationSessions.startedAt),
      limit,
    });
  });
}

// ============================================================================
// FILTERED QUERIES (FOR HISTORY VIEWS)
// ============================================================================

/**
 * Get practice sessions with filtering
 * Multi-tenant: Returns filtered sessions from user's organization only
 *
 * @param filters - Filter options
 * @param filters.skill - Filter by skill (listening, speaking, reading, writing)
 * @param filters.level - Filter by NZCEL level
 * @param filters.dateRange - Filter by date range (7d, 30d, all)
 * @param limit - Number of sessions to fetch
 * @returns Filtered list of practice sessions with answers
 */
export async function getPracticeSessionsWithFilters(
  filters: {
    skill?: string;
    level?: string;
    dateRange?: "7d" | "30d" | "all";
  },
  limit: number = 20
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    console.log("[getPracticeSessionsWithFilters] Current userId:", userId);
    console.log("[getPracticeSessionsWithFilters] Filters:", filters);

    const conditions = [
      eq(schema.practiceSessions.userId, userId),
      eq(schema.practiceSessions.organizationId, organizationId)
    ];

    // Apply skill filter
    if (filters.skill) {
      conditions.push(eq(schema.practiceSessions.skill, filters.skill));
    }

    // Apply level filter
    if (filters.level) {
      conditions.push(eq(schema.practiceSessions.level, filters.level));
    }

    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== "all") {
      const now = new Date();
      const daysAgo = filters.dateRange === "7d" ? 7 : 30;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // We need to use gt (greater than) from drizzle-orm
      const { gt } = await import("drizzle-orm");
      conditions.push(gt(schema.practiceSessions.startedAt, startDate));
    }

    const results = await db.query.practiceSessions.findMany({
      where: and(...conditions),
      orderBy: desc(schema.practiceSessions.startedAt),
      limit,
      with: {
        answers: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          orderBy: (answers: any, { asc }: any) => [asc(answers.answeredAt)],
        },
      },
    });

    console.log("[getPracticeSessionsWithFilters] Found sessions:", results.length);

    return results;
  });
}

/**
 * Get conversation sessions with filtering
 * Multi-tenant: Returns filtered sessions from user's organization only
 *
 * @param filters - Filter options
 * @param filters.scenarioId - Filter by scenario ID
 * @param filters.dateRange - Filter by date range (7d, 30d, all)
 * @param limit - Number of sessions to fetch
 * @returns Filtered list of conversation sessions with turns
 */
export async function getConversationSessionsWithFilters(
  filters: {
    scenarioId?: string;
    dateRange?: "7d" | "30d" | "all";
  },
  limit: number = 20
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const conditions = [
      eq(schema.conversationSessions.userId, userId),
      eq(schema.conversationSessions.organizationId, organizationId)
    ];

    // Apply scenario filter
    if (filters.scenarioId) {
      conditions.push(eq(schema.conversationSessions.scenarioId, filters.scenarioId));
    }

    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== "all") {
      const now = new Date();
      const daysAgo = filters.dateRange === "7d" ? 7 : 30;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      const { gt } = await import("drizzle-orm");
      conditions.push(gt(schema.conversationSessions.startedAt, startDate));
    }

    return await db.query.conversationSessions.findMany({
      where: and(...conditions),
      orderBy: desc(schema.conversationSessions.startedAt),
      limit,
      with: {
        turns: {
          orderBy: (turns, { asc }) => [asc(turns.turnNumber)],
        },
      },
    });
  });
}
