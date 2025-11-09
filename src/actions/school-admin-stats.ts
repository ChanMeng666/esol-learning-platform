"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, sql, count, desc, avg } from "drizzle-orm";

/**
 * Get school admin dashboard statistics
 * Multi-tenant: Returns stats for user's organization only
 */
export async function getSchoolAdminStats() {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser || enhancedUser.role !== "school_admin") {
      throw new Error("Access denied: School admin role required");
    }

    // Count total students
    const studentCount = await db
      .select({ count: count() })
      .from(schema.users)
      .where(
        and(
          eq(schema.users.organizationId, organizationId),
          eq(schema.users.role, "student"),
          eq(schema.users.isActive, true)
        )
      );

    // Count total teachers
    const teacherCount = await db
      .select({ count: count() })
      .from(schema.users)
      .where(
        and(
          eq(schema.users.organizationId, organizationId),
          eq(schema.users.role, "teacher"),
          eq(schema.users.isActive, true)
        )
      );

    // Count total departments
    const departmentCount = await db
      .select({ count: count() })
      .from(schema.departments)
      .where(
        and(
          eq(schema.departments.organizationId, organizationId),
          eq(schema.departments.isActive, true)
        )
      );

    // Count total classes
    const classCount = await db
      .select({ count: count() })
      .from(schema.classes)
      .where(
        and(
          eq(schema.classes.organizationId, organizationId),
          eq(schema.classes.isActive, true)
        )
      );

    return {
      totalStudents: Number(studentCount[0]?.count || 0),
      totalTeachers: Number(teacherCount[0]?.count || 0),
      totalDepartments: Number(departmentCount[0]?.count || 0),
      totalClasses: Number(classCount[0]?.count || 0),
    };
  });
}

/**
 * Get departments with statistics for school admin
 * Multi-tenant: Returns departments from user's organization only
 */
export async function getDepartmentsWithStats() {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser || enhancedUser.role !== "school_admin") {
      throw new Error("Access denied: School admin role required");
    }

    // Get all departments with head teacher info
    const departments = await db
      .select({
        id: schema.departments.id,
        name: schema.departments.name,
        description: schema.departments.description,
        headTeacherId: schema.departments.headTeacherId,
        headName: schema.users.fullName,
        headEmail: schema.users.email,
        isActive: schema.departments.isActive,
        createdAt: schema.departments.createdAt,
      })
      .from(schema.departments)
      .leftJoin(
        schema.users,
        eq(schema.departments.headTeacherId, schema.users.id)
      )
      .where(
        and(
          eq(schema.departments.organizationId, organizationId),
          eq(schema.departments.isActive, true)
        )
      )
      .orderBy(schema.departments.name);

    // For each department, count teachers and classes
    const departmentsWithStats = await Promise.all(
      departments.map(async (dept) => {
        // Count teachers in this department's classes
        const teacherCount = await db
          .selectDistinct({ teacherId: schema.classes.teacherId })
          .from(schema.classes)
          .where(
            and(
              eq(schema.classes.departmentId, dept.id),
              eq(schema.classes.organizationId, organizationId),
              eq(schema.classes.isActive, true)
            )
          );

        // Count classes in this department
        const classCountResult = await db
          .select({ count: count() })
          .from(schema.classes)
          .where(
            and(
              eq(schema.classes.departmentId, dept.id),
              eq(schema.classes.organizationId, organizationId),
              eq(schema.classes.isActive, true)
            )
          );

        return {
          ...dept,
          teacherCount: teacherCount.length,
          classCount: Number(classCountResult[0]?.count || 0),
        };
      })
    );

    return departmentsWithStats;
  });
}

/**
 * Get all organization users with details for school admin
 * Multi-tenant: Returns users from user's organization only
 */
export async function getOrganizationUsersWithDetails(roleFilter?: string) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser || enhancedUser.role !== "school_admin") {
      throw new Error("Access denied: School admin role required");
    }

    // Build the where condition
    const conditions = [eq(schema.users.organizationId, organizationId)];

    // Add role filter if provided
    if (roleFilter && roleFilter !== "all") {
      conditions.push(eq(schema.users.role, roleFilter));
    }

    const users = await db
      .select({
        id: schema.users.id,
        stackUserId: schema.users.stackUserId,
        email: schema.users.email,
        fullName: schema.users.fullName,
        role: schema.users.role,
        isActive: schema.users.isActive,
        metadata: schema.users.metadata,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      })
      .from(schema.users)
      .where(and(...conditions))
      .orderBy(desc(schema.users.createdAt));

    return users;
  });
}

/**
 * Get all organization classes with statistics for school admin
 * Multi-tenant: Returns classes from user's organization only
 */
export async function getOrganizationClassesWithStats() {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser || enhancedUser.role !== "school_admin") {
      throw new Error("Access denied: School admin role required");
    }

    // Get all classes with teacher, department, and grade level info
    const classes = await db
      .select({
        id: schema.classes.id,
        name: schema.classes.name,
        teacherId: schema.classes.teacherId,
        teacherName: schema.users.fullName,
        teacherEmail: schema.users.email,
        departmentId: schema.classes.departmentId,
        departmentName: schema.departments.name,
        gradeLevelId: schema.classes.gradeLevelId,
        gradeLevelName: schema.gradeLevels.name,
        academicYear: schema.classes.academicYear,
        isActive: schema.classes.isActive,
        createdAt: schema.classes.createdAt,
      })
      .from(schema.classes)
      .leftJoin(schema.users, eq(schema.classes.teacherId, schema.users.id))
      .leftJoin(
        schema.departments,
        eq(schema.classes.departmentId, schema.departments.id)
      )
      .leftJoin(
        schema.gradeLevels,
        eq(schema.classes.gradeLevelId, schema.gradeLevels.id)
      )
      .where(
        and(
          eq(schema.classes.organizationId, organizationId),
          eq(schema.classes.isActive, true)
        )
      )
      .orderBy(desc(schema.classes.createdAt));

    // For each class, count enrolled students
    const classesWithStats = await Promise.all(
      classes.map(async (cls) => {
        const studentCountResult = await db
          .select({ count: count() })
          .from(schema.classEnrollments)
          .where(
            and(
              eq(schema.classEnrollments.classId, cls.id),
              eq(schema.classEnrollments.status, "active")
            )
          );

        return {
          ...cls,
          studentCount: Number(studentCountResult[0]?.count || 0),
        };
      })
    );

    return classesWithStats;
  });
}

/**
 * Get average scores for classes based on diagnostic test results
 * Multi-tenant: Returns scores for user's organization classes only
 */
export async function getClassAverageScores(classIds: bigint[]) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser || enhancedUser.role !== "school_admin") {
      throw new Error("Access denied: School admin role required");
    }

    if (!classIds || classIds.length === 0) {
      return {};
    }

    // Get average scores for each class by aggregating student diagnostic results
    const scores: Record<string, number> = {};

    for (const classId of classIds) {
      // Get all students in this class
      const enrollments = await db
        .select({ studentId: schema.classEnrollments.studentId })
        .from(schema.classEnrollments)
        .where(
          and(
            eq(schema.classEnrollments.classId, classId),
            eq(schema.classEnrollments.status, "active")
          )
        );

      if (enrollments.length === 0) {
        scores[classId.toString()] = 0;
        continue;
      }

      const studentIds = enrollments.map((e) => e.studentId);

      // Calculate average of their most recent diagnostic test scores
      const avgScoreResult = await db
        .select({
          avgScore: avg(schema.studentDiagnosticResults.percentageScore),
        })
        .from(schema.studentDiagnosticResults)
        .where(
          and(
            sql`${schema.studentDiagnosticResults.studentId} = ANY(${studentIds})`,
            eq(schema.studentDiagnosticResults.organizationId, organizationId)
          )
        );

      const avgScore = avgScoreResult[0]?.avgScore;
      scores[classId.toString()] = avgScore ? Math.round(Number(avgScore)) : 0;
    }

    return scores;
  });
}

/**
 * Get assignment completion rates for classes
 * Multi-tenant: Returns completion rates for user's organization classes only
 */
export async function getAssignmentCompletionRates(classIds: bigint[]) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser || enhancedUser.role !== "school_admin") {
      throw new Error("Access denied: School admin role required");
    }

    if (!classIds || classIds.length === 0) {
      return {};
    }

    const completionRates: Record<string, number> = {};

    for (const classId of classIds) {
      // Get all assignments for this class
      const assignments = await db
        .select({ id: schema.assignments.id })
        .from(schema.assignments)
        .innerJoin(
          schema.assignmentTargets,
          eq(schema.assignments.id, schema.assignmentTargets.assignmentId)
        )
        .where(
          and(
            eq(schema.assignments.organizationId, organizationId),
            eq(schema.assignmentTargets.targetType, "class"),
            eq(schema.assignmentTargets.targetId, classId),
            eq(schema.assignments.status, "active")
          )
        );

      if (assignments.length === 0) {
        completionRates[classId.toString()] = 0;
        continue;
      }

      const assignmentIds = assignments.map((a) => a.id);

      // Count total assignment-student pairs
      const totalCount = await db
        .select({ count: count() })
        .from(schema.assignmentStudentStatus)
        .where(
          sql`${schema.assignmentStudentStatus.assignmentId} = ANY(${assignmentIds})`
        );

      // Count completed assignments
      const completedCount = await db
        .select({ count: count() })
        .from(schema.assignmentStudentStatus)
        .where(
          and(
            sql`${schema.assignmentStudentStatus.assignmentId} = ANY(${assignmentIds})`,
            eq(schema.assignmentStudentStatus.status, "completed")
          )
        );

      const total = Number(totalCount[0]?.count || 0);
      const completed = Number(completedCount[0]?.count || 0);

      completionRates[classId.toString()] =
        total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    return completionRates;
  });
}
