"use server";

import { and, desc, eq } from "drizzle-orm";
import { fetchWithDrizzle } from "@/lib/db";
import { schema } from "@/lib/db/schema";
import { nanoid } from "nanoid";

/**
 * Creates a new AI Speaking Coach session
 * @param cefrLevel - The CEFR level for the session (A1-C2)
 * @param topic - Optional conversation topic
 * @returns The created speaking session
 */
export async function createSpeakingSession(
  cefrLevel: string,
  topic?: string
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const sessionId = `sp_${nanoid()}`;

    const [session] = await db
      .insert(schema.speakingSessions)
      .values({
        sessionId,
        organizationId,
        userId,
        cefrLevel,
        topic: topic || null,
        startedAt: new Date(),
      })
      .returning();

    return session;
  });
}

/**
 * Saves a message in a speaking session
 * @param sessionId - The session ID
 * @param speaker - Either 'user' or 'ai'
 * @param content - The text content of the message
 * @param audioUrl - Optional URL to the audio file
 * @param audioFileId - Optional ID of the audio file
 * @param transcriptionId - Optional ID of the transcription
 * @param audioDuration - Optional duration of the audio in seconds
 * @returns The saved message
 */
export async function saveSpeakingMessage(
  sessionId: string,
  speaker: "user" | "ai",
  content: string,
  audioUrl?: string,
  audioFileId?: bigint,
  transcriptionId?: bigint,
  audioDuration?: number,
  metadata?: any
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const messageId = `msg_${nanoid()}`;

    // Save the message
    const [message] = await db
      .insert(schema.speakingMessages)
      .values({
        messageId,
        sessionId,
        organizationId,
        speaker,
        content,
        audioUrl: audioUrl || null,
        audioFileId: audioFileId || null,
        transcriptionId: transcriptionId || null,
        audioDuration: audioDuration || null,
        metadata: metadata || null,
        timestamp: new Date(),
      })
      .returning();

    // Update session statistics
    if (speaker === "user" || speaker === "ai") {
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

      await db
        .update(schema.speakingSessions)
        .set({
          totalTurns: speaker === "user"
            ? await db.$count(schema.speakingMessages, and(
                eq(schema.speakingMessages.sessionId, sessionId),
                eq(schema.speakingMessages.speaker, "user")
              ))
            : undefined,
          totalUserWords: speaker === "user"
            ? await db.$count(schema.speakingMessages, and(
                eq(schema.speakingMessages.sessionId, sessionId),
                eq(schema.speakingMessages.speaker, "user")
              )).then(() => wordCount)
            : undefined,
          totalAiWords: speaker === "ai"
            ? await db.$count(schema.speakingMessages, and(
                eq(schema.speakingMessages.sessionId, sessionId),
                eq(schema.speakingMessages.speaker, "ai")
              )).then(() => wordCount)
            : undefined,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(schema.speakingSessions.sessionId, sessionId),
            eq(schema.speakingSessions.organizationId, organizationId)
          )
        );
    }

    return message;
  });
}

/**
 * Saves an AI assessment for a user message
 * @param messageId - The message ID to assess
 * @param scores - The assessment scores
 * @param feedback - The feedback text
 * @param suggestions - Array of improvement suggestions
 * @param errors - Detected errors with corrections
 * @returns The saved assessment
 */
export async function saveSpeakingAssessment(
  messageId: string,
  scores: {
    pronunciationScore?: number;
    fluencyScore?: number;
    grammarScore?: number;
    vocabularyScore?: number;
    overallScore?: number;
  },
  feedback?: string,
  suggestions?: string[],
  errors?: any[]
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const assessmentId = `asmt_${nanoid()}`;

    const [assessment] = await db
      .insert(schema.speakingAssessments)
      .values({
        assessmentId,
        messageId,
        organizationId,
        pronunciationScore: scores.pronunciationScore || null,
        fluencyScore: scores.fluencyScore || null,
        grammarScore: scores.grammarScore || null,
        vocabularyScore: scores.vocabularyScore || null,
        overallScore: scores.overallScore || null,
        feedback: feedback || null,
        suggestions: suggestions || null,
        errors: errors || null,
        assessmentModel: "gpt-4",
        createdAt: new Date(),
      })
      .returning();

    return assessment;
  });
}

/**
 * Gets a speaking session with all its messages
 * @param sessionId - The session ID
 * @returns The session with messages and assessments
 */
export async function getSpeakingSession(sessionId: string) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Get the session
    const session = await db.query.speakingSessions.findFirst({
      where: and(
        eq(schema.speakingSessions.sessionId, sessionId),
        eq(schema.speakingSessions.userId, userId),
        eq(schema.speakingSessions.organizationId, organizationId)
      ),
    });

    if (!session) {
      throw new Error("Session not found");
    }

    // Get all messages for this session
    const messages = await db.query.speakingMessages.findMany({
      where: and(
        eq(schema.speakingMessages.sessionId, sessionId),
        eq(schema.speakingMessages.organizationId, organizationId)
      ),
      orderBy: [schema.speakingMessages.timestamp],
    });

    // Get assessments for user messages
    const messageIds = messages
      .filter(m => m.speaker === "user")
      .map(m => m.messageId);

    const assessments = messageIds.length > 0
      ? await db.query.speakingAssessments.findMany({
          where: and(
            eq(schema.speakingAssessments.organizationId, organizationId),
            // Check if messageId is in the list
            ...messageIds.map(id => eq(schema.speakingAssessments.messageId, id))
          ),
        })
      : [];

    // Map assessments to messages
    const messagesWithAssessments = messages.map(message => ({
      ...message,
      assessment: assessments.find(a => a.messageId === message.messageId) || null,
    }));

    return {
      session,
      messages: messagesWithAssessments,
    };
  });
}

/**
 * Gets all speaking sessions for a user
 * @param limit - Maximum number of sessions to return
 * @param offset - Offset for pagination
 * @returns Array of speaking sessions
 */
export async function getUserSpeakingSessions(
  limit: number = 10,
  offset: number = 0
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const sessions = await db.query.speakingSessions.findMany({
      where: and(
        eq(schema.speakingSessions.userId, userId),
        eq(schema.speakingSessions.organizationId, organizationId)
      ),
      orderBy: [desc(schema.speakingSessions.startedAt)],
      limit,
      offset,
    });

    // Get message counts for each session
    const sessionsWithStats = await Promise.all(
      sessions.map(async (session) => {
        const messageCount = await db.$count(
          schema.speakingMessages,
          and(
            eq(schema.speakingMessages.sessionId, session.sessionId),
            eq(schema.speakingMessages.organizationId, organizationId)
          )
        );

        return {
          ...session,
          messageCount,
        };
      })
    );

    return sessionsWithStats;
  });
}

/**
 * Completes a speaking session
 * @param sessionId - The session ID to complete
 * @returns The updated session
 */
export async function completeSpeakingSession(sessionId: string) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Get the session to calculate duration
    const session = await db.query.speakingSessions.findFirst({
      where: and(
        eq(schema.speakingSessions.sessionId, sessionId),
        eq(schema.speakingSessions.userId, userId),
        eq(schema.speakingSessions.organizationId, organizationId)
      ),
    });

    if (!session) {
      throw new Error("Session not found");
    }

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - new Date(session.startedAt).getTime()) / 1000
    );

    // Update the session
    const [updatedSession] = await db
      .update(schema.speakingSessions)
      .set({
        endedAt: endTime,
        duration,
        isCompleted: true,
        updatedAt: endTime,
      })
      .where(
        and(
          eq(schema.speakingSessions.sessionId, sessionId),
          eq(schema.speakingSessions.userId, userId),
          eq(schema.speakingSessions.organizationId, organizationId)
        )
      )
      .returning();

    // Update module progress for speaking
    const moduleProgress = await db.query.moduleProgress.findFirst({
      where: and(
        eq(schema.moduleProgress.userId, userId),
        eq(schema.moduleProgress.organizationId, organizationId),
        eq(schema.moduleProgress.moduleType, "speaking")
      ),
    });

    if (moduleProgress) {
      await db
        .update(schema.moduleProgress)
        .set({
          totalTime: (moduleProgress.totalTime || 0) + duration,
          questionsCompleted: (moduleProgress.questionsCompleted || 0) + session.totalTurns,
          lastAccessed: endTime,
          updatedAt: endTime,
        })
        .where(
          and(
            eq(schema.moduleProgress.id, moduleProgress.id),
            eq(schema.moduleProgress.organizationId, organizationId)
          )
        );
    } else {
      // Create module progress if it doesn't exist
      await db.insert(schema.moduleProgress).values({
        organizationId,
        userId,
        moduleType: "speaking",
        totalTime: duration,
        questionsCompleted: session.totalTurns,
        lastAccessed: endTime,
      });
    }

    return updatedSession;
  });
}

/**
 * Deletes a speaking session and all related data
 * @param sessionId - The session ID to delete
 * @returns Success status
 */
export async function deleteSpeakingSession(sessionId: string) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // First, get all messages to find assessments
    const messages = await db.query.speakingMessages.findMany({
      where: and(
        eq(schema.speakingMessages.sessionId, sessionId),
        eq(schema.speakingMessages.organizationId, organizationId)
      ),
    });

    const messageIds = messages.map(m => m.messageId);

    // Delete assessments first (due to foreign key)
    if (messageIds.length > 0) {
      await db
        .delete(schema.speakingAssessments)
        .where(
          and(
            eq(schema.speakingAssessments.organizationId, organizationId),
            ...messageIds.map(id => eq(schema.speakingAssessments.messageId, id))
          )
        );
    }

    // Delete messages
    await db
      .delete(schema.speakingMessages)
      .where(
        and(
          eq(schema.speakingMessages.sessionId, sessionId),
          eq(schema.speakingMessages.organizationId, organizationId)
        )
      );

    // Delete the session
    await db
      .delete(schema.speakingSessions)
      .where(
        and(
          eq(schema.speakingSessions.sessionId, sessionId),
          eq(schema.speakingSessions.userId, userId),
          eq(schema.speakingSessions.organizationId, organizationId)
        )
      );

    return { success: true };
  });
}