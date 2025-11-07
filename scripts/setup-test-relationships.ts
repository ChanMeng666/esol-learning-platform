/**
 * Script to set up relationships between test accounts:
 * - Link student@test.com with parent@test.com (parent-student relationship)
 * - Link student@test.com with teacher@test.com (via class enrollment)
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function setupTestRelationships() {
  console.log("🔧 Setting up test account relationships...\n");

  try {
    // 1. Find the test users
    console.log("📋 Finding test users...");

    const student = await db.query.users.findFirst({
      where: eq(schema.users.email, "student@test.com"),
    });

    const parent = await db.query.users.findFirst({
      where: eq(schema.users.email, "parent@test.com"),
    });

    const teacher = await db.query.users.findFirst({
      where: eq(schema.users.email, "teacher@test.com"),
    });

    if (!student) {
      throw new Error("❌ student@test.com not found");
    }
    if (!parent) {
      throw new Error("❌ parent@test.com not found");
    }
    if (!teacher) {
      throw new Error("❌ teacher@test.com not found");
    }

    console.log(`✅ Found student: ${student.email} (ID: ${student.id})`);
    console.log(`✅ Found parent: ${parent.email} (ID: ${parent.id})`);
    console.log(`✅ Found teacher: ${teacher.email} (ID: ${teacher.id})`);

    // Ensure they're all in the same organization
    if (
      student.organizationId !== parent.organizationId ||
      student.organizationId !== teacher.organizationId
    ) {
      throw new Error(
        "❌ All test users must be in the same organization"
      );
    }

    const organizationId = student.organizationId;
    console.log(`✅ All users in organization: ${organizationId}\n`);

    // 2. Create parent-student relationship
    console.log("👨‍👩‍👧 Setting up parent-student relationship...");

    // Check if relationship already exists
    const existingRelationship =
      await db.query.parentStudentRelationships.findFirst({
        where: and(
          eq(schema.parentStudentRelationships.parentId, parent.id),
          eq(schema.parentStudentRelationships.studentId, student.id)
        ),
      });

    if (existingRelationship) {
      console.log(
        `ℹ️  Parent-student relationship already exists (ID: ${existingRelationship.id})`
      );
    } else {
      const [relationship] = await db
        .insert(schema.parentStudentRelationships)
        .values({
          parentId: parent.id,
          studentId: student.id,
          relationshipType: "parent",
          isPrimary: true,
        })
        .returning();

      console.log(
        `✅ Created parent-student relationship (ID: ${relationship.id})`
      );
    }

    // 3. Create or find a class taught by the teacher
    console.log("\n📚 Setting up teacher-student relationship via class...");

    let teacherClass = await db.query.classes.findFirst({
      where: and(
        eq(schema.classes.teacherId, teacher.id),
        eq(schema.classes.organizationId, organizationId),
        eq(schema.classes.isActive, true)
      ),
    });

    if (!teacherClass) {
      console.log("📝 Creating new class for teacher...");
      const [newClass] = await db
        .insert(schema.classes)
        .values({
          organizationId,
          teacherId: teacher.id,
          name: "English Practice Class",
          academicYear: "2024-2025",
          isActive: true,
        })
        .returning();

      teacherClass = newClass;
      console.log(`✅ Created class: ${teacherClass.name} (ID: ${teacherClass.id})`);
    } else {
      console.log(
        `ℹ️  Found existing class: ${teacherClass.name} (ID: ${teacherClass.id})`
      );
    }

    // 4. Enroll student in the class
    const existingEnrollment = await db.query.classEnrollments.findFirst({
      where: and(
        eq(schema.classEnrollments.classId, teacherClass.id),
        eq(schema.classEnrollments.studentId, student.id)
      ),
    });

    if (existingEnrollment) {
      console.log(
        `ℹ️  Student already enrolled in class (Status: ${existingEnrollment.status})`
      );

      // Update to active if not active
      if (existingEnrollment.status !== "active") {
        await db
          .update(schema.classEnrollments)
          .set({ status: "active" })
          .where(eq(schema.classEnrollments.id, existingEnrollment.id));
        console.log(`✅ Updated enrollment status to active`);
      }
    } else {
      const [enrollment] = await db
        .insert(schema.classEnrollments)
        .values({
          classId: teacherClass.id,
          studentId: student.id,
          status: "active",
        })
        .returning();

      console.log(`✅ Enrolled student in class (ID: ${enrollment.id})`);
    }

    console.log("\n🎉 All relationships set up successfully!");
    console.log("\n📊 Summary:");
    console.log(`   • Parent: ${parent.email}`);
    console.log(`   • Student: ${student.email}`);
    console.log(`   • Teacher: ${teacher.email}`);
    console.log(`   • Class: ${teacherClass.name}`);
    console.log(
      `\n✅ parent@test.com can now view student's speaking practice in parent dashboard`
    );
    console.log(
      `✅ teacher@test.com can now view student's speaking practice in teacher dashboard`
    );
  } catch (error) {
    console.error("\n❌ Error setting up relationships:", error);
    throw error;
  }
}

// Run the script
setupTestRelationships()
  .then(() => {
    console.log("\n✨ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error);
    process.exit(1);
  });
