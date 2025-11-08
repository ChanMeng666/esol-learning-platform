"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, gt, sql, desc } from "drizzle-orm";
import type { TodoItem } from "@/types";

/**
 * Get Student Todo Items for Dashboard
 *
 * Fetches actionable todo items from three sources:
 * 1. Incomplete assignments (due soon)
 * 2. Achievements nearly complete (progress > 80%)
 * 3. Recommended practice based on diagnostic results
 *
 * Multi-tenant: Automatically scoped to user's organization
 *
 * @returns Array of TodoItem objects sorted by priority
 *
 * @example
 * ```typescript
 * const todos = await getStudentTodoItems();
 * // Returns:
 * // [
 * //   { type: "assignment", title: "Complete Speaking Task", priority: "high", dueDate: ... },
 * //   { type: "achievement", title: "10-Day Streak", priority: "medium", progress: 85 },
 * //   { type: "recommendation", title: "Practice Listening", priority: "low" }
 * // ]
 * ```
 */
export async function getStudentTodoItems(): Promise<TodoItem[]> {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Get enhanced user to get student ID
    const enhancedUser = await db.query.users.findFirst({
      where: and(
        eq(schema.users.stackUserId, userId),
        eq(schema.users.organizationId, organizationId)
      ),
    });

    if (!enhancedUser) {
      throw new Error("User not found");
    }

    const studentId = enhancedUser.id;
    const todos: TodoItem[] = [];

    // 1. Fetch incomplete assignments
    try {
      const assignments = await db.query.assignmentStudentStatus.findMany({
        where: and(
          eq(schema.assignmentStudentStatus.studentId, studentId),
          sql`${schema.assignmentStudentStatus.status} IN ('assigned', 'in_progress', 'overdue')`
        ),
        with: {
          assignment: true,
        },
        orderBy: [desc(schema.assignmentStudentStatus.assignedAt)],
        limit: 5,
      });

      for (const assignmentStatus of assignments) {
        const assignment = assignmentStatus.assignment;
        if (!assignment) continue;

        const now = new Date();
        const dueDate = assignment.dueDate;
        let priority: "high" | "medium" | "low" = "low";

        // Calculate priority based on due date
        if (dueDate) {
          const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
          if (hoursUntilDue < 24) {
            priority = "high";
          } else if (hoursUntilDue < 72) {
            priority = "medium";
          }
        }

        // Mark overdue as high priority
        if (assignmentStatus.status === "overdue") {
          priority = "high";
        }

        todos.push({
          id: `assignment-${assignment.id}`,
          type: "assignment",
          title: assignment.title,
          description: assignment.description || `Complete ${assignment.assignmentType} assignment`,
          priority,
          dueDate: dueDate || undefined,
          progress: assignmentStatus.progressPercentage,
          actionUrl: `/student/assignments/${assignment.id}`,
          metadata: {
            assignmentId: assignment.id,
            skillType: assignment.targetSkill || undefined,
            level: assignment.targetLevel || undefined,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }

    // 2. Fetch nearly-complete achievements (progress > 80%)
    try {
      const userProgress = await db.query.userProgress.findFirst({
        where: and(
          eq(schema.userProgress.userId, userId),
          eq(schema.userProgress.organizationId, organizationId)
        ),
      });

      if (userProgress) {
        // Check existing achievements
        const achievements = await db.query.achievements.findMany({
          where: and(
            eq(schema.achievements.userId, userId),
            eq(schema.achievements.organizationId, organizationId),
            eq(schema.achievements.isCompleted, false),
            gt(schema.achievements.currentProgress, 80)
          ),
          orderBy: [desc(schema.achievements.currentProgress)],
          limit: 3,
        });

        for (const achievement of achievements) {
          const progressPercent = (achievement.currentProgress / achievement.targetValue) * 100;

          todos.push({
            id: `achievement-${achievement.id}`,
            type: "achievement",
            title: `Almost there: ${achievement.title}`,
            description: achievement.description || `You're ${Math.round(progressPercent)}% of the way!`,
            priority: progressPercent > 95 ? "medium" : "low",
            progress: Math.round(progressPercent),
            actionUrl: "/student/achievements",
            metadata: {
              achievementId: String(achievement.id),
            },
          });
        }
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }

    // 3. Fetch diagnostic-based recommendations
    try {
      const latestDiagnostic = await db.query.studentDiagnosticResults.findFirst({
        where: and(
          eq(schema.studentDiagnosticResults.studentId, studentId),
          eq(schema.studentDiagnosticResults.organizationId, organizationId)
        ),
        orderBy: [desc(schema.studentDiagnosticResults.completedAt)],
      });

      if (latestDiagnostic && latestDiagnostic.areasForImprovement.length > 0) {
        // Create recommendation for the top area of improvement
        const topArea = latestDiagnostic.areasForImprovement[0];
        const skillMatch = topArea.match(/(listening|speaking|reading|writing)/i);
        const skill = skillMatch ? skillMatch[1].toLowerCase() : null;

        todos.push({
          id: `recommendation-${latestDiagnostic.id}`,
          type: "recommendation",
          title: "Recommended Practice",
          description: topArea,
          priority: "low",
          actionUrl: skill
            ? `/practice/general?skill=${skill}&level=${latestDiagnostic.overallLevel}`
            : "/practice/general",
          metadata: {
            skillType: skill as any,
            level: latestDiagnostic.overallLevel,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching diagnostic recommendations:", error);
    }

    // Sort by priority (high > medium > low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return todos;
  });
}
