/**
 * Data Migration Script: Single-Tenant to Multi-Tenant
 *
 * This script migrates existing data to the new multi-tenant architecture:
 * 1. Creates default system organization
 * 2. Migrates existing Stack Auth users to enhanced users table
 * 3. Updates all existing records with organization_id
 *
 * IMPORTANT: Run this AFTER pushing the new schema to the database
 *
 * Usage:
 * npx tsx src/scripts/migrate-to-multi-tenant.ts
 */

// Load environment variables from .env.local
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";
import { eq, isNull } from "drizzle-orm";

// Environment check
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  console.log("🚀 Starting multi-tenant migration...\n");

  try {
    // Step 1: Create default organization
    console.log("Step 1: Creating default organization...");
    let defaultOrg = await db.query.organizations.findFirst({
      where: eq(schema.organizations.slug, "default-system-org"),
    });

    if (!defaultOrg) {
      [defaultOrg] = await db
        .insert(schema.organizations)
        .values({
          name: "Default System Organization",
          slug: "default-system-org",
          settings: {
            allowed_level_systems: ["nzcel", "cefr"],
            use_shared_question_bank: true,
            features_enabled: {
              diagnostic_tests: true,
              assignments: true,
              parent_access: true,
            },
          },
          subscriptionTier: "enterprise",
          maxStudents: null,
          isActive: true,
        })
        .returning();

      console.log(`✅ Created default organization (ID: ${defaultOrg.id})`);
    } else {
      console.log(`✅ Default organization already exists (ID: ${defaultOrg.id})`);
    }

    const defaultOrgId = defaultOrg.id;

    // Step 2: Migrate existing user_progress records to users table
    console.log("\nStep 2: Migrating users to enhanced users table...");

    const existingUserProgress = await db.query.userProgress.findMany();
    console.log(`Found ${existingUserProgress.length} existing user progress records`);

    let migratedUsers = 0;
    let skippedUsers = 0;

    for (const progress of existingUserProgress) {
      // Check if user already exists in enhanced users table
      const existingUser = await db.query.users.findFirst({
        where: eq(schema.users.stackUserId, progress.userId),
      });

      if (existingUser) {
        skippedUsers++;
        continue;
      }

      // Create enhanced user record
      // Note: We use Stack Auth user ID as stackUserId, assign default role as 'student'
      await db.insert(schema.users).values({
        organizationId: defaultOrgId,
        stackUserId: progress.userId,
        email: `migrated-${progress.userId}@temp.email`, // Placeholder - should be updated
        fullName: `User ${progress.userId}`, // Placeholder - should be updated
        role: "student", // Default role - should be updated based on actual role
        isActive: true,
        metadata: {
          migrated: true,
          migration_date: new Date().toISOString(),
          original_user_id: progress.userId,
        },
      });

      migratedUsers++;
    }

    console.log(`✅ Migrated ${migratedUsers} users, skipped ${skippedUsers} existing users`);

    // Step 3: Update all existing tables with organization_id
    console.log("\nStep 3: Updating existing records with organization_id...");

    const updates = [
      { table: schema.userProgress, name: "User Progress" },
      { table: schema.completedQuestions, name: "Completed Questions" },
      { table: schema.badges, name: "Badges" },
      { table: schema.achievements, name: "Achievements" },
      { table: schema.cefrProgress, name: "CEFR Progress" },
      { table: schema.moduleProgress, name: "Module Progress" },
      { table: schema.copilotConversations, name: "Copilot Conversations" },
      { table: schema.copilotMessages, name: "Copilot Messages" },
      { table: schema.audioFiles, name: "Audio Files" },
      { table: schema.questionAudioCache, name: "Question Audio Cache" },
      { table: schema.userRecordings, name: "User Recordings" },
      { table: schema.transcriptions, name: "Transcriptions" },
      { table: schema.practiceSessions, name: "Practice Sessions" },
      { table: schema.sessionAnswers, name: "Session Answers" },
      { table: schema.conversationSessions, name: "Conversation Sessions" },
      { table: schema.conversationTurns, name: "Conversation Turns" },
    ];

    for (const { table, name } of updates) {
      try {
        // Update records with null organization_id
        const result = await db
          .update(table)
          .set({ organizationId: defaultOrgId })
          .where(isNull(table.organizationId));

        const rowCount = result.rowCount || 0;
        console.log(`✅ Updated ${rowCount} ${name} records`);
      } catch (error) {
        console.error(`❌ Error updating ${name}:`, error);
      }
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log("\n⚠️  IMPORTANT: Please review migrated users and update:");
    console.log("   - Email addresses (currently placeholders)");
    console.log("   - Full names (currently placeholders)");
    console.log("   - User roles (currently all set to 'student')");

  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
main()
  .then(() => {
    console.log("\n✅ Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
