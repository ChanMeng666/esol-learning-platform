// Database diagnostic script
// Run with: node diagnose-db.js

import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function diagnose() {
  console.log("\n=== NZCEL Database Diagnostic ===\n");

  try {
    // Check practice_sessions table
    console.log("1. Checking practice_sessions table:");
    const sessions = await sql`SELECT id, user_id, skill, level, started_at FROM practice_sessions ORDER BY started_at DESC LIMIT 5`;
    console.log(`   Found ${sessions.length} sessions`);
    if (sessions.length > 0) {
      console.log("   Sample data:");
      sessions.forEach((s, i) => {
        console.log(`   ${i + 1}. User ID: ${s.user_id}, Skill: ${s.skill}, Level: ${s.level}, Date: ${s.started_at}`);
      });
    }

    // Check user_recordings table
    console.log("\n2. Checking user_recordings table:");
    const recordings = await sql`SELECT id, user_id, recording_type, recorded_at FROM user_recordings ORDER BY recorded_at DESC LIMIT 5`;
    console.log(`   Found ${recordings.length} recordings`);
    if (recordings.length > 0) {
      console.log("   Sample data:");
      recordings.forEach((r, i) => {
        console.log(`   ${i + 1}. User ID: ${r.user_id}, Type: ${r.recording_type}, Date: ${r.recorded_at}`);
      });
    }

    // Check conversation_sessions table
    console.log("\n3. Checking conversation_sessions table:");
    const conversations = await sql`SELECT id, user_id, scenario_title, started_at FROM conversation_sessions ORDER BY started_at DESC LIMIT 5`;
    console.log(`   Found ${conversations.length} conversations`);
    if (conversations.length > 0) {
      console.log("   Sample data:");
      conversations.forEach((c, i) => {
        console.log(`   ${i + 1}. User ID: ${c.user_id}, Scenario: ${c.scenario_title}, Date: ${c.started_at}`);
      });
    }

    // Check audio_files table
    console.log("\n4. Checking audio_files table:");
    const audioFiles = await sql`SELECT id, file_type, created_at FROM audio_files ORDER BY created_at DESC LIMIT 5`;
    console.log(`   Found ${audioFiles.length} audio files`);
    if (audioFiles.length > 0) {
      console.log("   Sample data:");
      audioFiles.forEach((a, i) => {
        console.log(`   ${i + 1}. Type: ${a.file_type}, Date: ${a.created_at}`);
      });
    }

    // Get unique user IDs
    console.log("\n5. Unique User IDs in database:");
    const userIds = await sql`
      SELECT DISTINCT user_id FROM practice_sessions
      UNION
      SELECT DISTINCT user_id FROM user_recordings
      UNION
      SELECT DISTINCT user_id FROM conversation_sessions
    `;
    console.log(`   Found ${userIds.length} unique user(s):`);
    userIds.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.user_id}`);
    });

    console.log("\n=== Diagnostic Complete ===\n");
    console.log("Next steps:");
    console.log("1. Make sure you are logged in to the app");
    console.log("2. Check that your current user ID matches one of the user IDs above");
    console.log("3. Look for console logs when you visit /practice History tab");

  } catch (error) {
    console.error("Error:", error);
  }

  process.exit(0);
}

diagnose();
