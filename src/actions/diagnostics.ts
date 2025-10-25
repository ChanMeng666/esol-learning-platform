"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Get current user ID and session count
 * Multi-tenant: Returns counts from user's organization only
 * Helps diagnose user ID mismatch issues
 */
export async function getUserDiagnostics() {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const practiceCount = await db.query.practiceSessions.findMany({
      where: and(
        eq(schema.practiceSessions.userId, userId),
        eq(schema.practiceSessions.organizationId, organizationId)
      ),
    });

    const recordingCount = await db.query.userRecordings.findMany({
      where: and(
        eq(schema.userRecordings.userId, userId),
        eq(schema.userRecordings.organizationId, organizationId)
      ),
    });

    const conversationCount = await db.query.conversationSessions.findMany({
      where: and(
        eq(schema.conversationSessions.userId, userId),
        eq(schema.conversationSessions.organizationId, organizationId)
      ),
    });

    return {
      currentUserId: userId,
      organizationId: organizationId.toString(),
      practiceSessionsCount: practiceCount.length,
      recordingsCount: recordingCount.length,
      conversationSessionsCount: conversationCount.length,
    };
  });
}

/**
 * Create sample practice session data for current user
 * Multi-tenant: Creates sample data within user's organization
 * This helps test the history feature regardless of user ID
 */
export async function createSampleData() {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const sessionId = crypto.randomUUID();

    // Create a sample practice session
    const [session] = await db
      .insert(schema.practiceSessions)
      .values({
        organizationId,
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
        organizationId,
        sessionId: session.id,
        questionId: "sample-q1",
        userAnswer: "A",
        correctAnswer: "A",
        isCorrect: true,
        pointsEarned: 10,
        timeSpent: 60,
      },
      {
        organizationId,
        sessionId: session.id,
        questionId: "sample-q2",
        userAnswer: "B",
        correctAnswer: "C",
        isCorrect: false,
        pointsEarned: 0,
        timeSpent: 70,
      },
      {
        organizationId,
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
