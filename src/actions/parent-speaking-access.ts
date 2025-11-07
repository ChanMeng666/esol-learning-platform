"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { fetchWithDrizzle } from "@/lib/db";

/**
 * Get all children linked to parent with their speaking practice stats
 */
export async function getChildrenSpeakingStats() {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Check if user is a parent
    if (enhancedUser.role !== "parent") {
      throw new Error("Access denied: Parent role required");
    }

    try {
      // Get all children linked to this parent
      const relationships = await db.query.parentStudentRelationships.findMany({
        where: eq(schema.parentStudentRelationships.parentId, BigInt(userId)),
      });

      if (relationships.length === 0) {
        return { children: [] };
      }

      // Get speaking stats for each child
      const childrenWithStats = await Promise.all(
        relationships.map(async (rel) => {
          // Get child user record
          const child = await db.query.users.findFirst({
            where: and(
              eq(schema.users.id, rel.studentId),
              eq(schema.users.organizationId, organizationId)
            ),
          });

          if (!child) return null;

          // Get speaking session count for this child
          const sessions = await db.query.speakingSessions.findMany({
            where: and(
              eq(schema.speakingSessions.userId, child.stackUserId),
              eq(schema.speakingSessions.organizationId, organizationId)
            ),
            orderBy: [desc(schema.speakingSessions.startedAt)],
          });

          // Calculate total practice time
          const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
          const completedSessions = sessions.filter(s => s.isCompleted).length;

          // Get the most recent sessions (last 7 days) for activity graph
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const recentSessions = sessions.filter(
            s => new Date(s.startedAt) >= sevenDaysAgo
          );

          // Get child's current class
          const enrollment = await db.query.classEnrollments.findFirst({
            where: and(
              eq(schema.classEnrollments.studentId, child.id),
              eq(schema.classEnrollments.status, "active")
            ),
          });

          // Get class name if enrolled
          let className = null;
          if (enrollment) {
            const classRecord = await db.query.classes.findFirst({
              where: eq(schema.classes.id, enrollment.classId),
            });
            className = classRecord?.name || null;
          }

          return {
            childId: child.id.toString(),
            stackAuthId: child.stackUserId,
            name: child.fullName,
            email: child.email,
            relationshipType: rel.relationshipType,
            isPrimary: rel.isPrimary,
            totalSessions: sessions.length,
            completedSessions,
            totalDuration,
            lastPractice: sessions[0]?.startedAt || null,
            recentSessionCount: recentSessions.length,
            averageSessionDuration: sessions.length > 0
              ? Math.round(totalDuration / sessions.length)
              : 0,
            className,
          };
        })
      );

      return {
        children: childrenWithStats.filter(Boolean),
      };
    } catch (error) {
      console.error("Failed to get children speaking stats:", error);
      throw new Error("Failed to load children data");
    }
  });
}

/**
 * Get speaking sessions for a specific child (with permission check)
 */
export async function getChildSpeakingSessions(
  childStackAuthId: string,
  limit: number = 20,
  offset: number = 0
) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Check if user is a parent
    if (enhancedUser.role !== "parent") {
      throw new Error("Access denied: Parent role required");
    }

    try {
      // Verify the child is linked to this parent
      const child = await db.query.users.findFirst({
        where: and(
          eq(schema.users.stackUserId, childStackAuthId),
          eq(schema.users.organizationId, organizationId)
        ),
      });

      if (!child) {
        throw new Error("Child not found");
      }

      // Check parent-child relationship
      const relationship = await db.query.parentStudentRelationships.findFirst({
        where: and(
          eq(schema.parentStudentRelationships.parentId, BigInt(userId)),
          eq(schema.parentStudentRelationships.studentId, child.id)
        ),
      });

      if (!relationship) {
        throw new Error("Access denied: Not your child");
      }

      // Get speaking sessions for the child
      const sessions = await db.query.speakingSessions.findMany({
        where: and(
          eq(schema.speakingSessions.userId, childStackAuthId),
          eq(schema.speakingSessions.organizationId, organizationId)
        ),
        orderBy: [desc(schema.speakingSessions.startedAt)],
        limit,
        offset,
      });

      // Add message count for each session
      const sessionsWithCounts = await Promise.all(
        sessions.map(async (session) => {
          const messages = await db.query.speakingMessages.findMany({
            where: and(
              eq(schema.speakingMessages.sessionId, session.sessionId),
              eq(schema.speakingMessages.organizationId, organizationId)
            ),
          });

          return {
            ...session,
            messageCount: messages.length,
          };
        })
      );

      // Log access for audit
      console.log(`[Parent Access] Parent ${userId} accessed child ${childStackAuthId} speaking sessions`);

      return sessionsWithCounts;
    } catch (error) {
      console.error("Failed to get child speaking sessions:", error);
      throw error;
    }
  });
}

/**
 * Get detailed speaking session with messages and audio (with permission check)
 */
export async function getChildSpeakingSession(sessionId: string) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Check if user is a parent
    if (enhancedUser.role !== "parent") {
      throw new Error("Access denied: Parent role required");
    }

    try {
      // Get the session
      const session = await db.query.speakingSessions.findFirst({
        where: and(
          eq(schema.speakingSessions.sessionId, sessionId),
          eq(schema.speakingSessions.organizationId, organizationId)
        ),
      });

      if (!session) {
        throw new Error("Session not found");
      }

      // Verify the child is linked to this parent
      const child = await db.query.users.findFirst({
        where: and(
          eq(schema.users.stackUserId, session.userId),
          eq(schema.users.organizationId, organizationId)
        ),
      });

      if (!child) {
        throw new Error("Child not found");
      }

      // Check parent-child relationship
      const relationship = await db.query.parentStudentRelationships.findFirst({
        where: and(
          eq(schema.parentStudentRelationships.parentId, BigInt(userId)),
          eq(schema.parentStudentRelationships.studentId, child.id)
        ),
      });

      if (!relationship) {
        throw new Error("Access denied: Not your child");
      }

      // Get all messages for this session
      const messages = await db.query.speakingMessages.findMany({
        where: and(
          eq(schema.speakingMessages.sessionId, sessionId),
          eq(schema.speakingMessages.organizationId, organizationId)
        ),
        orderBy: [schema.speakingMessages.timestamp],
      });

      // Get assessments for messages
      const messagesWithAssessments = await Promise.all(
        messages.map(async (message) => {
          const assessment = await db.query.speakingAssessments.findFirst({
            where: and(
              eq(schema.speakingAssessments.messageId, message.messageId),
              eq(schema.speakingAssessments.organizationId, organizationId)
            ),
          });

          return {
            ...message,
            assessment,
          };
        })
      );

      // Log access for audit
      console.log(`[Parent Access] Parent ${userId} accessed session ${sessionId} for child ${session.userId}`);

      return {
        session,
        messages: messagesWithAssessments,
        child: {
          id: child.id.toString(),
          name: child.fullName,
          email: child.email,
        },
      };
    } catch (error) {
      console.error("Failed to get child speaking session:", error);
      throw error;
    }
  });
}

/**
 * Get child's speaking progress over time
 */
export async function getChildSpeakingProgress(
  childStackAuthId: string,
  days: number = 30
) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Check if user is a parent
    if (enhancedUser.role !== "parent") {
      throw new Error("Access denied: Parent role required");
    }

    try {
      // Verify the child is linked to this parent
      const child = await db.query.users.findFirst({
        where: and(
          eq(schema.users.stackUserId, childStackAuthId),
          eq(schema.users.organizationId, organizationId)
        ),
      });

      if (!child) {
        throw new Error("Child not found");
      }

      // Check parent-child relationship
      const relationship = await db.query.parentStudentRelationships.findFirst({
        where: and(
          eq(schema.parentStudentRelationships.parentId, BigInt(userId)),
          eq(schema.parentStudentRelationships.studentId, child.id)
        ),
      });

      if (!relationship) {
        throw new Error("Access denied: Not your child");
      }

      // Get sessions for the specified period
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const sessions = await db.query.speakingSessions.findMany({
        where: and(
          eq(schema.speakingSessions.userId, childStackAuthId),
          eq(schema.speakingSessions.organizationId, organizationId)
        ),
        orderBy: [schema.speakingSessions.startedAt],
      });

      // Filter sessions within date range
      const recentSessions = sessions.filter(
        s => new Date(s.startedAt) >= startDate
      );

      // Group sessions by date for progress chart
      const sessionsByDate = recentSessions.reduce((acc, session) => {
        const date = new Date(session.startedAt).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            count: 0,
            totalDuration: 0,
            totalWords: 0,
          };
        }
        acc[date].count++;
        acc[date].totalDuration += session.duration || 0;
        acc[date].totalWords += session.totalUserWords;
        return acc;
      }, {} as Record<string, { date: string; count: number; totalDuration: number; totalWords: number; }>);

      // Calculate overall progress metrics
      const totalSessions = recentSessions.length;
      const totalDuration = recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const totalWords = recentSessions.reduce((sum, s) => sum + s.totalUserWords, 0);
      const averageSessionsPerWeek = totalSessions / (days / 7);

      // Get CEFR level progression
      const levelProgression = sessions.map(s => ({
        date: s.startedAt,
        level: s.cefrLevel,
      }));

      return {
        child: {
          id: child.id.toString(),
          name: child.fullName,
          email: child.email,
        },
        progressData: Object.values(sessionsByDate),
        metrics: {
          totalSessions,
          totalDuration,
          totalWords,
          averageSessionsPerWeek: Math.round(averageSessionsPerWeek * 10) / 10,
          currentLevel: recentSessions[recentSessions.length - 1]?.cefrLevel || "B1",
        },
        levelProgression,
      };
    } catch (error) {
      console.error("Failed to get child speaking progress:", error);
      throw error;
    }
  });
}