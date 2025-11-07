/**
 * Verify that the test relationships are set up correctly
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function verifyRelationships() {
  console.log("🔍 Verifying test account relationships...\n");

  try {
    // Find users
    const student = await db.query.users.findFirst({
      where: eq(schema.users.email, "student@test.com"),
    });

    const parent = await db.query.users.findFirst({
      where: eq(schema.users.email, "parent@test.com"),
    });

    const teacher = await db.query.users.findFirst({
      where: eq(schema.users.email, "teacher@test.com"),
    });

    if (!student || !parent || !teacher) {
      throw new Error("Test users not found");
    }

    // Check parent-student relationship
    console.log("👨‍👩‍👧 Parent-Student Relationship:");
    const parentRelationship =
      await db.query.parentStudentRelationships.findFirst({
        where: eq(schema.parentStudentRelationships.parentId, parent.id),
      });

    if (parentRelationship) {
      console.log(`   ✅ Relationship ID: ${parentRelationship.id}`);
      console.log(`   ✅ Type: ${parentRelationship.relationshipType}`);
      console.log(`   ✅ Primary: ${parentRelationship.isPrimary}`);
      console.log(`   ✅ Parent ID: ${parentRelationship.parentId} (${parent.email})`);
      console.log(`   ✅ Student ID: ${parentRelationship.studentId} (${student.email})`);
    } else {
      console.log("   ❌ No relationship found");
    }

    // Check teacher-student relationship via class
    console.log("\n📚 Teacher-Student Relationship (via Class):");
    const teacherClass = await db.query.classes.findFirst({
      where: eq(schema.classes.teacherId, teacher.id),
    });

    if (teacherClass) {
      console.log(`   ✅ Class ID: ${teacherClass.id}`);
      console.log(`   ✅ Class Name: ${teacherClass.name}`);
      console.log(`   ✅ Teacher ID: ${teacherClass.teacherId} (${teacher.email})`);
      console.log(`   ✅ Academic Year: ${teacherClass.academicYear}`);
      console.log(`   ✅ Active: ${teacherClass.isActive}`);

      const enrollment = await db.query.classEnrollments.findFirst({
        where: eq(schema.classEnrollments.classId, teacherClass.id),
      });

      if (enrollment) {
        console.log(`\n   📝 Student Enrollment:`);
        console.log(`      ✅ Enrollment ID: ${enrollment.id}`);
        console.log(`      ✅ Student ID: ${enrollment.studentId} (${student.email})`);
        console.log(`      ✅ Status: ${enrollment.status}`);
        console.log(`      ✅ Enrolled At: ${enrollment.enrolledAt}`);
      } else {
        console.log("   ❌ No enrollment found");
      }
    } else {
      console.log("   ❌ No class found");
    }

    console.log("\n✨ Verification complete!");
  } catch (error) {
    console.error("\n❌ Verification failed:", error);
    throw error;
  }
}

verifyRelationships()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
