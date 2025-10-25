"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/types";

/**
 * User Management Server Actions
 * Handles multi-tenant user operations
 */

/**
 * Create or update enhanced user record
 * Called after Stack Auth user creation
 */
export async function createEnhancedUser(data: {
  stackUserId: string;
  email: string;
  fullName: string;
  organizationId: bigint;
  role: UserRole;
  metadata?: Record<string, unknown>;
}) {
  return fetchWithDrizzle(async (db) => {
    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: eq(schema.users.stackUserId, data.stackUserId),
    });

    if (existing) {
      // Update existing user
      const [updated] = await db
        .update(schema.users)
        .set({
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          metadata: data.metadata || null,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.stackUserId, data.stackUserId))
        .returning();

      return updated;
    }

    // Create new user
    const [user] = await db
      .insert(schema.users)
      .values({
        organizationId: data.organizationId,
        stackUserId: data.stackUserId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        isActive: true,
        metadata: data.metadata || null,
      })
      .returning();

    revalidatePath("/admin/users");
    return user;
  });
}

/**
 * Get enhanced user by Stack Auth ID
 */
export async function getEnhancedUserByStackId(stackUserId: string) {
  return fetchWithDrizzle(async (db) => {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.stackUserId, stackUserId),
    });

    return user;
  });
}

/**
 * Get enhanced user by ID
 */
export async function getEnhancedUserById(userId: bigint) {
  return fetchWithDrizzle(async (db) => {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    return user;
  });
}

/**
 * Get all users in an organization
 */
export async function getUsersByOrganization(
  organizationId: bigint,
  filters?: {
    role?: UserRole;
    isActive?: boolean;
  }
) {
  return fetchWithDrizzle(async (db) => {
    const users = await db.query.users.findMany({
      where: (users, { eq, and }) => {
        const conditions = [eq(users.organizationId, organizationId)];

        if (filters?.role) {
          conditions.push(eq(users.role, filters.role));
        }

        if (filters?.isActive !== undefined) {
          conditions.push(eq(users.isActive, filters.isActive));
        }

        return and(...conditions);
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    return users;
  });
}

/**
 * Get students in a class
 */
export async function getStudentsByClass(classId: bigint) {
  return fetchWithDrizzle(async (db) => {
    // Get active enrollments
    const enrollments = await db.query.classEnrollments.findMany({
      where: and(
        eq(schema.classEnrollments.classId, classId),
        eq(schema.classEnrollments.status, "active")
      ),
    });

    if (enrollments.length === 0) {
      return [];
    }

    const studentIds = enrollments.map((e) => e.studentId);

    // Get student details
    const students = await db.query.users.findMany({
      where: and(inArray(schema.users.id, studentIds), eq(schema.users.isActive, true)),
    });

    return students;
  });
}

/**
 * Get teachers for a class
 */
export async function getTeachersByClass(classId: bigint) {
  return fetchWithDrizzle(async (db) => {
    const classTeachers = await db.query.classTeachers.findMany({
      where: eq(schema.classTeachers.classId, classId),
    });

    if (classTeachers.length === 0) {
      return [];
    }

    const teacherIds = classTeachers.map((ct) => ct.teacherId);

    const teachers = await db.query.users.findMany({
      where: and(inArray(schema.users.id, teacherIds), eq(schema.users.isActive, true)),
    });

    return teachers.map((teacher) => {
      const classTeacher = classTeachers.find((ct) => ct.teacherId === teacher.id);
      return {
        ...teacher,
        classRole: classTeacher?.role || "primary_teacher",
      };
    });
  });
}

/**
 * Update user role
 */
export async function updateUserRole(userId: bigint, role: UserRole) {
  return fetchWithDrizzle(async (db) => {
    const [updated] = await db
      .update(schema.users)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId))
      .returning();

    revalidatePath("/admin/users");
    return updated;
  });
}

/**
 * Deactivate user (soft delete)
 */
export async function deactivateUser(userId: bigint) {
  return fetchWithDrizzle(async (db) => {
    const [updated] = await db
      .update(schema.users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId))
      .returning();

    revalidatePath("/admin/users");
    return updated;
  });
}

/**
 * Reactivate user
 */
export async function reactivateUser(userId: bigint) {
  return fetchWithDrizzle(async (db) => {
    const [updated] = await db
      .update(schema.users)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId))
      .returning();

    revalidatePath("/admin/users");
    return updated;
  });
}

/**
 * Get user's classes (for teachers)
 */
export async function getTeacherClasses(teacherId: bigint) {
  return fetchWithDrizzle(async (db) => {
    // Get classes where user is primary teacher
    const primaryClasses = await db.query.classes.findMany({
      where: and(eq(schema.classes.teacherId, teacherId), eq(schema.classes.isActive, true)),
    });

    // Get classes where user is assigned teacher
    const classTeacherAssignments = await db.query.classTeachers.findMany({
      where: eq(schema.classTeachers.teacherId, teacherId),
    });

    const assignedClassIds = classTeacherAssignments.map((ct) => ct.classId);

    const assignedClasses =
      assignedClassIds.length > 0
        ? await db.query.classes.findMany({
            where: and(
              inArray(schema.classes.id, assignedClassIds),
              eq(schema.classes.isActive, true)
            ),
          })
        : [];

    // Combine and deduplicate
    const allClasses = [...primaryClasses];
    for (const assignedClass of assignedClasses) {
      if (!allClasses.find((c) => c.id === assignedClass.id)) {
        allClasses.push(assignedClass);
      }
    }

    return allClasses;
  });
}

/**
 * Get user's enrolled classes (for students)
 */
export async function getStudentClasses(studentId: bigint) {
  return fetchWithDrizzle(async (db) => {
    const enrollments = await db.query.classEnrollments.findMany({
      where: and(
        eq(schema.classEnrollments.studentId, studentId),
        eq(schema.classEnrollments.status, "active")
      ),
    });

    if (enrollments.length === 0) {
      return [];
    }

    const classIds = enrollments.map((e) => e.classId);

    const classes = await db.query.classes.findMany({
      where: and(inArray(schema.classes.id, classIds), eq(schema.classes.isActive, true)),
    });

    return classes;
  });
}

/**
 * Get user's children (for parents)
 */
export async function getParentChildren(parentId: bigint) {
  return fetchWithDrizzle(async (db) => {
    const relationships = await db.query.parentStudentRelationships.findMany({
      where: eq(schema.parentStudentRelationships.parentId, parentId),
    });

    if (relationships.length === 0) {
      return [];
    }

    const studentIds = relationships.map((r) => r.studentId);

    const students = await db.query.users.findMany({
      where: and(inArray(schema.users.id, studentIds), eq(schema.users.isActive, true)),
    });

    return students.map((student) => {
      const relationship = relationships.find((r) => r.studentId === student.id);
      return {
        ...student,
        relationshipType: relationship?.relationshipType || "parent",
        isPrimary: relationship?.isPrimary || false,
      };
    });
  });
}
