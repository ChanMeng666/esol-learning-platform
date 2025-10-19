"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";

/**
 * Get current user ID and session count
 * Helps diagnose user ID mismatch issues
 */
export async function getUserDiagnostics() {
  return fetchWithDrizzle(async (db, { userId }) => {
    const practiceCount = await db.query.practiceSessions.findMany({
      where: (sessions, { eq }) => eq(sessions.userId, userId),
    });

    const recordingCount = await db.query.userRecordings.findMany({
      where: (recordings, { eq }) => eq(recordings.userId, userId),
    });

    const conversationCount = await db.query.conversationSessions.findMany({
      where: (sessions, { eq }) => eq(sessions.userId, userId),
    });

    return {
      currentUserId: userId,
      practiceSessionsCount: practiceCount.length,
      recordingsCount: recordingCount.length,
      conversationSessionsCount: conversationCount.length,
    };
  });
}

/**
 * Create sample practice session data for current user
 * This helps test the history feature regardless of user ID
 */
export async function createSampleData() {
  return fetchWithDrizzle(async (db, { userId }) => {
    const sessionId = crypto.randomUUID();

    // Create a sample practice session
    const [session] = await db
      .insert(schema.practiceSessions)
      .values({
        userId,
        sessionId,
        skill: "listening",
        level: "foundation",
        questionsAttempted: 3,
        questionsCorrect: 2,
        totalPointsEarned: 20,
        isCompleted: true,
        endedAt: new Date(),
        duration: 180, // 3 minutes
      })
      .returning();

    // Create sample answers for the session
    await db.insert(schema.sessionAnswers).values([
      {
        sessionId: session.id,
        questionId: "sample-q1",
        userAnswer: "A",
        correctAnswer: "A",
        isCorrect: true,
        pointsEarned: 10,
        timeSpent: 60,
      },
      {
        sessionId: session.id,
        questionId: "sample-q2",
        userAnswer: "B",
        correctAnswer: "C",
        isCorrect: false,
        pointsEarned: 0,
        timeSpent: 70,
      },
      {
        sessionId: session.id,
        questionId: "sample-q3",
        userAnswer: "D",
        correctAnswer: "D",
        isCorrect: true,
        pointsEarned: 10,
        timeSpent: 50,
      },
    ]);

    return {
      success: true,
      message: "Sample data created successfully",
      sessionId: session.id,
    };
  });
}
