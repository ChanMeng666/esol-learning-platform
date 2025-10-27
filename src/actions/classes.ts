"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc, or, sql, inArray } from "drizzle-orm";

/**
 * Get all classes assigned to the current teacher
 * Multi-tenant: Returns classes from user's organization only
 */
export async function getTeacherClasses() {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a teacher
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    // Get classes where user is the primary teacher
    const primaryClasses = await db.query.classes.findMany({
      where: and(
        eq(schema.classes.teacherId, enhancedUser.id),
        eq(schema.classes.organizationId, organizationId),
        eq(schema.classes.isActive, true)
      ),
      orderBy: [desc(schema.classes.createdAt)],
    });

    // Get classes where user is an assistant teacher
    const assistantClassIds = await db.query.classTeachers.findMany({
      where: eq(schema.classTeachers.teacherId, enhancedUser.id),
    });

    const assistantClasses = assistantClassIds.length > 0
      ? await db.query.classes.findMany({
          where: and(
            inArray(
              schema.classes.id,
              assistantClassIds.map((ct) => ct.classId)
            ),
            eq(schema.classes.organizationId, organizationId),
            eq(schema.classes.isActive, true)
          ),
        })
      : [];

    // Combine and deduplicate
    const allClasses = [...primaryClasses, ...assistantClasses];
    const uniqueClasses = Array.from(
      new Map(allClasses.map((c) => [c.id, c])).values()
    );

    // Get student counts and average scores for each class
    const classesWithCounts = await Promise.all(
      uniqueClasses.map(async (cls) => {
        const enrollments = await db.query.classEnrollments.findMany({
          where: and(
            eq(schema.classEnrollments.classId, cls.id),
            eq(schema.classEnrollments.status, "active")
          ),
        });

        // Calculate average score based on student progress
        let averageScore = 75; // Default score
        if (enrollments.length > 0) {
          const studentIds = enrollments.map(e => e.studentId);

          // Get progress for all students in this class
          const studentProgress = await db.query.userProgress.findMany({
            where: and(
              inArray(schema.userProgress.userId, studentIds.map(id => id.toString())),
              eq(schema.userProgress.organizationId, organizationId)
            ),
          });

          if (studentProgress.length > 0) {
            // Calculate average of all skill progress
            const totalScore = studentProgress.reduce((sum, progress) => {
              const skillAverage = (
                progress.listeningProgress +
                progress.speakingProgress +
                progress.readingProgress +
                progress.writingProgress
              ) / 4;
              return sum + skillAverage;
            }, 0);

            averageScore = Math.round(totalScore / studentProgress.length);
          }
        }

        return {
          ...cls,
          studentCount: enrollments.length,
          averageScore,
        };
      })
    );

    return classesWithCounts;
  });
}

/**
 * Get students enrolled in a specific class with their progress data
 * Multi-tenant: Validates teacher access to class
 */
export async function getClassStudents(
  classId: bigint,
  filters?: {
    sortBy?: "name" | "progress" | "lastActivity";
    orderBy?: "asc" | "desc";
  }
) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a teacher
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    // Validate teacher has access to this class
    const classInfo = await db.query.classes.findFirst({
      where: and(
        eq(schema.classes.id, classId),
        eq(schema.classes.organizationId, organizationId)
      ),
    });

    if (!classInfo) {
      throw new Error("Class not found");
    }

    const isTeacher =
      classInfo.teacherId === enhancedUser.id ||
      (await db.query.classTeachers.findFirst({
        where: and(
          eq(schema.classTeachers.classId, classId),
          eq(schema.classTeachers.teacherId, enhancedUser.id)
        ),
      }));

    if (!isTeacher) {
      throw new Error("Access denied: Not a teacher of this class");
    }

    // Get enrolled students
    const enrollments = await db.query.classEnrollments.findMany({
      where: and(
        eq(schema.classEnrollments.classId, classId),
        eq(schema.classEnrollments.status, "active")
      ),
    });

    // Get student details with progress
    const students = await Promise.all(
      enrollments.map(async (enrollment) => {
        const student = await db.query.users.findFirst({
          where: eq(schema.users.id, enrollment.studentId),
        });

        if (!student) return null;

        // Get NZCEL progress
        const nzcelProgress = await db.query.userProgress.findFirst({
          where: and(
            eq(schema.userProgress.userId, student.stackUserId),
            eq(schema.userProgress.organizationId, organizationId)
          ),
        });

        // Get CEFR progress
        const cefrProgress = await db.query.cefrProgress.findFirst({
          where: and(
            eq(schema.cefrProgress.userId, student.stackUserId),
            eq(schema.cefrProgress.organizationId, organizationId)
          ),
        });

        // Get latest diagnostic results
        const latestDiagnostic = await db.query.studentDiagnosticResults.findFirst({
          where: and(
            eq(schema.studentDiagnosticResults.studentId, student.id),
            eq(schema.studentDiagnosticResults.organizationId, organizationId)
          ),
          orderBy: [desc(schema.studentDiagnosticResults.completedAt)],
        });

        // Calculate average progress across all skills
        const avgProgress = nzcelProgress
          ? (nzcelProgress.listeningProgress +
              nzcelProgress.speakingProgress +
              nzcelProgress.readingProgress +
              nzcelProgress.writingProgress) /
            4
          : 0;

        return {
          student,
          enrollment,
          nzcelProgress,
          cefrProgress,
          latestDiagnostic,
          avgProgress,
        };
      })
    );

    // Filter out nulls and sort
    const validStudents = students.filter(Boolean) as NonNullable<typeof students[0]>[];

    // Apply sorting
    if (filters?.sortBy === "name") {
      validStudents.sort((a, b) => {
        const comparison = a.student.fullName.localeCompare(b.student.fullName);
        return filters.orderBy === "desc" ? -comparison : comparison;
      });
    } else if (filters?.sortBy === "progress") {
      validStudents.sort((a, b) => {
        const comparison = a.avgProgress - b.avgProgress;
        return filters.orderBy === "desc" ? -comparison : comparison;
      });
    } else if (filters?.sortBy === "lastActivity") {
      validStudents.sort((a, b) => {
        const aDate = a.nzcelProgress?.lastStudyDate || new Date(0);
        const bDate = b.nzcelProgress?.lastStudyDate || new Date(0);
        const comparison = aDate.getTime() - bDate.getTime();
        return filters.orderBy === "desc" ? -comparison : comparison;
      });
    }

    return validStudents;
  });
}

/**
 * Get detailed progress for a specific student
 * Multi-tenant: Validates teacher access to student
 */
export async function getStudentDetailedProgress(studentId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a teacher
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    // Get student details
    const student = await db.query.users.findFirst({
      where: and(
        eq(schema.users.id, studentId),
        eq(schema.users.organizationId, organizationId)
      ),
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // Validate teacher has access (student must be in one of teacher's classes)
    const studentEnrollments = await db.query.classEnrollments.findMany({
      where: eq(schema.classEnrollments.studentId, studentId),
    });

    const teacherClasses = await getTeacherClasses();
    const hasAccess = studentEnrollments.some((enrollment) =>
      teacherClasses.some((cls) => cls.id === enrollment.classId)
    );

    if (!hasAccess) {
      throw new Error("Access denied: Student not in your classes");
    }

    // Get all progress data
    const nzcelProgress = await db.query.userProgress.findFirst({
      where: and(
        eq(schema.userProgress.userId, student.stackUserId),
        eq(schema.userProgress.organizationId, organizationId)
      ),
    });

    const cefrProgress = await db.query.cefrProgress.findFirst({
      where: and(
        eq(schema.cefrProgress.userId, student.stackUserId),
        eq(schema.cefrProgress.organizationId, organizationId)
      ),
    });

    // Get diagnostic history
    const diagnosticHistory = await db.query.studentDiagnosticResults.findMany({
      where: and(
        eq(schema.studentDiagnosticResults.studentId, studentId),
        eq(schema.studentDiagnosticResults.organizationId, organizationId)
      ),
      orderBy: [desc(schema.studentDiagnosticResults.completedAt)],
    });

    // Get recent practice sessions
    const recentSessions = await db.query.practiceSessions.findMany({
      where: and(
        eq(schema.practiceSessions.userId, student.stackUserId),
        eq(schema.practiceSessions.organizationId, organizationId),
        eq(schema.practiceSessions.isCompleted, true)
      ),
      orderBy: [desc(schema.practiceSessions.endedAt)],
      limit: 10,
    });

    // Get achievements
    const achievements = await db.query.achievements.findMany({
      where: and(
        eq(schema.achievements.userId, student.stackUserId),
        eq(schema.achievements.organizationId, organizationId)
      ),
    });

    // Get badges
    const badges = await db.query.badges.findMany({
      where: and(
        eq(schema.badges.userId, student.stackUserId),
        eq(schema.badges.organizationId, organizationId)
      ),
      orderBy: [desc(schema.badges.earnedAt)],
    });

    return {
      student,
      nzcelProgress,
      cefrProgress,
      diagnosticHistory,
      recentSessions,
      achievements,
      badges,
    };
  });
}

/**
 * Get analytics summary for a class
 * Multi-tenant: Validates teacher access to class
 */
export async function getClassAnalyticsSummary(
  classId: bigint,
  dateRange?: {
    start: Date;
    end: Date;
  }
) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a teacher with access to this class
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const classInfo = await db.query.classes.findFirst({
      where: and(
        eq(schema.classes.id, classId),
        eq(schema.classes.organizationId, organizationId)
      ),
    });

    if (!classInfo) {
      throw new Error("Class not found");
    }

    const isTeacher =
      classInfo.teacherId === enhancedUser.id ||
      (await db.query.classTeachers.findFirst({
        where: and(
          eq(schema.classTeachers.classId, classId),
          eq(schema.classTeachers.teacherId, enhancedUser.id)
        ),
      }));

    if (!isTeacher) {
      throw new Error("Access denied: Not a teacher of this class");
    }

    // Get students
    const students = await getClassStudents(classId);

    // Calculate aggregate statistics
    const totalStudents = students.length;
    const activeStudents = students.filter(
      (s) =>
        s.nzcelProgress?.lastStudyDate &&
        new Date(s.nzcelProgress.lastStudyDate).getTime() >
          Date.now() - 7 * 24 * 60 * 60 * 1000 // Active in last 7 days
    ).length;

    // Average progress across all skills
    const avgListening =
      students.reduce((sum, s) => sum + (s.nzcelProgress?.listeningProgress || 0), 0) /
      (totalStudents || 1);
    const avgSpeaking =
      students.reduce((sum, s) => sum + (s.nzcelProgress?.speakingProgress || 0), 0) /
      (totalStudents || 1);
    const avgReading =
      students.reduce((sum, s) => sum + (s.nzcelProgress?.readingProgress || 0), 0) /
      (totalStudents || 1);
    const avgWriting =
      students.reduce((sum, s) => sum + (s.nzcelProgress?.writingProgress || 0), 0) /
      (totalStudents || 1);

    // Get total questions completed and accuracy
    const totalQuestionsCompleted = students.reduce(
      (sum, s) => sum + (s.nzcelProgress?.questionsCompleted || 0),
      0
    );

    const totalCorrectAnswers = students.reduce(
      (sum, s) => sum + (s.nzcelProgress?.correctAnswers || 0),
      0
    );

    const averageAccuracy =
      totalQuestionsCompleted > 0
        ? (totalCorrectAnswers / totalQuestionsCompleted) * 100
        : 0;

    // Identify top performers (top 20% by total points)
    const sortedByPoints = [...students].sort(
      (a, b) => (b.nzcelProgress?.totalPoints || 0) - (a.nzcelProgress?.totalPoints || 0)
    );
    const topPerformers = sortedByPoints.slice(0, Math.max(1, Math.floor(totalStudents * 0.2)));

    // Identify students needing attention (bottom 20% by progress or inactive)
    const sortedByProgress = [...students].sort((a, b) => b.avgProgress - a.avgProgress);
    const needsAttention = sortedByProgress.slice(-Math.max(1, Math.floor(totalStudents * 0.2)));

    return {
      classInfo,
      totalStudents,
      activeStudents,
      avgProgress: {
        listening: avgListening,
        speaking: avgSpeaking,
        reading: avgReading,
        writing: avgWriting,
      },
      totalQuestionsCompleted,
      averageAccuracy,
      topPerformers: topPerformers.map((s) => s.student),
      needsAttention: needsAttention.map((s) => s.student),
    };
  });
}

/**
 * Enroll students to a class
 * Multi-tenant: Validates teacher access and organization membership
 */
export async function enrollStudentsToClass(classId: bigint, studentIds: bigint[]) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a teacher
    if (enhancedUser.role !== "teacher" && enhancedUser.role !== "school_admin") {
      throw new Error("Access denied: Teacher or admin role required");
    }

    // Validate class exists and is in same organization
    const classInfo = await db.query.classes.findFirst({
      where: and(
        eq(schema.classes.id, classId),
        eq(schema.classes.organizationId, organizationId)
      ),
    });

    if (!classInfo) {
      throw new Error("Class not found");
    }

    // Validate all students exist and are in same organization
    const students = await db.query.users.findMany({
      where: and(
        inArray(schema.users.id, studentIds),
        eq(schema.users.organizationId, organizationId),
        eq(schema.users.role, "student")
      ),
    });

    if (students.length !== studentIds.length) {
      throw new Error("Some students not found or invalid");
    }

    // Create enrollments (skip if already enrolled)
    const enrollments = [];
    for (const studentId of studentIds) {
      const existing = await db.query.classEnrollments.findFirst({
        where: and(
          eq(schema.classEnrollments.classId, classId),
          eq(schema.classEnrollments.studentId, studentId)
        ),
      });

      if (!existing) {
        const [enrollment] = await db
          .insert(schema.classEnrollments)
          .values({
            classId,
            studentId,
            status: "active",
          })
          .returning();

        enrollments.push(enrollment);
      }
    }

    return {
      success: true,
      enrolled: enrollments.length,
      skipped: studentIds.length - enrollments.length,
    };
  });
}

/**
 * Create a student group for flexible assignment targeting
 * Multi-tenant: Creates group within teacher's organization
 */
export async function createStudentGroup(name: string, description: string, studentIds: bigint[]) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a teacher
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    // Validate all students exist and are in same organization
    if (studentIds.length > 0) {
      const students = await db.query.users.findMany({
        where: and(
          inArray(schema.users.id, studentIds),
          eq(schema.users.organizationId, organizationId),
          eq(schema.users.role, "student")
        ),
      });

      if (students.length !== studentIds.length) {
        throw new Error("Some students not found or invalid");
      }
    }

    // Create group
    const [group] = await db
      .insert(schema.studentGroups)
      .values({
        organizationId,
        createdByTeacherId: enhancedUser.id,
        name,
        description,
      })
      .returning();

    // Add members
    if (studentIds.length > 0) {
      await db.insert(schema.studentGroupMembers).values(
        studentIds.map((studentId) => ({
          studentGroupId: group.id,
          studentId,
        }))
      );
    }

    return group;
  });
}

/**
 * Get teacher's student groups
 * Multi-tenant: Returns groups from user's organization only
 */
export async function getTeacherStudentGroups() {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a teacher
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const groups = await db.query.studentGroups.findMany({
      where: and(
        eq(schema.studentGroups.createdByTeacherId, enhancedUser.id),
        eq(schema.studentGroups.organizationId, organizationId)
      ),
      orderBy: [desc(schema.studentGroups.createdAt)],
    });

    // Get member counts for each group
    const groupsWithCounts = await Promise.all(
      groups.map(async (group) => {
        const members = await db.query.studentGroupMembers.findMany({
          where: eq(schema.studentGroupMembers.studentGroupId, group.id),
        });

        return {
          ...group,
          memberCount: members.length,
        };
      })
    );

    return groupsWithCounts;
  });
}
