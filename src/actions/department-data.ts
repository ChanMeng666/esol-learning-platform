"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, inArray, sql, gte, desc } from "drizzle-orm";

/**
 * Department-level Server Actions
 * Provides aggregated data for department head dashboard
 */

/**
 * Get department statistics (teachers, students, classes, average performance)
 * @param departmentId - Department ID (optional, uses current user's department if not provided)
 */
export async function getDepartmentStats(departmentId?: bigint) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a department head
    if (enhancedUser.role !== "department_head") {
      throw new Error("Access denied: Department head role required");
    }

    // Use provided departmentId or get from user's department
    let targetDepartmentId = departmentId;

    if (!targetDepartmentId) {
      // Get user's department
      const department = await db.query.departments.findFirst({
        where: and(
          eq(schema.departments.headTeacherId, enhancedUser.id),
          eq(schema.departments.organizationId, organizationId)
        ),
      });

      if (!department) {
        throw new Error("Department not found for current user");
      }

      targetDepartmentId = department.id;
    }

    // Get all classes in this department
    const departmentClasses = await db.query.classes.findMany({
      where: and(
        eq(schema.classes.departmentId, targetDepartmentId),
        eq(schema.classes.organizationId, organizationId),
        eq(schema.classes.isActive, true)
      ),
    });

    const totalClasses = departmentClasses.length;

    if (totalClasses === 0) {
      return {
        totalTeachers: 0,
        totalStudents: 0,
        totalClasses: 0,
        averagePerformance: 0,
      };
    }

    const classIds = departmentClasses.map((c) => c.id);

    // Get all teachers in these classes
    const primaryTeachers = departmentClasses.map((c) => c.teacherId).filter(Boolean);
    const assistantTeachers = await db.query.classTeachers.findMany({
      where: inArray(schema.classTeachers.classId, classIds),
    });

    const allTeacherIds = [
      ...primaryTeachers,
      ...assistantTeachers.map((at) => at.teacherId),
    ];
    const uniqueTeacherIds = Array.from(new Set(allTeacherIds));
    const totalTeachers = uniqueTeacherIds.length;

    // Get all students in these classes
    const enrollments = await db.query.classEnrollments.findMany({
      where: and(
        inArray(schema.classEnrollments.classId, classIds),
        eq(schema.classEnrollments.status, "active")
      ),
    });

    const uniqueStudentIds = Array.from(
      new Set(enrollments.map((e) => e.studentId))
    );
    const totalStudents = uniqueStudentIds.length;

    // Calculate average performance from student progress
    let averagePerformance = 0;
    if (uniqueStudentIds.length > 0) {
      const studentProgress = await db.query.userProgress.findMany({
        where: and(
          inArray(
            schema.userProgress.userId,
            uniqueStudentIds.map((id) => id.toString())
          ),
          eq(schema.userProgress.organizationId, organizationId)
        ),
      });

      if (studentProgress.length > 0) {
        const totalScore = studentProgress.reduce((sum, progress) => {
          const skillAverage =
            (progress.listeningProgress +
              progress.speakingProgress +
              progress.readingProgress +
              progress.writingProgress) /
            4;
          return sum + skillAverage;
        }, 0);

        averagePerformance = Math.round(totalScore / studentProgress.length);
      }
    }

    return {
      totalTeachers,
      totalStudents,
      totalClasses,
      averagePerformance,
    };
  });
}

/**
 * Get all classes in a department
 * @param departmentId - Department ID (optional, uses current user's department if not provided)
 */
export async function getDepartmentClasses(departmentId?: bigint) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a department head
    if (enhancedUser.role !== "department_head") {
      throw new Error("Access denied: Department head role required");
    }

    // Use provided departmentId or get from user's department
    let targetDepartmentId = departmentId;

    if (!targetDepartmentId) {
      // Get user's department
      const department = await db.query.departments.findFirst({
        where: and(
          eq(schema.departments.headTeacherId, enhancedUser.id),
          eq(schema.departments.organizationId, organizationId)
        ),
      });

      if (!department) {
        throw new Error("Department not found for current user");
      }

      targetDepartmentId = department.id;
    }

    // Get all classes in this department
    const departmentClasses = await db.query.classes.findMany({
      where: and(
        eq(schema.classes.departmentId, targetDepartmentId),
        eq(schema.classes.organizationId, organizationId)
      ),
      orderBy: [desc(schema.classes.createdAt)],
    });

    // Get student counts and teacher info for each class
    const classesWithDetails = await Promise.all(
      departmentClasses.map(async (cls) => {
        // Get student count
        const enrollments = await db.query.classEnrollments.findMany({
          where: and(
            eq(schema.classEnrollments.classId, cls.id),
            eq(schema.classEnrollments.status, "active")
          ),
        });

        // Get primary teacher info
        let teacherName = "Unassigned";
        if (cls.teacherId) {
          const teacher = await db.query.users.findFirst({
            where: eq(schema.users.id, cls.teacherId),
          });
          teacherName = teacher?.fullName || "Unknown";
        }

        return {
          ...cls,
          studentCount: enrollments.length,
          teacherName,
          status: cls.isActive ? "active" : "inactive",
        };
      })
    );

    return classesWithDetails;
  });
}

/**
 * Get all students in a department (through class enrollments)
 * @param departmentId - Department ID (optional, uses current user's department if not provided)
 */
export async function getDepartmentStudents(departmentId?: bigint) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a department head
    if (enhancedUser.role !== "department_head") {
      throw new Error("Access denied: Department head role required");
    }

    // Use provided departmentId or get from user's department
    let targetDepartmentId = departmentId;

    if (!targetDepartmentId) {
      // Get user's department
      const department = await db.query.departments.findFirst({
        where: and(
          eq(schema.departments.headTeacherId, enhancedUser.id),
          eq(schema.departments.organizationId, organizationId)
        ),
      });

      if (!department) {
        throw new Error("Department not found for current user");
      }

      targetDepartmentId = department.id;
    }

    // Get all classes in this department
    const departmentClasses = await db.query.classes.findMany({
      where: and(
        eq(schema.classes.departmentId, targetDepartmentId),
        eq(schema.classes.organizationId, organizationId)
      ),
    });

    if (departmentClasses.length === 0) {
      return [];
    }

    const classIds = departmentClasses.map((c) => c.id);

    // Get all enrollments for these classes
    const enrollments = await db.query.classEnrollments.findMany({
      where: inArray(schema.classEnrollments.classId, classIds),
    });

    // Get unique student IDs
    const uniqueStudentIds = Array.from(
      new Set(enrollments.map((e) => e.studentId))
    );

    if (uniqueStudentIds.length === 0) {
      return [];
    }

    // Get student details
    const students = await db.query.users.findMany({
      where: and(
        inArray(schema.users.id, uniqueStudentIds),
        eq(schema.users.organizationId, organizationId),
        eq(schema.users.role, "student")
      ),
    });

    // Get progress data for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        // Get NZCEL progress
        const nzcelProgress = await db.query.userProgress.findFirst({
          where: and(
            eq(schema.userProgress.userId, student.id.toString()),
            eq(schema.userProgress.organizationId, organizationId)
          ),
        });

        // Get CEFR progress
        const cefrProgress = await db.query.cefrProgress.findFirst({
          where: and(
            eq(schema.cefrProgress.userId, student.id.toString()),
            eq(schema.cefrProgress.organizationId, organizationId)
          ),
        });

        // Get student's class(es)
        const studentEnrollments = enrollments.filter(
          (e) => e.studentId === student.id
        );
        const studentClasses = departmentClasses.filter((c) =>
          studentEnrollments.some((e) => e.classId === c.id)
        );

        // Calculate average progress
        let averageProgress = 0;
        if (nzcelProgress) {
          averageProgress =
            (nzcelProgress.listeningProgress +
              nzcelProgress.speakingProgress +
              nzcelProgress.readingProgress +
              nzcelProgress.writingProgress) /
            4;
        }

        // Determine if student is at risk (progress < 60%)
        const isAtRisk = averageProgress < 60;

        return {
          ...student,
          className: studentClasses.map((c) => c.name).join(", ") || "No class",
          averageProgress: Math.round(averageProgress),
          totalPoints: nzcelProgress?.totalPoints || 0,
          questionsCompleted: nzcelProgress?.questionsCompleted || 0,
          currentLevel: nzcelProgress?.currentLevel || "foundation",
          cefrLevel: cefrProgress?.currentLevel || "A1",
          status: student.isActive ? "active" : "inactive",
          isAtRisk,
        };
      })
    );

    return studentsWithProgress;
  });
}

/**
 * Get all teachers in a department
 * @param departmentId - Department ID (optional, uses current user's department if not provided)
 */
export async function getDepartmentTeachers(departmentId?: bigint) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a department head
    if (enhancedUser.role !== "department_head") {
      throw new Error("Access denied: Department head role required");
    }

    // Use provided departmentId or get from user's department
    let targetDepartmentId = departmentId;

    if (!targetDepartmentId) {
      // Get user's department
      const department = await db.query.departments.findFirst({
        where: and(
          eq(schema.departments.headTeacherId, enhancedUser.id),
          eq(schema.departments.organizationId, organizationId)
        ),
      });

      if (!department) {
        throw new Error("Department not found for current user");
      }

      targetDepartmentId = department.id;
    }

    // Get all classes in this department
    const departmentClasses = await db.query.classes.findMany({
      where: and(
        eq(schema.classes.departmentId, targetDepartmentId),
        eq(schema.classes.organizationId, organizationId)
      ),
    });

    if (departmentClasses.length === 0) {
      return [];
    }

    const classIds = departmentClasses.map((c) => c.id);

    // Get primary teachers
    const primaryTeacherIds = departmentClasses
      .map((c) => c.teacherId)
      .filter(Boolean);

    // Get assistant teachers
    const assistantTeachers = await db.query.classTeachers.findMany({
      where: inArray(schema.classTeachers.classId, classIds),
    });

    const assistantTeacherIds = assistantTeachers.map((at) => at.teacherId);

    // Combine and deduplicate teacher IDs
    const allTeacherIds = Array.from(
      new Set([...primaryTeacherIds, ...assistantTeacherIds])
    );

    if (allTeacherIds.length === 0) {
      return [];
    }

    // Get teacher details
    const teachers = await db.query.users.findMany({
      where: and(
        inArray(schema.users.id, allTeacherIds),
        eq(schema.users.organizationId, organizationId),
        eq(schema.users.role, "teacher")
      ),
    });

    // Get class counts and student counts for each teacher
    const teachersWithDetails = await Promise.all(
      teachers.map(async (teacher) => {
        // Count classes where teacher is primary teacher
        const primaryClasses = departmentClasses.filter(
          (c) => c.teacherId === teacher.id
        );

        // Count classes where teacher is assistant
        const assistantClassIds = assistantTeachers
          .filter((at) => at.teacherId === teacher.id)
          .map((at) => at.classId);

        const totalClasses =
          primaryClasses.length +
          assistantClassIds.filter(
            (id) => !primaryClasses.some((c) => c.id === id)
          ).length;

        // Count total students across all classes
        const teacherClassIds = [
          ...primaryClasses.map((c) => c.id),
          ...assistantClassIds,
        ];

        const enrollments = await db.query.classEnrollments.findMany({
          where: and(
            inArray(schema.classEnrollments.classId, teacherClassIds),
            eq(schema.classEnrollments.status, "active")
          ),
        });

        const uniqueStudentCount = Array.from(
          new Set(enrollments.map((e) => e.studentId))
        ).length;

        return {
          ...teacher,
          classCount: totalClasses,
          studentCount: uniqueStudentCount,
          status: teacher.isActive ? "active" : "inactive",
        };
      })
    );

    return teachersWithDetails;
  });
}

/**
 * Get department recent activity (last 7 days)
 * Returns data for activity trend chart
 * @param departmentId - Department ID (optional, uses current user's department if not provided)
 */
export async function getDepartmentRecentActivity(departmentId?: bigint) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate user is a department head
    if (enhancedUser.role !== "department_head") {
      throw new Error("Access denied: Department head role required");
    }

    // Use provided departmentId or get from user's department
    let targetDepartmentId = departmentId;

    if (!targetDepartmentId) {
      // Get user's department
      const department = await db.query.departments.findFirst({
        where: and(
          eq(schema.departments.headTeacherId, enhancedUser.id),
          eq(schema.departments.organizationId, organizationId)
        ),
      });

      if (!department) {
        throw new Error("Department not found for current user");
      }

      targetDepartmentId = department.id;
    }

    // Get all students in department
    const students = await getDepartmentStudents(targetDepartmentId);
    const studentIds = students.map((s) => s.id.toString());

    if (studentIds.length === 0) {
      // Return empty activity data
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split("T")[0],
          questionsCompleted: 0,
          activeStudents: 0,
        };
      });
    }

    // Get last 7 days of activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get completed questions in last 7 days
    const completedQuestions = await db.query.completedQuestions.findMany({
      where: and(
        inArray(schema.completedQuestions.userId, studentIds),
        eq(schema.completedQuestions.organizationId, organizationId),
        gte(schema.completedQuestions.completedAt, sevenDaysAgo)
      ),
      orderBy: [desc(schema.completedQuestions.completedAt)],
    });

    // Group by date
    const activityByDate = new Map<string, { questions: number; students: Set<string> }>();

    completedQuestions.forEach((q) => {
      const dateStr = q.completedAt.toISOString().split("T")[0];
      if (!activityByDate.has(dateStr)) {
        activityByDate.set(dateStr, {
          questions: 0,
          students: new Set(),
        });
      }
      const activity = activityByDate.get(dateStr)!;
      activity.questions++;
      activity.students.add(q.userId);
    });

    // Generate data for last 7 days (including days with no activity)
    const activityData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split("T")[0];

      const activity = activityByDate.get(dateStr);

      return {
        date: dateStr,
        questionsCompleted: activity?.questions || 0,
        activeStudents: activity?.students.size || 0,
      };
    });

    return activityData;
  });
}
