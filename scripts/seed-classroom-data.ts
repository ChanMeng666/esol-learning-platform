#!/usr/bin/env ts-node

/**
 * Seed Script for Classroom Data
 * Creates sample teachers, classes, and students for testing
 *
 * Run with: npx tsx scripts/seed-classroom-data.ts
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("ERROR: DATABASE_URL environment variable is not set");
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

// Sample data
const sampleOrganization = {
  name: "Demo Language School",
  type: "school" as const,
  adminEmail: "admin@demolanguage.school",
  settings: {
    features: {
      diagnosticTests: true,
      assignments: true,
      audioRecording: true,
    },
  },
};

const sampleDepartments = [
  { name: "ESOL Department", code: "ESOL" },
  { name: "General English", code: "GEN" },
  { name: "Exam Preparation", code: "EXAM" },
];

const sampleGradeLevels = [
  { name: "Beginner", code: "BEG", order: 1 },
  { name: "Elementary", code: "ELEM", order: 2 },
  { name: "Pre-Intermediate", code: "PREINT", order: 3 },
  { name: "Intermediate", code: "INT", order: 4 },
  { name: "Upper-Intermediate", code: "UPINT", order: 5 },
  { name: "Advanced", code: "ADV", order: 6 },
];

const sampleTeachers = [
  {
    email: "sarah.johnson@demolanguage.school",
    displayName: "Sarah Johnson",
    role: "teacher" as const,
    department: "ESOL",
  },
  {
    email: "mike.chen@demolanguage.school",
    displayName: "Mike Chen",
    role: "teacher" as const,
    department: "GEN",
  },
  {
    email: "emma.wilson@demolanguage.school",
    displayName: "Emma Wilson",
    role: "teacher" as const,
    department: "EXAM",
  },
];

const sampleClasses = [
  {
    name: "NZCEL Level 3 - Morning",
    code: "NZCEL3-AM",
    description: "NZCEL Level 3 preparation class, morning session",
    teacher: "Sarah Johnson",
    department: "ESOL",
    gradeLevel: "INT",
    schedule: "Mon-Fri 9:00 AM - 12:00 PM",
    room: "Room 301",
  },
  {
    name: "General English B1",
    code: "GEN-B1",
    description: "General English for intermediate learners",
    teacher: "Mike Chen",
    department: "GEN",
    gradeLevel: "INT",
    schedule: "Tue-Thu 2:00 PM - 4:00 PM",
    room: "Room 205",
  },
  {
    name: "IELTS Preparation",
    code: "IELTS-PREP",
    description: "IELTS exam preparation course",
    teacher: "Emma Wilson",
    department: "EXAM",
    gradeLevel: "UPINT",
    schedule: "Mon-Wed-Fri 1:00 PM - 3:00 PM",
    room: "Room 410",
  },
  {
    name: "Speaking Practice A2",
    code: "SPEAK-A2",
    description: "Focused speaking practice for elementary students",
    teacher: "Sarah Johnson",
    department: "ESOL",
    gradeLevel: "ELEM",
    schedule: "Wed-Fri 3:00 PM - 4:30 PM",
    room: "Language Lab",
  },
];

const sampleStudents = [
  // Class 1: NZCEL Level 3 - Morning (5 students)
  {
    email: "student1@demolanguage.school",
    displayName: "Li Wei",
    role: "student" as const,
    className: "NZCEL Level 3 - Morning",
  },
  {
    email: "student2@demolanguage.school",
    displayName: "Maria Garcia",
    role: "student" as const,
    className: "NZCEL Level 3 - Morning",
  },
  {
    email: "student3@demolanguage.school",
    displayName: "Ahmed Hassan",
    role: "student" as const,
    className: "NZCEL Level 3 - Morning",
  },
  {
    email: "student4@demolanguage.school",
    displayName: "Yuki Tanaka",
    role: "student" as const,
    className: "NZCEL Level 3 - Morning",
  },
  {
    email: "student5@demolanguage.school",
    displayName: "Sophie Martin",
    role: "student" as const,
    className: "NZCEL Level 3 - Morning",
  },
  // Class 2: General English B1 (4 students)
  {
    email: "student6@demolanguage.school",
    displayName: "Carlos Rodriguez",
    role: "student" as const,
    className: "General English B1",
  },
  {
    email: "student7@demolanguage.school",
    displayName: "Priya Sharma",
    role: "student" as const,
    className: "General English B1",
  },
  {
    email: "student8@demolanguage.school",
    displayName: "Jin Park",
    role: "student" as const,
    className: "General English B1",
  },
  {
    email: "student9@demolanguage.school",
    displayName: "Anna Kowalski",
    role: "student" as const,
    className: "General English B1",
  },
  // Class 3: IELTS Preparation (6 students)
  {
    email: "student10@demolanguage.school",
    displayName: "David Liu",
    role: "student" as const,
    className: "IELTS Preparation",
  },
  {
    email: "student11@demolanguage.school",
    displayName: "Elena Petrov",
    role: "student" as const,
    className: "IELTS Preparation",
  },
  {
    email: "student12@demolanguage.school",
    displayName: "Mohammed Ali",
    role: "student" as const,
    className: "IELTS Preparation",
  },
  {
    email: "student13@demolanguage.school",
    displayName: "Isabella Costa",
    role: "student" as const,
    className: "IELTS Preparation",
  },
  {
    email: "student14@demolanguage.school",
    displayName: "Wang Xiaoming",
    role: "student" as const,
    className: "IELTS Preparation",
  },
  {
    email: "student15@demolanguage.school",
    displayName: "Fatima Al-Rashid",
    role: "student" as const,
    className: "IELTS Preparation",
  },
  // Class 4: Speaking Practice A2 (3 students)
  {
    email: "student16@demolanguage.school",
    displayName: "Tom Anderson",
    role: "student" as const,
    className: "Speaking Practice A2",
  },
  {
    email: "student17@demolanguage.school",
    displayName: "Nina Ivanova",
    role: "student" as const,
    className: "Speaking Practice A2",
  },
  {
    email: "student18@demolanguage.school",
    displayName: "Pedro Silva",
    role: "student" as const,
    className: "Speaking Practice A2",
  },
];

async function seedClassroomData() {
  console.log("🌱 Starting classroom data seed...");

  try {
    // 1. Create or get organization
    console.log("\n📢 Creating organization...");

    // First check if organization exists
    let existing = await db.query.organizations.findFirst({
      where: schema.eq(schema.organizations.name, sampleOrganization.name),
    });

    let orgId: bigint;
    if (existing) {
      console.log("   ℹ️  Organization already exists, using existing...");
      orgId = existing.id;
    } else {
      // Create new organization
      const [organization] = await db
        .insert(schema.organizations)
        .values({
          name: sampleOrganization.name,
          type: sampleOrganization.type,
          adminEmail: sampleOrganization.adminEmail,
          settings: sampleOrganization.settings,
        })
        .returning();

      orgId = organization.id;
      console.log(`   ✅ Organization created with ID: ${orgId}`);
    }

    // 2. Create departments
    console.log("\n📂 Creating departments...");
    const departmentMap: Record<string, bigint> = {};
    for (const dept of sampleDepartments) {
      // Check if department exists
      const existing = await db.query.departments.findFirst({
        where: schema.and(
          schema.eq(schema.departments.organizationId, orgId),
          schema.eq(schema.departments.code, dept.code)
        ),
      });

      if (existing) {
        departmentMap[dept.code] = existing.id;
      } else {
        const [department] = await db
          .insert(schema.departments)
          .values({
            organizationId: orgId,
            name: dept.name,
            code: dept.code,
          })
          .returning();

        departmentMap[dept.code] = department.id;
        console.log(`   ✅ Department created: ${dept.name}`);
      }
    }

    // 3. Create grade levels
    console.log("\n📊 Creating grade levels...");
    const gradeLevelMap: Record<string, bigint> = {};
    for (const grade of sampleGradeLevels) {
      const [gradeLevel] = await db
        .insert(schema.gradeLevels)
        .values({
          organizationId: orgId,
          name: grade.name,
          code: grade.code,
          orderIndex: grade.order,
        })
        .onConflictDoNothing()
        .returning();

      if (gradeLevel) {
        gradeLevelMap[grade.code] = gradeLevel.id;
        console.log(`   ✅ Grade level created: ${grade.name}`);
      } else {
        const existing = await db.query.gradeLevels.findFirst({
          where: schema.and(
            schema.eq(schema.gradeLevels.organizationId, orgId),
            schema.eq(schema.gradeLevels.code, grade.code)
          ),
        });
        if (existing) {
          gradeLevelMap[grade.code] = existing.id;
        }
      }
    }

    // 4. Create teachers
    console.log("\n👩‍🏫 Creating teachers...");
    const teacherMap: Record<string, bigint> = {};
    for (const teacher of sampleTeachers) {
      // Note: In a real scenario, these users would be created through Stack Auth
      // This is simplified for demo purposes
      const [user] = await db
        .insert(schema.users)
        .values({
          organizationId: orgId,
          stackId: `stack_teacher_${teacher.email.split("@")[0]}`, // Mock Stack ID
          email: teacher.email,
          displayName: teacher.displayName,
          role: teacher.role,
          departmentId: departmentMap[teacher.department],
          isActive: true,
        })
        .onConflictDoNothing({ target: schema.users.email })
        .returning();

      if (user) {
        teacherMap[teacher.displayName] = user.id;
        console.log(`   ✅ Teacher created: ${teacher.displayName}`);
      } else {
        const existing = await db.query.users.findFirst({
          where: schema.eq(schema.users.email, teacher.email),
        });
        if (existing) {
          teacherMap[teacher.displayName] = existing.id;
        }
      }
    }

    // 5. Create classes
    console.log("\n🏫 Creating classes...");
    const classMap: Record<string, bigint> = {};
    for (const cls of sampleClasses) {
      const [classRecord] = await db
        .insert(schema.classes)
        .values({
          organizationId: orgId,
          name: cls.name,
          code: cls.code,
          description: cls.description,
          teacherId: teacherMap[cls.teacher],
          departmentId: departmentMap[cls.department],
          gradeLevelId: gradeLevelMap[cls.gradeLevel],
          schedule: cls.schedule,
          room: cls.room,
          isActive: true,
        })
        .onConflictDoNothing()
        .returning();

      if (classRecord) {
        classMap[cls.name] = classRecord.id;
        console.log(`   ✅ Class created: ${cls.name}`);
      } else {
        const existing = await db.query.classes.findFirst({
          where: schema.and(
            schema.eq(schema.classes.organizationId, orgId),
            schema.eq(schema.classes.code, cls.code)
          ),
        });
        if (existing) {
          classMap[cls.name] = existing.id;
        }
      }
    }

    // 6. Create students and enroll them
    console.log("\n👨‍🎓 Creating students and enrollments...");
    let studentCount = 0;
    for (const student of sampleStudents) {
      // Create student user
      const [user] = await db
        .insert(schema.users)
        .values({
          organizationId: orgId,
          stackId: `stack_student_${student.email.split("@")[0]}`, // Mock Stack ID
          email: student.email,
          displayName: student.displayName,
          role: student.role,
          isActive: true,
        })
        .onConflictDoNothing({ target: schema.users.email })
        .returning();

      let studentId: bigint;
      if (user) {
        studentId = user.id;
        studentCount++;
      } else {
        const existing = await db.query.users.findFirst({
          where: schema.eq(schema.users.email, student.email),
        });
        if (existing) {
          studentId = existing.id;
        } else {
          continue;
        }
      }

      // Enroll student in class
      const classId = classMap[student.className];
      if (classId) {
        await db
          .insert(schema.classEnrollments)
          .values({
            classId,
            studentId,
            enrollmentDate: new Date(),
            status: "active",
          })
          .onConflictDoNothing();
      }

      // Create initial progress records
      await db
        .insert(schema.userProgress)
        .values({
          userId: studentId.toString(),
          organizationId: orgId,
          currentLevel: "foundation",
          targetLevel: "level-3-general",
          listeningProgress: Math.floor(Math.random() * 30) + 40, // 40-70
          speakingProgress: Math.floor(Math.random() * 30) + 35, // 35-65
          readingProgress: Math.floor(Math.random() * 30) + 45, // 45-75
          writingProgress: Math.floor(Math.random() * 30) + 30, // 30-60
          totalPoints: Math.floor(Math.random() * 500) + 100,
          questionsCompleted: Math.floor(Math.random() * 100) + 10,
          streakDays: Math.floor(Math.random() * 7),
          lastActivityDate: new Date(),
        })
        .onConflictDoNothing();
    }

    console.log(`   ✅ ${studentCount} students created and enrolled`);

    // 7. Create sample diagnostic attempt for some students
    console.log("\n🧪 Creating sample diagnostic attempts...");
    const studentsToTest = sampleStudents.slice(0, 5); // First 5 students
    for (const student of studentsToTest) {
      const user = await db.query.users.findFirst({
        where: schema.eq(schema.users.email, student.email),
      });

      if (!user) continue;

      // Get the first diagnostic test (created by previous seed script)
      const diagnosticTest = await db.query.diagnosticTests.findFirst({
        where: schema.eq(schema.diagnosticTests.isSystemTest, true),
      });

      if (!diagnosticTest) {
        console.log("   ⚠️  No diagnostic tests found. Run seed-diagnostic-tests.ts first.");
        break;
      }

      // Create a completed attempt
      const [attempt] = await db
        .insert(schema.studentDiagnosticAttempts)
        .values({
          studentId: user.id,
          organizationId: orgId,
          diagnosticTestId: diagnosticTest.id,
          startedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          completedAt: new Date(),
          isCompleted: true,
          totalDuration: 3600, // 1 hour in seconds
        })
        .returning();

      if (attempt) {
        // Create sample results
        const overallLevel = ["foundation", "level-1", "level-2"][Math.floor(Math.random() * 3)];
        await db
          .insert(schema.studentDiagnosticResults)
          .values({
            studentId: user.id,
            organizationId: orgId,
            attemptId: attempt.id,
            diagnosticTestId: diagnosticTest.id,
            levelSystem: diagnosticTest.levelSystem,
            overallLevel,
            skillLevels: {
              listening: overallLevel,
              speaking: overallLevel,
              reading: overallLevel,
              writing: overallLevel,
            },
            skillScores: {
              listening: { earned: 7, total: 10 },
              speaking: { earned: 6, total: 10 },
              reading: { earned: 8, total: 10 },
              writing: { earned: 5, total: 10 },
            },
            strengths: ["reading", "listening"],
            areasForImprovement: ["writing", "speaking"],
            recommendedNextSteps: ["Focus on writing practice", "Practice speaking daily"],
            totalScore: 26,
            percentageScore: "65",
            completedAt: new Date(),
          })
          .onConflictDoNothing();

        console.log(`   ✅ Diagnostic attempt created for: ${user.displayName}`);
      }
    }

    console.log("\n🎉 Classroom data seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   • Organization: ${sampleOrganization.name}`);
    console.log(`   • Departments: ${sampleDepartments.length}`);
    console.log(`   • Teachers: ${sampleTeachers.length}`);
    console.log(`   • Classes: ${sampleClasses.length}`);
    console.log(`   • Students: ${studentCount}`);
  } catch (error) {
    console.error("❌ Error seeding classroom data:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the seed function
seedClassroomData()
  .then(() => {
    console.log("\n✅ Seed completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  });