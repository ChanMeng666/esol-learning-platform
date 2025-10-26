"use server";

import { fetchWithDrizzleUnsafe } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, isNull, or } from "drizzle-orm";

/**
 * Fix legacy users without roles in database
 * This script:
 * 1. Finds all users in database without roles (or with NULL role)
 * 2. Updates their role to "student" in database
 *
 * NOTE: Stack Auth clientMetadata is handled by RoleGuard components
 * which default to "student" for users without roles
 *
 * IMPORTANT: This is a one-time migration script for existing users
 */
export async function fixLegacyUserRoles() {
  try {
    return await fetchWithDrizzleUnsafe(async (db) => {
      // Find all users without roles or with NULL role
      const usersWithoutRoles = await db.query.users.findMany({
        where: or(
          isNull(schema.users.role),
          eq(schema.users.role, "")
        ),
      });

      console.log(`Found ${usersWithoutRoles.length} users without roles`);

      const results = [];

      for (const user of usersWithoutRoles) {
        try {
          // Update database role to "student"
          const [updatedUser] = await db
            .update(schema.users)
            .set({
              role: "student",
              updatedAt: new Date(),
            })
            .where(eq(schema.users.id, user.id))
            .returning();

          results.push({
            userId: user.id,
            stackUserId: user.stackUserId,
            email: user.email,
            fullName: user.fullName,
            success: true,
            message: "Database role updated to 'student'",
          });
        } catch (dbError) {
          console.error(`Failed to update database for user ${user.id}:`, dbError);
          results.push({
            userId: user.id,
            stackUserId: user.stackUserId,
            email: user.email,
            fullName: user.fullName,
            success: false,
            message: `Database update failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`,
          });
        }
      }

      return {
        totalFound: usersWithoutRoles.length,
        results,
        summary: {
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
        },
      };
    });
  } catch (error) {
    console.error("Failed to fix legacy user roles:", error);
    throw new Error(
      `Failed to fix legacy user roles: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get all users and their role status
 * Diagnostic function to check user roles
 */
export async function getAllUsersRoleStatus() {
  return await fetchWithDrizzleUnsafe(async (db) => {
    const allUsers = await db.query.users.findMany({
      columns: {
        id: true,
        stackUserId: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        organizationId: true,
        createdAt: true,
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    return {
      totalUsers: allUsers.length,
      users: allUsers,
      roleDistribution: {
        student: allUsers.filter(u => u.role === "student").length,
        teacher: allUsers.filter(u => u.role === "teacher").length,
        school_admin: allUsers.filter(u => u.role === "school_admin").length,
        system_admin: allUsers.filter(u => u.role === "system_admin").length,
        department_head: allUsers.filter(u => u.role === "department_head").length,
        parent: allUsers.filter(u => u.role === "parent").length,
        noRole: allUsers.filter(u => !u.role || u.role === "").length,
      },
    };
  });
}
