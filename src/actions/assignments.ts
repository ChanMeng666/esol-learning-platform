"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Assignment target type definition
 */
type AssignmentTarget = {
  targetType: "student" | "class" | "student_group" | "grade_level";
  targetId: bigint;
};

/**
 * Assignment requirements structure
 */
type AssignmentRequirements = {
  min_duration?: number; // seconds
  min_questions?: number;
  topic?: string;
  daily_target?: number;
  specific_questions?: string[];
  diagnostic_test_id?: bigint;
};

/**
 * Recurring pattern structure for recurring assignments
 */
type RecurringPattern = {
  frequency?: "daily" | "weekly" | "monthly";
  interval?: number;
  daysOfWeek?: number[];
  endDate?: Date;
};

/**
 * Create a new assignment and assign it to targets
 * Multi-tenant: Creates assignment within teacher's organization
 */
export async function createAssignment({
  title,
  description,
  instructions,
  assignmentType,
  targetSkill,
  targetLevel,
  requirements,
  dueDate,
  isRecurring = false,
  recurringPattern,
  pointsReward,
  targets,
}: {
  title: string;
  description?: string;
  instructions?: string;
  assignmentType: string;
  targetSkill?: string;
  targetLevel?: string;
  requirements?: AssignmentRequirements;
  dueDate?: Date;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  pointsReward?: number;
  targets: AssignmentTarget[];
}) {
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

    // Create the assignment
    const [assignment] = await db
      .insert(schema.assignments)
      .values({
        organizationId,
        createdByTeacherId: enhancedUser.id,
        title,
        description,
        instructions,
        assignmentType,
        targetSkill,
        targetLevel,
        requirements,
        dueDate,
        isRecurring,
        recurringPattern,
        pointsReward,
        status: "active",
      })
      .returning();

    // Create assignment targets
    for (const target of targets) {
      await db.insert(schema.assignmentTargets).values({
        assignmentId: assignment.id,
        targetType: target.targetType,
        targetId: target.targetId,
      });

      // Create individual student status records
      let studentIds: bigint[] = [];

      if (target.targetType === "student") {
        studentIds = [target.targetId];
      } else if (target.targetType === "class") {
        // Get all students in the class
        const enrollments = await db.query.classEnrollments.findMany({
          where: and(
            eq(schema.classEnrollments.classId, target.targetId),
            eq(schema.classEnrollments.status, "active")
          ),
        });
        studentIds = enrollments.map((e) => e.studentId);
      } else if (target.targetType === "student_group") {
        // Get all students in the group
        const members = await db.query.studentGroupMembers.findMany({
          where: eq(schema.studentGroupMembers.studentGroupId, target.targetId),
        });
        studentIds = members.map((m) => m.studentId);
      } else if (target.targetType === "grade_level") {
        // Get all students in classes of this grade level
        const classes = await db.query.classes.findMany({
          where: and(
            eq(schema.classes.gradeLevelId, target.targetId),
            eq(schema.classes.organizationId, organizationId)
          ),
        });

        for (const cls of classes) {
          const enrollments = await db.query.classEnrollments.findMany({
            where: and(
              eq(schema.classEnrollments.classId, cls.id),
              eq(schema.classEnrollments.status, "active")
            ),
          });
          studentIds.push(...enrollments.map((e) => e.studentId));
        }

        // Deduplicate
        studentIds = Array.from(new Set(studentIds));
      }

      // Create status records for each student
      for (const studentId of studentIds) {
        await db.insert(schema.assignmentStudentStatus).values({
          assignmentId: assignment.id,
          studentId,
          status: "assigned",
          progressPercentage: 0,
          timeSpent: 0,
          teacherViewed: false,
        });
      }
    }

    return assignment;
  });
}

/**
 * Get assignments created by the current teacher
 * Multi-tenant: Returns assignments from teacher's organization
 */
export async function getTeacherAssignments(filters?: {
  status?: string;
  assignmentType?: string;
  limit?: number;
}) {
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

    // Build query conditions
    const conditions = [
      eq(schema.assignments.createdByTeacherId, enhancedUser.id),
      eq(schema.assignments.organizationId, organizationId),
    ];

    if (filters?.status) {
      conditions.push(eq(schema.assignments.status, filters.status));
    }

    if (filters?.assignmentType) {
      conditions.push(eq(schema.assignments.assignmentType, filters.assignmentType));
    }

    const assignments = await db.query.assignments.findMany({
      where: and(...conditions),
      orderBy: [desc(schema.assignments.createdAt)],
      limit: filters?.limit || 50,
    });

    // Get student counts and completion stats for each assignment
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        const studentStatuses = await db.query.assignmentStudentStatus.findMany({
          where: eq(schema.assignmentStudentStatus.assignmentId, assignment.id),
        });

        const totalStudents = studentStatuses.length;
        const completedCount = studentStatuses.filter((s) => s.status === "completed").length;
        const inProgressCount = studentStatuses.filter((s) => s.status === "in_progress").length;
        const submittedCount = studentStatuses.filter((s) => s.status === "submitted").length;
        const overdueCount = studentStatuses.filter((s) => s.status === "overdue").length;

        return {
          ...assignment,
          stats: {
            totalStudents,
            completedCount,
            inProgressCount,
            submittedCount,
            overdueCount,
            completionRate: totalStudents > 0 ? (completedCount / totalStudents) * 100 : 0,
          },
        };
      })
    );

    return assignmentsWithStats;
  });
}

/**
 * Get assignments for the current student
 * Multi-tenant: Returns assignments for user within organization
 */
export async function getStudentAssignments(status?: string) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a student
    if (enhancedUser.role !== "student") {
      throw new Error("Access denied: Student role required");
    }

    // Build query conditions
    const conditions = [eq(schema.assignmentStudentStatus.studentId, enhancedUser.id)];

    if (status) {
      conditions.push(eq(schema.assignmentStudentStatus.status, status));
    }

    const studentStatuses = await db.query.assignmentStudentStatus.findMany({
      where: and(...conditions),
      orderBy: [desc(schema.assignmentStudentStatus.assignedAt)],
    });

    // Get full assignment details
    const assignmentsWithDetails = await Promise.all(
      studentStatuses.map(async (status) => {
        const assignment = await db.query.assignments.findFirst({
          where: eq(schema.assignments.id, status.assignmentId),
        });

        return {
          assignment,
          status,
        };
      })
    );

    return assignmentsWithDetails.filter((item) => item.assignment !== null);
  });
}

/**
 * Submit work for an assignment (student)
 * Multi-tenant: Creates submission within organization
 */
export async function submitAssignmentWork({
  assignmentId,
  submissionType,
  practiceSessionId,
  diagnosticAttemptId,
  content,
  audioRecordingIds,
  transcriptionIds,
}: {
  assignmentId: bigint;
  submissionType: "practice_session" | "diagnostic_test" | "custom_content";
  practiceSessionId?: bigint;
  diagnosticAttemptId?: bigint;
  content?: Record<string, unknown>;
  audioRecordingIds?: bigint[];
  transcriptionIds?: bigint[];
}) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a student
    if (enhancedUser.role !== "student") {
      throw new Error("Access denied: Student role required");
    }

    // Get student status for this assignment
    const studentStatus = await db.query.assignmentStudentStatus.findFirst({
      where: and(
        eq(schema.assignmentStudentStatus.assignmentId, assignmentId),
        eq(schema.assignmentStudentStatus.studentId, enhancedUser.id)
      ),
    });

    if (!studentStatus) {
      throw new Error("Assignment not found or not assigned to you");
    }

    // Get session/attempt details if provided
    let questionsCompleted = 0;
    let questionsCorrect = 0;
    let totalPointsEarned = 0;

    if (submissionType === "practice_session" && practiceSessionId) {
      const session = await db.query.practiceSessions.findFirst({
        where: eq(schema.practiceSessions.id, practiceSessionId),
      });

      if (session) {
        questionsCompleted = session.questionsAttempted;
        questionsCorrect = session.questionsCorrect || 0;
        totalPointsEarned = session.totalPointsEarned;
      }
    }

    // Create submission
    const [submission] = await db
      .insert(schema.assignmentSubmissions)
      .values({
        assignmentId,
        studentId: enhancedUser.id,
        studentStatusId: studentStatus.id,
        submissionType,
        practiceSessionId,
        diagnosticAttemptId,
        content,
        audioRecordingIds,
        transcriptionIds,
        questionsCompleted,
        questionsCorrect,
        totalPointsEarned,
      })
      .returning();

    // Update student status
    const newProgress = 100; // Mark as completed
    await db
      .update(schema.assignmentStudentStatus)
      .set({
        status: "completed",
        progressPercentage: newProgress,
        completedAt: new Date(),
      })
      .where(eq(schema.assignmentStudentStatus.id, studentStatus.id));

    return submission;
  });
}

/**
 * Update assignment student status (teacher)
 * Multi-tenant: Validates teacher access
 */
export async function updateStudentAssignmentStatus(
  statusId: bigint,
  updates: {
    status?: string;
    progressPercentage?: number;
    timeSpent?: number;
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

    // Get status and validate teacher access
    const studentStatus = await db.query.assignmentStudentStatus.findFirst({
      where: eq(schema.assignmentStudentStatus.id, statusId),
    });

    if (!studentStatus) {
      throw new Error("Student status not found");
    }

    const assignment = await db.query.assignments.findFirst({
      where: and(
        eq(schema.assignments.id, studentStatus.assignmentId),
        eq(schema.assignments.createdByTeacherId, enhancedUser.id),
        eq(schema.assignments.organizationId, organizationId)
      ),
    });

    if (!assignment) {
      throw new Error("Access denied: Not your assignment");
    }

    // Update status
    const [updated] = await db
      .update(schema.assignmentStudentStatus)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(schema.assignmentStudentStatus.id, statusId))
      .returning();

    return updated;
  });
}

/**
 * Provide teacher feedback on assignment submission
 * Multi-tenant: Validates teacher access
 */
export async function provideTeacherFeedback(
  statusId: bigint,
  feedback: string,
  score?: number
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

    // Get status and validate teacher access
    const studentStatus = await db.query.assignmentStudentStatus.findFirst({
      where: eq(schema.assignmentStudentStatus.id, statusId),
    });

    if (!studentStatus) {
      throw new Error("Student status not found");
    }

    const assignment = await db.query.assignments.findFirst({
      where: and(
        eq(schema.assignments.id, studentStatus.assignmentId),
        eq(schema.assignments.createdByTeacherId, enhancedUser.id),
        eq(schema.assignments.organizationId, organizationId)
      ),
    });

    if (!assignment) {
      throw new Error("Access denied: Not your assignment");
    }

    // Update with feedback
    const [updated] = await db
      .update(schema.assignmentStudentStatus)
      .set({
        teacherFeedback: feedback,
        teacherScore: score,
        feedbackGivenAt: new Date(),
        teacherViewed: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.assignmentStudentStatus.id, statusId))
      .returning();

    return updated;
  });
}

/**
 * Get all submissions for an assignment (teacher)
 * Multi-tenant: Validates teacher access
 */
export async function getAssignmentSubmissions(assignmentId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a teacher and owns this assignment
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const assignment = await db.query.assignments.findFirst({
      where: and(
        eq(schema.assignments.id, assignmentId),
        eq(schema.assignments.createdByTeacherId, enhancedUser.id),
        eq(schema.assignments.organizationId, organizationId)
      ),
    });

    if (!assignment) {
      throw new Error("Assignment not found or access denied");
    }

    // Get all submissions
    const submissions = await db.query.assignmentSubmissions.findMany({
      where: eq(schema.assignmentSubmissions.assignmentId, assignmentId),
      orderBy: [desc(schema.assignmentSubmissions.submittedAt)],
    });

    // Get student details for each submission
    const submissionsWithStudents = await Promise.all(
      submissions.map(async (submission) => {
        const student = await db.query.users.findFirst({
          where: eq(schema.users.id, submission.studentId),
        });

        const status = await db.query.assignmentStudentStatus.findFirst({
          where: eq(schema.assignmentStudentStatus.id, submission.studentStatusId),
        });

        return {
          submission,
          student,
          status,
        };
      })
    );

    return submissionsWithStudents;
  });
}

/**
 * Get detailed assignment information (teacher)
 * Multi-tenant: Validates teacher access
 */
export async function getAssignmentDetails(assignmentId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate teacher access
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const assignment = await db.query.assignments.findFirst({
      where: and(
        eq(schema.assignments.id, assignmentId),
        eq(schema.assignments.createdByTeacherId, enhancedUser.id),
        eq(schema.assignments.organizationId, organizationId)
      ),
    });

    if (!assignment) {
      throw new Error("Assignment not found or access denied");
    }

    // Get assignment targets
    const targets = await db.query.assignmentTargets.findMany({
      where: eq(schema.assignmentTargets.assignmentId, assignmentId),
    });

    return {
      ...assignment,
      targets,
    };
  });
}

/**
 * Get all student statuses for an assignment (teacher)
 * Multi-tenant: Validates teacher access
 */
export async function getAssignmentStudentStatuses(assignmentId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate teacher access
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const assignment = await db.query.assignments.findFirst({
      where: and(
        eq(schema.assignments.id, assignmentId),
        eq(schema.assignments.createdByTeacherId, enhancedUser.id),
        eq(schema.assignments.organizationId, organizationId)
      ),
    });

    if (!assignment) {
      throw new Error("Assignment not found or access denied");
    }

    // Get all student statuses with student details
    const statuses = await db.query.assignmentStudentStatus.findMany({
      where: eq(schema.assignmentStudentStatus.assignmentId, assignmentId),
      orderBy: [desc(schema.assignmentStudentStatus.updatedAt)],
    });

    // Get student details for each status
    const statusesWithStudents = await Promise.all(
      statuses.map(async (status) => {
        const student = await db.query.users.findFirst({
          where: eq(schema.users.id, status.studentId),
        });

        return {
          ...status,
          student,
          progress: status.progressPercentage,
          score: status.teacherScore,
        };
      })
    );

    return statusesWithStudents.filter((item) => item.student !== null);
  });
}

/**
 * Get analytics for an assignment (teacher)
 * Multi-tenant: Validates teacher access
 */
export async function getAssignmentAnalytics(assignmentId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate teacher access
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const assignment = await db.query.assignments.findFirst({
      where: and(
        eq(schema.assignments.id, assignmentId),
        eq(schema.assignments.createdByTeacherId, enhancedUser.id),
        eq(schema.assignments.organizationId, organizationId)
      ),
    });

    if (!assignment) {
      throw new Error("Assignment not found or access denied");
    }

    // Get all student statuses
    const statuses = await db.query.assignmentStudentStatus.findMany({
      where: eq(schema.assignmentStudentStatus.assignmentId, assignmentId),
    });

    // Calculate analytics
    const totalStudents = statuses.length;
    const completed = statuses.filter((s) => s.status === "completed").length;
    const inProgress = statuses.filter((s) => s.status === "in_progress").length;
    const notStarted = statuses.filter((s) => s.status === "assigned").length;
    const overdue = statuses.filter((s) => s.status === "overdue").length;

    const avgProgress =
      statuses.reduce((sum, s) => sum + s.progressPercentage, 0) / (totalStudents || 1);

    const avgTimeSpent =
      statuses.reduce((sum, s) => sum + s.timeSpent, 0) / (totalStudents || 1);

    // Get submissions
    const submissions = await db.query.assignmentSubmissions.findMany({
      where: eq(schema.assignmentSubmissions.assignmentId, assignmentId),
    });

    const avgScore =
      submissions.reduce((sum, s) => sum + (s.totalPointsEarned || 0), 0) /
      (submissions.length || 1);

    return {
      assignment,
      totalStudents,
      completed,
      inProgress,
      notStarted,
      overdue,
      completionRate: totalStudents > 0 ? (completed / totalStudents) * 100 : 0,
      avgProgress,
      avgTimeSpent,
      avgScore,
      submissions: submissions.length,
    };
  });
}

/**
 * Delete an assignment (teacher)
 * Multi-tenant: Validates teacher access
 */
export async function deleteAssignment(assignmentId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate teacher access
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const assignment = await db.query.assignments.findFirst({
      where: and(
        eq(schema.assignments.id, assignmentId),
        eq(schema.assignments.createdByTeacherId, enhancedUser.id),
        eq(schema.assignments.organizationId, organizationId)
      ),
    });

    if (!assignment) {
      throw new Error("Assignment not found or access denied");
    }

    // Soft delete (archive) instead of hard delete
    await db
      .update(schema.assignments)
      .set({
        status: "archived",
        updatedAt: new Date(),
      })
      .where(eq(schema.assignments.id, assignmentId));

    return { success: true };
  });
}

/**
 * Update an assignment (teacher)
 * Multi-tenant: Validates teacher access
 */
export async function updateAssignment(
  assignmentId: bigint,
  updates: {
    title?: string;
    description?: string;
    instructions?: string;
    dueDate?: Date;
    pointsReward?: number;
    status?: string;
  }
) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate teacher access
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const assignment = await db.query.assignments.findFirst({
      where: and(
        eq(schema.assignments.id, assignmentId),
        eq(schema.assignments.createdByTeacherId, enhancedUser.id),
        eq(schema.assignments.organizationId, organizationId)
      ),
    });

    if (!assignment) {
      throw new Error("Assignment not found or access denied");
    }

    const [updated] = await db
      .update(schema.assignments)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(schema.assignments.id, assignmentId))
      .returning();

    return updated;
  });
}
