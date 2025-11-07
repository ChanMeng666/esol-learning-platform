"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { fetchWithDrizzle, type EnhancedUser } from "@/lib/db";

/**
 * Get all students in teacher's classes with their speaking practice stats
 */
export async function getClassStudentsSpeaking() {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Check if user is a teacher
    if (enhancedUser.role !== "teacher" && enhancedUser.role !== "school_admin" && enhancedUser.role !== "department_head") {
      throw new Error("Access denied: Teacher role required");
    }

    try {
      // Get all classes taught by this teacher
      const teacherClasses = await db.query.classes.findMany({
        where: and(
          eq(schema.classes.teacherId, BigInt(userId)),
          eq(schema.classes.organizationId, organizationId),
          eq(schema.classes.status, "active")
        ),
      });

      const classIds = teacherClasses.map(c => c.id);

      if (classIds.length === 0) {
        return { classes: [], students: [] };
      }

      // Get all students enrolled in these classes
      const enrollments = await db.query.classEnrollments.findMany({
        where: and(
          inArray(schema.classEnrollments.classId, classIds),
          eq(schema.classEnrollments.status, "active")
        ),
        with: {
          student: true,
        },
      });

      // Get unique students with their speaking session counts
      const studentIds = [...new Set(enrollments.map(e => e.studentId.toString()))];

      const studentsWithStats = await Promise.all(
        studentIds.map(async (studentId) => {
          // Get student info
          const student = await db.query.users.findFirst({
            where: and(
              eq(schema.users.id, BigInt(studentId)),
              eq(schema.users.organizationId, organizationId)
            ),
          });

          if (!student) return null;

          // Get speaking session count for this student
          const sessions = await db.query.speakingSessions.findMany({
            where: and(
              eq(schema.speakingSessions.userId, student.stackAuthId),
              eq(schema.speakingSessions.organizationId, organizationId)
            ),
          });

          // Calculate total practice time
          const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
          const completedSessions = sessions.filter(s => s.isCompleted).length;

          return {
            studentId: student.id.toString(),
            stackAuthId: student.stackAuthId,
            name: student.name,
            email: student.email,
            totalSessions: sessions.length,
            completedSessions,
            totalDuration,
            lastPractice: sessions[0]?.startedAt || null,
            classes: enrollments
              .filter(e => e.studentId.toString() === studentId)
              .map(e => teacherClasses.find(c => c.id === e.classId)?.name)
              .filter(Boolean),
          };
        })
      );

      return {
        classes: teacherClasses,
        students: studentsWithStats.filter(Boolean),
      };
    } catch (error) {
      console.error("Failed to get class students speaking data:", error);
      throw new Error("Failed to load student data");
    }
  });
}

/**
 * Get speaking sessions for a specific student (with permission check)
 */
export async function getStudentSpeakingSessions(
  studentStackAuthId: string,
  limit: number = 20,
  offset: number = 0
) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Check if user is a teacher
    if (enhancedUser.role !== "teacher" && enhancedUser.role !== "school_admin" && enhancedUser.role !== "department_head") {
      throw new Error("Access denied: Teacher role required");
    }

    try {
      // Verify the student is in one of the teacher's classes
      const student = await db.query.users.findFirst({
        where: and(
          eq(schema.users.stackAuthId, studentStackAuthId),
          eq(schema.users.organizationId, organizationId)
        ),
      });

      if (!student) {
        throw new Error("Student not found");
      }

      // Get teacher's classes
      const teacherClasses = await db.query.classes.findMany({
        where: and(
          eq(schema.classes.teacherId, BigInt(userId)),
          eq(schema.classes.organizationId, organizationId),
          eq(schema.classes.status, "active")
        ),
      });

      const classIds = teacherClasses.map(c => c.id);

      // Check if student is enrolled in any of the teacher's classes
      const enrollment = await db.query.classEnrollments.findFirst({
        where: and(
          eq(schema.classEnrollments.studentId, student.id),
          inArray(schema.classEnrollments.classId, classIds),
          eq(schema.classEnrollments.status, "active")
        ),
      });

      if (!enrollment) {
        throw new Error("Access denied: Student not in your class");
      }

      // Get speaking sessions for the student
      const sessions = await db.query.speakingSessions.findMany({
        where: and(
          eq(schema.speakingSessions.userId, studentStackAuthId),
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
      console.log(`[Teacher Access] Teacher ${userId} accessed student ${studentStackAuthId} speaking sessions`);

      return sessionsWithCounts;
    } catch (error) {
      console.error("Failed to get student speaking sessions:", error);
      throw error;
    }
  });
}

/**
 * Get detailed speaking session with messages and audio (with permission check)
 */
export async function getStudentSpeakingSession(sessionId: string) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Check if user is a teacher
    if (enhancedUser.role !== "teacher" && enhancedUser.role !== "school_admin" && enhancedUser.role !== "department_head") {
      throw new Error("Access denied: Teacher role required");
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

      // Verify the student is in one of the teacher's classes
      const student = await db.query.users.findFirst({
        where: and(
          eq(schema.users.stackAuthId, session.userId),
          eq(schema.users.organizationId, organizationId)
        ),
      });

      if (!student) {
        throw new Error("Student not found");
      }

      // Get teacher's classes
      const teacherClasses = await db.query.classes.findMany({
        where: and(
          eq(schema.classes.teacherId, BigInt(userId)),
          eq(schema.classes.organizationId, organizationId),
          eq(schema.classes.status, "active")
        ),
      });

      const classIds = teacherClasses.map(c => c.id);

      // Check if student is enrolled in any of the teacher's classes
      const enrollment = await db.query.classEnrollments.findFirst({
        where: and(
          eq(schema.classEnrollments.studentId, student.id),
          inArray(schema.classEnrollments.classId, classIds),
          eq(schema.classEnrollments.status, "active")
        ),
      });

      if (!enrollment) {
        throw new Error("Access denied: Student not in your class");
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
      console.log(`[Teacher Access] Teacher ${userId} accessed session ${sessionId} for student ${session.userId}`);

      return {
        session,
        messages: messagesWithAssessments,
        student: {
          id: student.id.toString(),
          name: student.name,
          email: student.email,
        },
      };
    } catch (error) {
      console.error("Failed to get student speaking session:", error);
      throw error;
    }
  });
}

/**
 * Get class-wide speaking statistics
 */
export async function getClassSpeakingStats(classId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Check if user is a teacher
    if (enhancedUser.role !== "teacher" && enhancedUser.role !== "school_admin" && enhancedUser.role !== "department_head") {
      throw new Error("Access denied: Teacher role required");
    }

    try {
      // Verify the class belongs to this teacher
      const classRecord = await db.query.classes.findFirst({
        where: and(
          eq(schema.classes.id, classId),
          eq(schema.classes.teacherId, BigInt(userId)),
          eq(schema.classes.organizationId, organizationId)
        ),
      });

      if (!classRecord) {
        throw new Error("Class not found or access denied");
      }

      // Get all students in this class
      const enrollments = await db.query.classEnrollments.findMany({
        where: and(
          eq(schema.classEnrollments.classId, classId),
          eq(schema.classEnrollments.status, "active")
        ),
        with: {
          student: true,
        },
      });

      // Calculate stats for each student
      const studentStats = await Promise.all(
        enrollments.map(async (enrollment) => {
          const student = enrollment.student;

          // Get all speaking sessions for this student
          const sessions = await db.query.speakingSessions.findMany({
            where: and(
              eq(schema.speakingSessions.userId, student.stackAuthId),
              eq(schema.speakingSessions.organizationId, organizationId)
            ),
          });

          const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
          const completedSessions = sessions.filter(s => s.isCompleted).length;

          return {
            studentId: student.id.toString(),
            name: student.name,
            totalSessions: sessions.length,
            completedSessions,
            totalDuration,
            averageDuration: sessions.length > 0 ? totalDuration / sessions.length : 0,
            lastPractice: sessions[0]?.startedAt || null,
          };
        })
      );

      // Calculate class averages
      const totalStudents = studentStats.length;
      const activePracticers = studentStats.filter(s => s.totalSessions > 0).length;
      const avgSessionsPerStudent = totalStudents > 0
        ? studentStats.reduce((sum, s) => sum + s.totalSessions, 0) / totalStudents
        : 0;
      const totalClassDuration = studentStats.reduce((sum, s) => sum + s.totalDuration, 0);

      return {
        className: classRecord.name,
        totalStudents,
        activePracticers,
        avgSessionsPerStudent,
        totalClassDuration,
        studentStats: studentStats.sort((a, b) => b.totalSessions - a.totalSessions),
      };
    } catch (error) {
      console.error("Failed to get class speaking stats:", error);
      throw error;
    }
  });
}