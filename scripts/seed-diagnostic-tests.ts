#!/usr/bin/env ts-node

/**
 * Seed Script for Diagnostic Tests
 * Populates the database with sample diagnostic tests
 *
 * Run with: npx ts-node scripts/seed-diagnostic-tests.ts
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";
import { sampleDiagnosticTests } from "../src/data/diagnostic-test-data";

// Database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("ERROR: DATABASE_URL environment variable is not set");
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function seedDiagnosticTests() {
  console.log("🌱 Starting diagnostic test seed...");

  try {
    // Seed each test
    for (const testData of sampleDiagnosticTests) {
      console.log(`\n📝 Creating test: ${testData.name}`);

      // Create diagnostic test
      const [test] = await db
        .insert(schema.diagnosticTests)
        .values({
          organizationId: null, // System-level test
          name: testData.name,
          description: testData.description,
          levelSystem: testData.levelSystem,
          testType: testData.testType,
          targetSkills: testData.targetSkills,
          estimatedDuration: testData.estimatedDuration,
          isActive: testData.isActive,
          isSystemTest: testData.isSystemTest,
          createdByUserId: null, // System-created
        })
        .returning();

      console.log(`   ✅ Test created with ID: ${test.id}`);

      // Create sections for this test
      for (const sectionData of testData.sections) {
        console.log(`   📑 Creating section: ${sectionData.sectionName}`);

        const [section] = await db
          .insert(schema.diagnosticTestSections)
          .values({
            diagnosticTestId: test.id,
            skillType: sectionData.skillType,
            sectionName: sectionData.sectionName,
            levelRangeMin: sectionData.levelRangeMin,
            levelRangeMax: sectionData.levelRangeMax,
            totalQuestions: sectionData.totalQuestions,
            passingThreshold: sectionData.passingThreshold,
            orderIndex: sectionData.orderIndex,
            instructions: sectionData.instructions,
          })
          .returning();

        console.log(`      ✅ Section created with ID: ${section.id}`);

        // Create questions for this section
        for (const questionData of sectionData.questions) {
          await db.insert(schema.diagnosticTestQuestions).values({
            testSectionId: section.id,
            questionType: questionData.questionType,
            questionText: questionData.questionText,
            options: questionData.options || null,
            correctAnswer: questionData.correctAnswer || null,
            difficultyLevel: questionData.difficultyLevel,
            points: questionData.points,
            rubric: questionData.rubric || null,
            audioUrl: null, // To be added later
            imageUrl: null,
            orderIndex: questionData.orderIndex,
            metadata: null,
          });
        }

        console.log(
          `      ✅ ${sectionData.questions.length} questions created`
        );
      }

      console.log(`✅ Test "${testData.name}" fully seeded\n`);
    }

    console.log("🎉 All diagnostic tests seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding diagnostic tests:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the seed function
seedDiagnosticTests()
  .then(() => {
    console.log("\n✅ Seed completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  });
