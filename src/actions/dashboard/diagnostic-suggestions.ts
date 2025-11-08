"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type {
  DiagnosticSuggestion,
  DiagnosticRecommendation,
  SkillType,
} from "@/types";

/**
 * Get Diagnostic Suggestions for Student Dashboard
 *
 * Fetches the latest diagnostic test results and generates personalized
 * learning recommendations based on strengths and areas for improvement.
 *
 * Multi-tenant: Automatically scoped to user's organization
 *
 * @returns DiagnosticSuggestion object or null if no diagnostic results found
 *
 * @example
 * ```typescript
 * const suggestions = await getDiagnosticSuggestions();
 * // Returns:
 * // {
 * //   currentLevel: "B1",
 * //   levelSystem: "cefr",
 * //   strengths: ["Good vocabulary", "Clear pronunciation"],
 * //   weaknesses: ["Grammar accuracy", "Complex sentences"],
 * //   recommendations: [
 * //     {
 * //       skill: "writing",
 * //       focus: "grammar",
 * //       description: "Practice conditional sentences at B1 level",
 * //       estimatedDuration: 20,
 * //       actionUrl: "/practice/general?skill=writing&level=B1"
 * //     }
 * //   ],
 * //   completedAt: Date(...),
 * //   nextAssessmentDue: Date(...)
 * // }
 * ```
 */
export async function getDiagnosticSuggestions(): Promise<DiagnosticSuggestion | null> {
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

    // Fetch latest diagnostic result
    const latestResult = await db.query.studentDiagnosticResults.findFirst({
      where: and(
        eq(schema.studentDiagnosticResults.studentId, studentId),
        eq(schema.studentDiagnosticResults.organizationId, organizationId)
      ),
      orderBy: [desc(schema.studentDiagnosticResults.completedAt)],
    });

    if (!latestResult) {
      return null;
    }

    // Generate recommendations based on areas for improvement
    const recommendations: DiagnosticRecommendation[] = [];

    // Parse skill levels to identify weak areas
    const skillLevels = latestResult.skillLevels as Record<string, string>;
    const skillScores = latestResult.skillScores as Record<string, number>;

    for (const area of latestResult.areasForImprovement) {
      // Extract skill type from the improvement area description
      const skillMatch = area.match(/(listening|speaking|reading|writing)/i);
      if (!skillMatch) continue;

      const skill = skillMatch[1].toLowerCase() as SkillType;
      const skillScore = skillScores[skill] || 0;

      // Determine focus area from the description
      let focus = "general";
      if (area.toLowerCase().includes("grammar")) {
        focus = "grammar";
      } else if (area.toLowerCase().includes("vocabulary")) {
        focus = "vocabulary";
      } else if (area.toLowerCase().includes("pronunciation")) {
        focus = "pronunciation";
      } else if (area.toLowerCase().includes("fluency")) {
        focus = "fluency";
      } else if (area.toLowerCase().includes("comprehension")) {
        focus = "comprehension";
      }

      // Generate action URL based on level system and skill
      const level = latestResult.overallLevel;
      const levelSystem = latestResult.levelSystem;
      let actionUrl = "/practice/general";

      if (levelSystem === "cefr") {
        actionUrl = `/practice/general?skill=${skill}&level=${level}`;
      } else if (levelSystem === "nzcel") {
        actionUrl = `/practice/nzcel/skills?skill=${skill}&level=${level}`;
      }

      // Estimate duration based on skill score (lower score = more time needed)
      const estimatedDuration = skillScore < 50 ? 30 : skillScore < 70 ? 20 : 15;

      recommendations.push({
        skill,
        focus,
        description: area,
        estimatedDuration,
        actionUrl,
      });
    }

    // Calculate next assessment due date (30 days after latest diagnostic)
    const nextAssessmentDue = new Date(latestResult.completedAt);
    nextAssessmentDue.setDate(nextAssessmentDue.getDate() + 30);

    return {
      currentLevel: latestResult.overallLevel,
      levelSystem: latestResult.levelSystem as "nzcel" | "cefr",
      strengths: latestResult.strengths,
      weaknesses: latestResult.areasForImprovement,
      recommendations,
      completedAt: latestResult.completedAt,
      nextAssessmentDue,
    };
  });
}

/**
 * Check if Student Has Completed Any Diagnostic Tests
 *
 * Quick check to determine if student has any diagnostic results.
 * Used to show "Take Diagnostic Test" prompt if no results exist.
 *
 * @returns boolean - true if student has completed at least one diagnostic test
 */
export async function hasCompletedDiagnostic(): Promise<boolean> {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const enhancedUser = await db.query.users.findFirst({
      where: and(
        eq(schema.users.stackUserId, userId),
        eq(schema.users.organizationId, organizationId)
      ),
    });

    if (!enhancedUser) {
      return false;
    }

    const studentId = enhancedUser.id;

    const result = await db.query.studentDiagnosticResults.findFirst({
      where: and(
        eq(schema.studentDiagnosticResults.studentId, studentId),
        eq(schema.studentDiagnosticResults.organizationId, organizationId)
      ),
    });

    return result !== undefined;
  });
}
