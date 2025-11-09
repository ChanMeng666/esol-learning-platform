"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Parent Dashboard Server Actions
 * Provides dashboard statistics for parent role
 */

/**
 * Get parent dashboard statistics
 * Returns core metrics: total children and speaking sessions count
 */
export async function getParentDashboardStats() {
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
        where: eq(schema.parentStudentRelationships.parentId, enhancedUser.id),
      });

      const totalChildren = relationships.length;

      if (totalChildren === 0) {
        return {
          totalChildren: 0,
          totalSpeakingSessions: 0,
        };
      }

      // Get all children's Stack Auth IDs
      const studentIds = relationships.map((r) => r.studentId);
      const children = await db.query.users.findMany({
        where: and(
          eq(schema.users.organizationId, organizationId),
          eq(schema.users.isActive, true)
        ),
      });

      const childrenStackAuthIds = children
        .filter((c) => studentIds.includes(c.id))
        .map((c) => c.stackUserId);

      // Count total speaking sessions across all children
      let totalSpeakingSessions = 0;

      for (const childStackAuthId of childrenStackAuthIds) {
        const sessions = await db.query.speakingSessions.findMany({
          where: and(
            eq(schema.speakingSessions.userId, childStackAuthId),
            eq(schema.speakingSessions.organizationId, organizationId)
          ),
        });
        totalSpeakingSessions += sessions.length;
      }

      return {
        totalChildren,
        totalSpeakingSessions,
      };
    } catch (error) {
      console.error("Failed to get parent dashboard stats:", error);
      throw new Error("Failed to load dashboard statistics");
    }
  });
}
