/**
 * Standalone script to cleanup all users
 * Run with: npx tsx scripts/cleanup-all-users.ts
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { list, del } from "@vercel/blob";
import * as schema from "../src/lib/db/schema";
import { sql } from "drizzle-orm";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

async function deleteAllUserBlobFiles(): Promise<{
  deletedCount: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let deletedCount = 0;

  try {
    console.log("🗑️  Cleaning up Blob storage...");

    // Delete user recordings
    try {
      const { blobs: userRecordings } = await list({ prefix: "audio/user-recordings/" });
      console.log(`   Found ${userRecordings.length} user recording files`);

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
      console.log(`   Found ${aiResponses.length} AI response files`);

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

    console.log(`   ✅ Blob cleanup: ${deletedCount} files deleted, ${errors.length} errors`);

    return { deletedCount, errors };
  } catch (error) {
    console.error("   ❌ Failed to cleanup Blob storage:", error);
    return {
      deletedCount,
      errors: [...errors, `General Blob cleanup error: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}

async function main() {
  console.log("\n🚨 ================================");
  console.log("🚨 USER DATA CLEANUP SCRIPT");
  console.log("🚨 ================================\n");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in environment");
    process.exit(1);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN not found in environment");
    process.exit(1);
  }

  const db = drizzle(neon(process.env.DATABASE_URL), { schema });
  const deletedCounts: Record<string, number> = {};

  try {
    console.log("🗑️  Starting complete user data cleanup...\n");

    // Step 0: Delete Blob storage files FIRST
    console.log("📦 Step 0: Deleting Blob storage files...");
    const blobCleanup = await deleteAllUserBlobFiles();
    deletedCounts.blobFiles = blobCleanup.deletedCount;
    console.log("");

    // Step 1: Delete user learning progress and sessions
    console.log("📚 Step 1: Deleting user progress and sessions...");

    deletedCounts.copilotMessages = (await db.delete(schema.copilotMessages)).rowCount ?? 0;
    console.log(`   - Copilot messages: ${deletedCounts.copilotMessages}`);

    deletedCounts.copilotConversations = (await db.delete(schema.copilotConversations)).rowCount ?? 0;
    console.log(`   - Copilot conversations: ${deletedCounts.copilotConversations}`);

    deletedCounts.conversationTurns = (await db.delete(schema.conversationTurns)).rowCount ?? 0;
    console.log(`   - Conversation turns: ${deletedCounts.conversationTurns}`);

    deletedCounts.conversationSessions = (await db.delete(schema.conversationSessions)).rowCount ?? 0;
    console.log(`   - Conversation sessions: ${deletedCounts.conversationSessions}`);

    deletedCounts.sessionAnswers = (await db.delete(schema.sessionAnswers)).rowCount ?? 0;
    console.log(`   - Session answers: ${deletedCounts.sessionAnswers}`);

    deletedCounts.practiceSessions = (await db.delete(schema.practiceSessions)).rowCount ?? 0;
    console.log(`   - Practice sessions: ${deletedCounts.practiceSessions}`);

    deletedCounts.transcriptions = (await db.delete(schema.transcriptions)).rowCount ?? 0;
    console.log(`   - Transcriptions: ${deletedCounts.transcriptions}`);

    deletedCounts.userRecordings = (await db.delete(schema.userRecordings)).rowCount ?? 0;
    console.log(`   - User recordings: ${deletedCounts.userRecordings}`);

    deletedCounts.completedQuestions = (await db.delete(schema.completedQuestions)).rowCount ?? 0;
    console.log(`   - Completed questions: ${deletedCounts.completedQuestions}`);

    deletedCounts.achievements = (await db.delete(schema.achievements)).rowCount ?? 0;
    console.log(`   - Achievements: ${deletedCounts.achievements}`);

    deletedCounts.badges = (await db.delete(schema.badges)).rowCount ?? 0;
    console.log(`   - Badges: ${deletedCounts.badges}`);

    deletedCounts.moduleProgress = (await db.delete(schema.moduleProgress)).rowCount ?? 0;
    console.log(`   - Module progress: ${deletedCounts.moduleProgress}`);

    deletedCounts.cefrProgress = (await db.delete(schema.cefrProgress)).rowCount ?? 0;
    console.log(`   - CEFR progress: ${deletedCounts.cefrProgress}`);

    deletedCounts.userProgress = (await db.delete(schema.userProgress)).rowCount ?? 0;
    console.log(`   - User progress: ${deletedCounts.userProgress}`);
    console.log("");

    // Step 2: Delete assignments and submissions
    console.log("📝 Step 2: Deleting assignments and submissions...");

    deletedCounts.assignmentSubmissions = (await db.delete(schema.assignmentSubmissions)).rowCount ?? 0;
    console.log(`   - Assignment submissions: ${deletedCounts.assignmentSubmissions}`);

    deletedCounts.assignmentStudentStatus = (await db.delete(schema.assignmentStudentStatus)).rowCount ?? 0;
    console.log(`   - Assignment student status: ${deletedCounts.assignmentStudentStatus}`);

    deletedCounts.assignmentTargets = (await db.delete(schema.assignmentTargets)).rowCount ?? 0;
    console.log(`   - Assignment targets: ${deletedCounts.assignmentTargets}`);

    deletedCounts.assignments = (await db.delete(schema.assignments)).rowCount ?? 0;
    console.log(`   - Assignments: ${deletedCounts.assignments}`);
    console.log("");

    // Step 3: Delete diagnostic test data
    console.log("🧪 Step 3: Deleting diagnostic test data...");

    deletedCounts.diagnosticQuestionResponses = (await db.delete(schema.diagnosticQuestionResponses)).rowCount ?? 0;
    console.log(`   - Diagnostic question responses: ${deletedCounts.diagnosticQuestionResponses}`);

    deletedCounts.studentDiagnosticResults = (await db.delete(schema.studentDiagnosticResults)).rowCount ?? 0;
    console.log(`   - Student diagnostic results: ${deletedCounts.studentDiagnosticResults}`);

    deletedCounts.studentDiagnosticAttempts = (await db.delete(schema.studentDiagnosticAttempts)).rowCount ?? 0;
    console.log(`   - Student diagnostic attempts: ${deletedCounts.studentDiagnosticAttempts}`);
    console.log("");

    // Step 4: Delete class-related data
    console.log("🏫 Step 4: Deleting class data...");

    deletedCounts.teacherInsights = (await db.delete(schema.teacherInsights)).rowCount ?? 0;
    console.log(`   - Teacher insights: ${deletedCounts.teacherInsights}`);

    deletedCounts.classAnalytics = (await db.delete(schema.classAnalytics)).rowCount ?? 0;
    console.log(`   - Class analytics: ${deletedCounts.classAnalytics}`);

    deletedCounts.studentGroupMembers = (await db.delete(schema.studentGroupMembers)).rowCount ?? 0;
    console.log(`   - Student group members: ${deletedCounts.studentGroupMembers}`);

    deletedCounts.studentGroups = (await db.delete(schema.studentGroups)).rowCount ?? 0;
    console.log(`   - Student groups: ${deletedCounts.studentGroups}`);

    deletedCounts.classEnrollments = (await db.delete(schema.classEnrollments)).rowCount ?? 0;
    console.log(`   - Class enrollments: ${deletedCounts.classEnrollments}`);

    deletedCounts.classTeachers = (await db.delete(schema.classTeachers)).rowCount ?? 0;
    console.log(`   - Class teachers: ${deletedCounts.classTeachers}`);

    deletedCounts.classes = (await db.delete(schema.classes)).rowCount ?? 0;
    console.log(`   - Classes: ${deletedCounts.classes}`);
    console.log("");

    // Step 5: Delete parent-student relationships
    console.log("👨‍👩‍👧 Step 5: Deleting parent-student relationships...");

    deletedCounts.parentStudentRelationships = (await db.delete(schema.parentStudentRelationships)).rowCount ?? 0;
    console.log(`   - Parent-student relationships: ${deletedCounts.parentStudentRelationships}`);
    console.log("");

    // Step 6: Delete user permissions
    console.log("🔒 Step 6: Deleting user permissions...");

    deletedCounts.userPermissions = (await db.delete(schema.userPermissions)).rowCount ?? 0;
    console.log(`   - User permissions: ${deletedCounts.userPermissions}`);
    console.log("");

    // Step 7: Get user list and delete users
    console.log("👥 Step 7: Deleting all users...");

    const allUsers = await db.query.users.findMany({
      columns: {
        id: true,
        stackUserId: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    console.log(`   Found ${allUsers.length} users to delete:`);
    allUsers.forEach((user) => {
      console.log(`   - ${user.email} (${user.role || 'NO ROLE'})`);
    });

    deletedCounts.users = (await db.delete(schema.users)).rowCount ?? 0;
    console.log(`   ✅ Deleted ${deletedCounts.users} users`);
    console.log("");

    // Summary
    console.log("✅ ================================");
    console.log("✅ CLEANUP COMPLETED SUCCESSFULLY");
    console.log("✅ ================================\n");

    console.log("📊 Summary:");
    console.log(`   - Blob files deleted: ${deletedCounts.blobFiles}`);
    console.log(`   - Database records deleted: ${Object.values(deletedCounts).reduce((a, b) => a + b, 0) - deletedCounts.blobFiles}`);
    console.log(`   - Total users deleted: ${deletedCounts.users}\n`);

    if (blobCleanup.errors.length > 0) {
      console.log("⚠️  Blob Cleanup Errors:");
      blobCleanup.errors.forEach((error) => {
        console.log(`   - ${error}`);
      });
      console.log("");
    }

    console.log("⚠️  NEXT STEPS:");
    console.log("   1. Delete users from Stack Auth dashboard: https://app.stack-auth.com");
    console.log("   2. Verify Blob storage cleanup: https://vercel.com/storage/blob");
    console.log("   3. Clear browser cache and cookies");
    console.log("   4. Test new user registration\n");

    console.log("Deleted users:");
    allUsers.forEach((user) => {
      console.log(`   - ${user.email} (Stack ID: ${user.stackUserId})`);
    });
    console.log("");

  } catch (error) {
    console.error("\n❌ ================================");
    console.error("❌ CLEANUP FAILED");
    console.error("❌ ================================\n");
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
