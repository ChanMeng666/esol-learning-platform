/**
 * Database Initialization Script - Create Initial Invitation Codes
 * Run with: npx tsx scripts/init-invitation-codes.ts
 *
 * This script creates invitation codes for testing all user roles.
 * Use these codes to register test accounts.
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
  console.log("\n🎯 ================================");
  console.log("🎯 INVITATION CODE INITIALIZATION");
  console.log("🎯 ================================\n");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in environment");
    process.exit(1);
  }

  const db = drizzle(neon(process.env.DATABASE_URL), { schema });

  try {
    // Step 1: Get or create default organization
    console.log("📋 Step 1: Checking for default organization...\n");

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
          type: "school",
          isActive: true,
          settings: {},
          metadata: { initialized: true },
        })
        .returning();
      console.log(`   ✅ Created organization: ${organization.name} (ID: ${organization.id})`);
    } else {
      console.log(`   ✅ Using existing organization: ${organization.name} (ID: ${organization.id})`);
    }
    console.log("");

    // Step 2: Create invitation codes for each role
    console.log("🎫 Step 2: Creating invitation codes...\n");

    const codesToCreate = [
      {
        role: "system_admin",
        type: "organization_general",
        customPrefix: "SYSADMIN",
        maxUses: 5,
        description: "System Administrator",
      },
      {
        role: "school_admin",
        type: "organization_general",
        customPrefix: "ADMIN",
        maxUses: 10,
        description: "School Administrator",
      },
      {
        role: "teacher",
        type: "teacher_specific",
        customPrefix: "TEACHER",
        maxUses: 20,
        description: "Teacher",
      },
      {
        role: "student",
        type: "organization_general",
        customPrefix: "STUDENT",
        maxUses: null, // unlimited
        description: "Student",
      },
      {
        role: "parent",
        type: "parent_specific",
        customPrefix: "PARENT",
        maxUses: 50,
        description: "Parent",
      },
    ];

    const createdCodes: Array<{ role: string; code: string; description: string }> = [];

    for (const codeConfig of codesToCreate) {
      // Generate unique code
      let code: string;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        code = generateInvitationCode({
          role: codeConfig.role as any,
          type: codeConfig.type as any,
          organizationSlug: organization.slug,
          customPrefix: codeConfig.customPrefix,
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
        throw new Error(`Failed to generate unique code for ${codeConfig.role}`);
      }

      // Create invitation code
      await db.insert(schema.invitationCodes).values({
        organizationId: organization.id,
        code,
        role: codeConfig.role,
        type: codeConfig.type as any,
        maxUses: codeConfig.maxUses,
        usedCount: 0,
        expiresAt: null, // Never expires
        isActive: true,
        createdByUserId: null, // System generated
        metadata: {
          systemGenerated: true,
          description: codeConfig.description,
        },
      });

      createdCodes.push({
        role: codeConfig.role,
        code,
        description: codeConfig.description,
      });

      console.log(`   ✅ ${codeConfig.description.padEnd(25)} → ${code}`);
    }

    console.log("");

    // Step 3: Display summary and instructions
    console.log("✅ ================================");
    console.log("✅ INITIALIZATION COMPLETED");
    console.log("✅ ================================\n");

    console.log("📋 INVITATION CODES CREATED:\n");
    console.log("┌─────────────────────────┬─────────────────────────┐");
    console.log("│ Role                    │ Invitation Code         │");
    console.log("├─────────────────────────┼─────────────────────────┤");

    createdCodes.forEach((item) => {
      console.log(`│ ${item.description.padEnd(23)} │ ${item.code.padEnd(23)} │`);
    });

    console.log("└─────────────────────────┴─────────────────────────┘\n");

    console.log("📝 REGISTRATION INSTRUCTIONS:\n");
    console.log("1. Open your browser to: http://localhost:3000");
    console.log("2. Click 'Get Started Free' on the homepage");
    console.log("3. Enter one of the invitation codes above");
    console.log("4. Complete the Stack Auth registration form");
    console.log("5. You'll be automatically assigned the correct role\n");

    console.log("🎯 RECOMMENDED TEST ACCOUNT CREATION ORDER:\n");
    console.log("1️⃣  System Admin    → Use SYSADMIN code (full platform access)");
    console.log("2️⃣  School Admin    → Use ADMIN code (organization management)");
    console.log("3️⃣  Teacher         → Use TEACHER code (class management)");
    console.log("4️⃣  Student         → Use STUDENT code (learning features)");
    console.log("5️⃣  Parent          → Use PARENT code (student monitoring)\n");

    console.log("💡 TIPS:");
    console.log("   - Use different email addresses for each test account");
    console.log("   - Recommended pattern: sysadmin@test.com, admin@test.com, etc.");
    console.log("   - After creating admin account, you can create more codes via UI");
    console.log("   - Visit /admin/invitations to manage invitation codes\n");

    console.log("🔗 USEFUL LINKS:");
    console.log("   - Homepage: http://localhost:3000");
    console.log("   - Registration: http://localhost:3000/register");
    console.log("   - Admin Invitations: http://localhost:3000/admin/invitations");
    console.log("   - Student Dashboard: http://localhost:3000/dashboard");
    console.log("   - Teacher Dashboard: http://localhost:3000/teacher/dashboard\n");

  } catch (error) {
    console.error("\n❌ ================================");
    console.error("❌ INITIALIZATION FAILED");
    console.error("❌ ================================\n");
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
