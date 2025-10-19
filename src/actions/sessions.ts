"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

// ============================================================================
// PRACTICE SESSIONS
// ============================================================================

/**
 * Create a new practice session
 *
 * @param skill - Skill being practiced (listening, speaking, reading, writing)
 * @param level - NZCEL level
 * @returns Practice session record
 */
export async function createPracticeSession(
  skill: string,
  level: string
) {
  return fetchWithDrizzle(async (db, { userId }) => {
    const sessionId = crypto.randomUUID();

    const [session] = await db
      .insert(schema.practiceSessions)
      .values({
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
  return fetchWithDrizzle(async (db) => {
    const [answer] = await db
      .insert(schema.sessionAnswers)
      .values({
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
 *
 * @param sessionId - Session ID (bigint)
 * @returns Updated session
 */
export async function completePracticeSession(sessionId: bigint) {
  return fetchWithDrizzle(async (db, { userId }) => {
    const session = await db.query.practiceSessions.findFirst({
      where: and(
        eq(schema.practiceSessions.id, sessionId),
        eq(schema.practiceSessions.userId, userId)
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
 *
 * @param sessionId - Session ID (bigint)
 * @returns Session with answers
 */
export async function getPracticeSessionWithAnswers(sessionId: bigint) {
  return fetchWithDrizzle(async (db, { userId }) => {
    return await db.query.practiceSessions.findFirst({
      where: and(
        eq(schema.practiceSessions.id, sessionId),
        eq(schema.practiceSessions.userId, userId)
      ),
      with: {
        answers: {
          orderBy: (answers, { asc }) => [asc(answers.answeredAt)],
        },
      },
    });
  });
}

/**
 * Get user's recent practice sessions
 *
 * @param limit - Number of sessions to fetch
 * @returns List of practice sessions
 */
export async function getRecentPracticeSessions(limit: number = 20) {
  return fetchWithDrizzle(async (db, { userId }) => {
    return await db.query.practiceSessions.findMany({
      where: eq(schema.practiceSessions.userId, userId),
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
  return fetchWithDrizzle(async (db, { userId }) => {
    const sessionId = crypto.randomUUID();

    const [session] = await db
      .insert(schema.conversationSessions)
      .values({
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
  return fetchWithDrizzle(async (db) => {
    const [turn] = await db
      .insert(schema.conversationTurns)
      .values({
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
 *
 * @param sessionId - Session ID (bigint)
 * @param totalPoints - Total points earned
 * @returns Updated session
 */
export async function completeConversationSession(
  sessionId: bigint,
  totalPoints: number
) {
  return fetchWithDrizzle(async (db, { userId }) => {
    const session = await db.query.conversationSessions.findFirst({
      where: and(
        eq(schema.conversationSessions.id, sessionId),
        eq(schema.conversationSessions.userId, userId)
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
 *
 * @param sessionId - Session ID (bigint)
 * @returns Session with turns
 */
export async function getConversationSessionWithTurns(sessionId: bigint) {
  return fetchWithDrizzle(async (db, { userId }) => {
    return await db.query.conversationSessions.findFirst({
      where: and(
        eq(schema.conversationSessions.id, sessionId),
        eq(schema.conversationSessions.userId, userId)
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
 *
 * @param limit - Number of sessions to fetch
 * @returns List of conversation sessions
 */
export async function getRecentConversationSessions(limit: number = 20) {
  return fetchWithDrizzle(async (db, { userId }) => {
    return await db.query.conversationSessions.findMany({
      where: eq(schema.conversationSessions.userId, userId),
      orderBy: desc(schema.conversationSessions.startedAt),
      limit,
    });
  });
}
