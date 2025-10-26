"use server";

import { fetchWithDrizzleUnsafe } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { list, del } from "@vercel/blob";

/**
 * Delete all user audio files from Vercel Blob storage
 * @returns Number of files deleted
 */
async function deleteAllUserBlobFiles(): Promise<{
  deletedCount: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let deletedCount = 0;

  try {
    console.log("🗑️ Cleaning up Blob storage...");

    // Delete user recordings
    try {
      const { blobs: userRecordings } = await list({ prefix: "audio/user-recordings/" });
      console.log(`Found ${userRecordings.length} user recording files`);

      for (const blob of userRecordings) {
        try {
          await del(blob.url);
          deletedCount++;
        } catch (error) {
          errors.push(`Failed to delete ${blob.url}: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
    } catch (error) {
      errors.push(`Failed to list user recordings: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    // Delete AI responses
    try {
      const { blobs: aiResponses } = await list({ prefix: "audio/ai-responses/" });
      console.log(`Found ${aiResponses.length} AI response files`);

      for (const blob of aiResponses) {
        try {
          await del(blob.url);
          deletedCount++;
        } catch (error) {
          errors.push(`Failed to delete ${blob.url}: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
    } catch (error) {
      errors.push(`Failed to list AI responses: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    // Optional: Delete TTS cache (uncomment if you want to clear cache)
    // try {
    //   const { blobs: ttsCache } = await list({ prefix: "audio/tts-cache/" });
    //   console.log(`Found ${ttsCache.length} TTS cache files`);
    //
    //   for (const blob of ttsCache) {
    //     try {
    //       await del(blob.url);
    //       deletedCount++;
    //     } catch (error) {
    //       errors.push(`Failed to delete ${blob.url}: ${error instanceof Error ? error.message : "Unknown error"}`);
    //     }
    //   }
    // } catch (error) {
    //   errors.push(`Failed to list TTS cache: ${error instanceof Error ? error.message : "Unknown error"}`);
    // }

    console.log(`✅ Blob cleanup completed: ${deletedCount} files deleted, ${errors.length} errors`);

    return { deletedCount, errors };
  } catch (error) {
    console.error("❌ Failed to cleanup Blob storage:", error);
    return {
      deletedCount,
      errors: [...errors, `General Blob cleanup error: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}

/**
 * DANGER: Delete all user data from database and Blob storage
 *
 * This script will:
 * 1. Delete all user audio files from Vercel Blob storage
 * 2. Delete all user-related data (progress, sessions, recordings, etc.)
 * 3. Delete all class and assignment data
 * 4. Delete all diagnostic test attempts
 * 5. Delete all users from the database
 *
 * ⚠️ WARNING: This action is IRREVERSIBLE!
 * ⚠️ Organizations will be preserved
 * ⚠️ Question audio cache will be preserved
 * ⚠️ Stack Auth users must be deleted manually from Stack Auth dashboard
 *
 * @returns Statistics about deleted data
 */
export async function deleteAllUsers() {
  try {
    return await fetchWithDrizzleUnsafe(async (db) => {
      const deletedCounts: Record<string, number> = {};

      console.log("🗑️ Starting complete user data cleanup...");

      // Step 0: Delete Blob storage files FIRST
      console.log("Step 0: Deleting Blob storage files...");
      const blobCleanup = await deleteAllUserBlobFiles();
      deletedCounts.blobFiles = blobCleanup.deletedCount;

      // Step 1: Delete user learning progress and sessions
      console.log("Step 1: Deleting user progress and sessions...");

      deletedCounts.copilotMessages = (await db.delete(schema.copilotMessages)).rowCount ?? 0;
      deletedCounts.copilotConversations = (await db.delete(schema.copilotConversations)).rowCount ?? 0;

      deletedCounts.conversationTurns = (await db.delete(schema.conversationTurns)).rowCount ?? 0;
      deletedCounts.conversationSessions = (await db.delete(schema.conversationSessions)).rowCount ?? 0;

      deletedCounts.sessionAnswers = (await db.delete(schema.sessionAnswers)).rowCount ?? 0;
      deletedCounts.practiceSessions = (await db.delete(schema.practiceSessions)).rowCount ?? 0;

      deletedCounts.transcriptions = (await db.delete(schema.transcriptions)).rowCount ?? 0;
      deletedCounts.userRecordings = (await db.delete(schema.userRecordings)).rowCount ?? 0;

      deletedCounts.completedQuestions = (await db.delete(schema.completedQuestions)).rowCount ?? 0;
      deletedCounts.achievements = (await db.delete(schema.achievements)).rowCount ?? 0;
      deletedCounts.badges = (await db.delete(schema.badges)).rowCount ?? 0;

      deletedCounts.moduleProgress = (await db.delete(schema.moduleProgress)).rowCount ?? 0;
      deletedCounts.cefrProgress = (await db.delete(schema.cefrProgress)).rowCount ?? 0;
      deletedCounts.userProgress = (await db.delete(schema.userProgress)).rowCount ?? 0;

      // Step 2: Delete assignments and submissions
      console.log("Step 2: Deleting assignments and submissions...");

      deletedCounts.assignmentSubmissions = (await db.delete(schema.assignmentSubmissions)).rowCount ?? 0;
      deletedCounts.assignmentStudentStatus = (await db.delete(schema.assignmentStudentStatus)).rowCount ?? 0;
      deletedCounts.assignmentTargets = (await db.delete(schema.assignmentTargets)).rowCount ?? 0;
      deletedCounts.assignments = (await db.delete(schema.assignments)).rowCount ?? 0;

      // Step 3: Delete diagnostic test data
      console.log("Step 3: Deleting diagnostic test data...");

      deletedCounts.diagnosticQuestionResponses = (await db.delete(schema.diagnosticQuestionResponses)).rowCount ?? 0;
      deletedCounts.studentDiagnosticResults = (await db.delete(schema.studentDiagnosticResults)).rowCount ?? 0;
      deletedCounts.studentDiagnosticAttempts = (await db.delete(schema.studentDiagnosticAttempts)).rowCount ?? 0;

      // Step 4: Delete class-related data
      console.log("Step 4: Deleting class data...");

      deletedCounts.teacherInsights = (await db.delete(schema.teacherInsights)).rowCount ?? 0;
      deletedCounts.classAnalytics = (await db.delete(schema.classAnalytics)).rowCount ?? 0;
      deletedCounts.studentGroupMembers = (await db.delete(schema.studentGroupMembers)).rowCount ?? 0;
      deletedCounts.studentGroups = (await db.delete(schema.studentGroups)).rowCount ?? 0;
      deletedCounts.classEnrollments = (await db.delete(schema.classEnrollments)).rowCount ?? 0;
      deletedCounts.classTeachers = (await db.delete(schema.classTeachers)).rowCount ?? 0;
      deletedCounts.classes = (await db.delete(schema.classes)).rowCount ?? 0;

      // Step 5: Delete parent-student relationships
      console.log("Step 5: Deleting parent-student relationships...");

      deletedCounts.parentStudentRelationships = (await db.delete(schema.parentStudentRelationships)).rowCount ?? 0;

      // Step 6: Delete user permissions
      console.log("Step 6: Deleting user permissions...");

      deletedCounts.userPermissions = (await db.delete(schema.userPermissions)).rowCount ?? 0;

      // Step 7: Delete users (final step)
      console.log("Step 7: Deleting all users...");

      const allUsers = await db.query.users.findMany({
        columns: {
          id: true,
          stackUserId: true,
          email: true,
          fullName: true,
          role: true,
        },
      });

      deletedCounts.users = (await db.delete(schema.users)).rowCount ?? 0;

      console.log("✅ User data cleanup completed!");

      return {
        success: true,
        message: "All user data has been deleted successfully from database and Blob storage",
        deletedUsers: allUsers,
        deletedCounts,
        totalUsersDeleted: deletedCounts.users,
        blobCleanup: {
          filesDeleted: blobCleanup.deletedCount,
          errors: blobCleanup.errors,
        },
        warnings: [
          "⚠️ Stack Auth users must be deleted manually from Stack Auth dashboard",
          blobCleanup.errors.length > 0
            ? `⚠️ ${blobCleanup.errors.length} errors occurred during Blob cleanup`
            : null,
        ].filter(Boolean),
      };
    });
  } catch (error) {
    console.error("❌ Failed to delete user data:", error);
    throw new Error(
      `Failed to delete user data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get count of all users and related data
 * Safe diagnostic function to see what will be deleted
 */
export async function getUserDataCounts() {
  return await fetchWithDrizzleUnsafe(async (db) => {
    const counts: Record<string, number> = {};

    // Count all tables
    const tables = [
      { name: "users", table: schema.users },
      { name: "userProgress", table: schema.userProgress },
      { name: "cefrProgress", table: schema.cefrProgress },
      { name: "moduleProgress", table: schema.moduleProgress },
      { name: "completedQuestions", table: schema.completedQuestions },
      { name: "badges", table: schema.badges },
      { name: "achievements", table: schema.achievements },
      { name: "practiceSessions", table: schema.practiceSessions },
      { name: "sessionAnswers", table: schema.sessionAnswers },
      { name: "conversationSessions", table: schema.conversationSessions },
      { name: "conversationTurns", table: schema.conversationTurns },
      { name: "userRecordings", table: schema.userRecordings },
      { name: "transcriptions", table: schema.transcriptions },
      { name: "copilotConversations", table: schema.copilotConversations },
      { name: "copilotMessages", table: schema.copilotMessages },
      { name: "classes", table: schema.classes },
      { name: "classEnrollments", table: schema.classEnrollments },
      { name: "assignments", table: schema.assignments },
      { name: "assignmentSubmissions", table: schema.assignmentSubmissions },
    ];

    for (const { name, table } of tables) {
      const result = await db.select({ count: sql<number>`count(*)` }).from(table);
      counts[name] = Number(result[0]?.count ?? 0);
    }

    // Get user details
    const allUsers = await db.query.users.findMany({
      columns: {
        id: true,
        stackUserId: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    return {
      counts,
      users: allUsers,
      totalUsers: counts.users,
    };
  });
}

/**
 * Delete a single user and all their data
 * @param userId - The user ID to delete
 */
export async function deleteSingleUser(userId: bigint) {
  return await fetchWithDrizzleUnsafe(async (db) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    const deletedCounts: Record<string, number> = {};

    // Delete user data in correct order
    deletedCounts.copilotMessages = (
      await db.delete(schema.copilotMessages).where(sql`user_id = ${user.stackUserId}`)
    ).rowCount ?? 0;

    deletedCounts.copilotConversations = (
      await db.delete(schema.copilotConversations).where(sql`user_id = ${user.stackUserId}`)
    ).rowCount ?? 0;

    deletedCounts.conversationTurns = (
      await db.delete(schema.conversationTurns).where(sql`session_id IN (SELECT id FROM conversation_sessions WHERE user_id = ${user.stackUserId})`)
    ).rowCount ?? 0;

    deletedCounts.conversationSessions = (
      await db.delete(schema.conversationSessions).where(sql`user_id = ${user.stackUserId}`)
    ).rowCount ?? 0;

    deletedCounts.sessionAnswers = (
      await db.delete(schema.sessionAnswers).where(sql`session_id IN (SELECT id FROM practice_sessions WHERE user_id = ${user.stackUserId})`)
    ).rowCount ?? 0;

    deletedCounts.practiceSessions = (
      await db.delete(schema.practiceSessions).where(sql`user_id = ${user.stackUserId}`)
    ).rowCount ?? 0;

    deletedCounts.transcriptions = (
      await db.delete(schema.transcriptions).where(sql`user_id = ${user.stackUserId}`)
    ).rowCount ?? 0;

    deletedCounts.userRecordings = (
      await db.delete(schema.userRecordings).where(sql`user_id = ${user.stackUserId}`)
    ).rowCount ?? 0;

    deletedCounts.completedQuestions = (
      await db.delete(schema.completedQuestions).where(sql`user_id = ${user.stackUserId}`)
    ).rowCount ?? 0;

    deletedCounts.achievements = (
      await db.delete(schema.achievements).where(sql`user_id = ${user.stackUserId}`)
    ).rowCount ?? 0;

    deletedCounts.badges = (
      await db.delete(schema.badges).where(sql`user_id = ${user.stackUserId}`)
    ).rowCount ?? 0;

    deletedCounts.moduleProgress = (
      await db.delete(schema.moduleProgress).where(sql`user_id = ${userId}`)
    ).rowCount ?? 0;

    deletedCounts.cefrProgress = (
      await db.delete(schema.cefrProgress).where(sql`user_id = ${userId}`)
    ).rowCount ?? 0;

    deletedCounts.userProgress = (
      await db.delete(schema.userProgress).where(sql`user_id = ${userId}`)
    ).rowCount ?? 0;

    // Delete the user
    deletedCounts.users = (
      await db.delete(schema.users).where(sql`id = ${userId}`)
    ).rowCount ?? 0;

    return {
      success: true,
      deletedUser: user,
      deletedCounts,
    };
  });
}
