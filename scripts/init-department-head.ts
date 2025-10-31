#!/usr/bin/env tsx

/**
 * Department Head Setup Script
 * Creates test department and generates invitation code for department_head role
 *
 * Run with: npx tsx scripts/init-department-head.ts
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";
import { eq } from "drizzle-orm";
import { config } from "dotenv";
import { generateInvitationCode } from "../src/lib/invitations/code-generator";

// Load environment variables
config({ path: ".env.local" });

async function main() {
  console.log("\n🎓 ========================================");
  console.log("🎓 DEPARTMENT HEAD SETUP");
  console.log("🎓 ========================================\n");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in environment");
    process.exit(1);
  }

  const db = drizzle(neon(process.env.DATABASE_URL), { schema });

  try {
    // Step 1: Get organization
    console.log("📋 Step 1: Getting organization...\n");

    let organization = await db.query.organizations.findFirst({
      orderBy: (organizations, { asc }) => [asc(organizations.createdAt)],
    });

    if (!organization) {
      console.log("   No organization found. Creating default organization...");
      [organization] = await db
        .insert(schema.organizations)
        .values({
          name: "Test School",
          slug: "test-school",
          isActive: true,
          subscriptionTier: "pro",
          settings: {
            allowed_level_systems: ["nzcel", "cefr"],
            use_shared_question_bank: true,
            features_enabled: {
              diagnosticTests: true,
              assignments: true,
              audioRecording: true,
            },
          },
        })
        .returning();
      console.log(`   ✅ Created organization: ${organization.name} (ID: ${organization.id})`);
    } else {
      console.log(`   ✅ Using organization: ${organization.name} (ID: ${organization.id})`);
    }
    console.log("");

    // Step 2: Create test department
    console.log("🏢 Step 2: Creating test department...\n");

    // Check if ESOL Department already exists
    let department = await db.query.departments.findFirst({
      where: (departments, { eq, and }) =>
        and(
          eq(departments.organizationId, organization.id),
          eq(departments.name, "ESOL Department")
        ),
    });

    if (!department) {
      [department] = await db
        .insert(schema.departments)
        .values({
          organizationId: organization.id,
          name: "ESOL Department",
          description: "English for Speakers of Other Languages Department",
          headTeacherId: null, // Will be assigned after user registers
          isActive: true,
        })
        .returning();
      console.log(`   ✅ Created department: ${department.name} (ID: ${department.id})`);
    } else {
      console.log(`   ℹ️  Department already exists: ${department.name} (ID: ${department.id})`);
    }
    console.log("");

    // Step 3: Create additional departments for testing
    console.log("🏢 Step 3: Creating additional departments...\n");

    const additionalDepartments = [
      {
        name: "General English Department",
        description: "General English language instruction",
      },
      {
        name: "Exam Preparation Department",
        description: "IELTS, TOEFL, and other exam preparation",
      },
    ];

    for (const deptData of additionalDepartments) {
      const existing = await db.query.departments.findFirst({
        where: (departments, { eq, and }) =>
          and(
            eq(departments.organizationId, organization.id),
            eq(departments.name, deptData.name)
          ),
      });

      if (!existing) {
        await db.insert(schema.departments).values({
          organizationId: organization.id,
          name: deptData.name,
          description: deptData.description,
          headTeacherId: null,
          isActive: true,
        });
        console.log(`   ✅ Created: ${deptData.name}`);
      } else {
        console.log(`   ℹ️  Already exists: ${deptData.name}`);
      }
    }
    console.log("");

    // Step 4: Generate Department Head invitation code
    console.log("🎫 Step 4: Generating Department Head invitation code...\n");

    // Check if code already exists
    const existingCode = await db.query.invitationCodes.findFirst({
      where: (codes, { eq, and }) =>
        and(
          eq(codes.organizationId, organization.id),
          eq(codes.role, "department_head"),
          eq(codes.isActive, true)
        ),
    });

    let invitationCode: string;

    if (existingCode) {
      invitationCode = existingCode.code;
      console.log(`   ℹ️  Using existing invitation code: ${invitationCode}`);
      console.log(`   ℹ️  Used: ${existingCode.usedCount}/${existingCode.maxUses || "unlimited"} times`);
    } else {
      // Generate unique code
      let code: string;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        code = generateInvitationCode({
          role: "department_head",
          type: "organization_general",
          organizationSlug: organization.slug,
          customPrefix: "DEPTHEAD",
        });

        // Check if code already exists
        const existing = await db.query.invitationCodes.findFirst({
          where: eq(schema.invitationCodes.code, code),
        });

        if (!existing) {
          break;
        }

        attempts++;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        throw new Error("Failed to generate unique invitation code for department_head");
      }

      invitationCode = code;

      // Create invitation code
      await db.insert(schema.invitationCodes).values({
        organizationId: organization.id,
        code: invitationCode,
        role: "department_head",
        type: "organization_general",
        maxUses: 5, // Allow 5 department heads
        usedCount: 0,
        expiresAt: null, // Never expires
        isActive: true,
        createdByUserId: null,
        metadata: {
          systemGenerated: true,
          description: "Department Head",
          departmentId: department.id.toString(), // Convert BigInt to string for JSON
        },
      });

      console.log(`   ✅ Created new invitation code: ${invitationCode}`);
    }
    console.log("");

    // Step 5: Display summary and instructions
    console.log("✅ ========================================");
    console.log("✅ SETUP COMPLETED SUCCESSFULLY");
    console.log("✅ ========================================\n");

    console.log("📋 CREATED RESOURCES:\n");
    console.log(`   🏢 Organization: ${organization.name}`);
    console.log(`   🏫 Main Department: ESOL Department (ID: ${department.id})`);
    console.log(`   🎫 Invitation Code: ${invitationCode}\n`);

    console.log("┌──────────────────────────────────────────────────┐");
    console.log("│  DEPARTMENT HEAD INVITATION CODE                 │");
    console.log("├──────────────────────────────────────────────────┤");
    console.log(`│  ${invitationCode.padEnd(48)} │`);
    console.log("└──────────────────────────────────────────────────┘\n");

    console.log("📝 REGISTRATION INSTRUCTIONS:\n");
    console.log("🔹 Option 1: Register New Account");
    console.log("   1. Open: http://localhost:3000");
    console.log("   2. Click 'Get Started Free' or 'Sign Up'");
    console.log("   3. Enter the invitation code above");
    console.log("   4. Complete registration with your email");
    console.log("   5. Recommended email format: depthead@test.com");
    console.log("   6. Password: Test1234!");
    console.log("   7. You'll be assigned the 'Department Head' role automatically\n");

    console.log("🔹 Option 2: Access Department Dashboard");
    console.log("   After registration, navigate to:");
    console.log("   → http://localhost:3000/department/dashboard\n");

    console.log("🎯 DEPARTMENT HEAD FEATURES:\n");
    console.log("   📊 Dashboard         → Overview of department performance");
    console.log("   👥 Teachers          → Manage department teachers");
    console.log("   🏫 Classes           → View all department classes");
    console.log("   👨‍🎓 Students          → Monitor student progress");
    console.log("   📈 Analytics         → Department-level analytics");
    console.log("   📋 Reports           → Generate department reports");
    console.log("   📚 Resources         → Manage learning resources");
    console.log("   ⚙️  Settings          → Configure department settings\n");

    console.log("💡 TIPS:");
    console.log("   • Department Heads have access to all classes in their department");
    console.log("   • Can view (but not edit) teacher assignments");
    console.log("   • Can monitor all students in department classes");
    console.log("   • Can generate analytics and reports for their department");
    console.log("   • Cannot manage other departments or system settings\n");

    console.log("🔗 USEFUL LINKS:");
    console.log("   • Department Dashboard:  http://localhost:3000/department/dashboard");
    console.log("   • Teachers Management:   http://localhost:3000/department/teachers");
    console.log("   • Classes Overview:      http://localhost:3000/department/classes");
    console.log("   • Students List:         http://localhost:3000/department/students");
    console.log("   • Analytics:             http://localhost:3000/department/analytics");
    console.log("   • Reports:               http://localhost:3000/department/reports\n");

    console.log("📌 NEXT STEPS:");
    console.log("   1. Register using the invitation code above");
    console.log("   2. Log in to your account");
    console.log("   3. Navigate to /department/dashboard");
    console.log("   4. Explore the department management features");
    console.log("   5. (Optional) Use teacher/student codes to create test accounts\n");

    console.log("🔍 VERIFY SETUP:");
    console.log("   Run this command to check the setup:");
    console.log("   → npx tsx scripts/verify-department-head.ts\n");

  } catch (error) {
    console.error("\n❌ ========================================");
    console.error("❌ SETUP FAILED");
    console.error("❌ ========================================\n");
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
