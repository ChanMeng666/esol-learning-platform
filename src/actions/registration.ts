"use server";

import { fetchWithDrizzleUnsafe } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { stackServerApp } from "@/lib/stack";
import { useInvitationCode } from "@/actions/invitations";
import type { UserRole } from "@/lib/auth/permissions";

export interface CompleteRegistrationParams {
  invitationCodeId: string;
  invitationCode: string;
  organizationId: string;
  role: UserRole;
}

/**
 * Complete user registration after Stack Auth signup
 * Creates enhanced user record and processes invitation code
 */
export async function completeRegistration(params: CompleteRegistrationParams) {
  const { invitationCodeId, invitationCode, organizationId, role } = params;

  // Get current user from Stack Auth
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  return fetchWithDrizzleUnsafe(async (db) => {
    // Check if user already exists in our database
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.stackUserId, user.id),
    });

    if (existingUser) {
      // User already registered
      return { success: true, userId: existingUser.id, alreadyExists: true };
    }

    // Create enhanced user record
    const [enhancedUser] = await db
      .insert(schema.users)
      .values({
        stackUserId: user.id,
        organizationId: BigInt(organizationId),
        email: user.primaryEmail || "",
        fullName: user.displayName || user.primaryEmail || "User",
        role,
        isActive: true,
        metadata: {
          registrationMethod: "invitation_code",
          invitationCode,
        },
      })
      .returning();

    // Record invitation code usage
    await useInvitationCode(
      BigInt(invitationCodeId),
      enhancedUser.id,
      BigInt(organizationId)
    );

    // Update Stack Auth user metadata with role
    await user.update({
      clientMetadata: {
        role,
        organizationId,
      },
    });

    // Initialize user progress only for learning roles (student, teacher)
    // Parents and admins don't need their own learning progress
    if (role === "student" || role === "teacher") {
      // Initialize user progress (NZCEL)
      await db.insert(schema.userProgress).values({
        userId: user.id, // Stack Auth user ID
        organizationId: BigInt(organizationId),
        currentLevel: role === "student" ? "foundation" : "level-1",
        targetLevel: role === "student" ? "level-3-general" : "level-5-general",
        totalPoints: 0,
        questionsCompleted: 0,
        correctAnswers: 0,
        streak: 0,
        perfectStreak: 0,
        lastStudyDate: new Date(),
        listeningProgress: 0,
        speakingProgress: 0,
        readingProgress: 0,
        writingProgress: 0,
        totalStudyTime: 0,
      });

      // Initialize CEFR progress
      await db.insert(schema.cefrProgress).values({
        userId: user.id, // Stack Auth user ID
        organizationId: BigInt(organizationId),
        currentLevel: "A1",
        targetLevel: "B2",
        totalPoints: 0,
        questionsCompleted: 0,
        listeningProgress: 0,
        speakingProgress: 0,
        readingProgress: 0,
        writingProgress: 0,
      });
    }

    return {
      success: true,
      userId: enhancedUser.id,
      alreadyExists: false,
    };
  });
}

/**
 * Check if user needs to complete registration with invitation code
 * Used for OAuth users who haven't provided an invitation code yet
 */
export async function checkUserRegistrationStatus() {
  const user = await stackServerApp.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return fetchWithDrizzleUnsafe(async (db) => {
    // Check if user has enhanced user record
    const enhancedUser = await db.query.users.findFirst({
      where: eq(schema.users.stackUserId, user.id),
    });

    if (!enhancedUser) {
      // User authenticated but no enhanced record = needs invitation code
      return {
        needsInvitationCode: true,
        role: null,
      };
    }

    // User has complete registration
    return {
      needsInvitationCode: false,
      role: enhancedUser.role,
    };
  });
}

/**
 * Get pending invitation from session (client-side helper)
 */
export async function getPendingInvitation() {
  // This will be called from client component
  // Just a placeholder for type safety
  return null;
}
