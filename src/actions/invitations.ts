"use server";

import { fetchWithDrizzle, fetchWithDrizzleUnsafe } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, sql, desc, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/lib/auth/permissions";
import {
  generateInvitationCode,
  validateCodeFormat,
  type InvitationCodeType,
} from "@/lib/invitations/code-generator";

/**
 * Invitation Code Management Server Actions
 * Handles creation, validation, and usage of invitation codes
 */

export interface CreateInvitationCodeParams {
  role: UserRole;
  type: InvitationCodeType;
  maxUses?: number | null;
  expiresAt?: Date | null;
  customPrefix?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a new invitation code
 * Multi-tenant: Scoped to user's organization
 */
export async function createInvitationCode(params: CreateInvitationCodeParams) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Permission check: Only admins and teachers can create invitation codes
    if (
      enhancedUser.role !== "school_admin" &&
      enhancedUser.role !== "system_admin" &&
      enhancedUser.role !== "teacher"
    ) {
      throw new Error("Access denied: Only admins and teachers can create invitation codes");
    }

    // Get organization for slug
    const organization = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, organizationId),
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Generate unique code
    let code: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = generateInvitationCode({
        role: params.role,
        type: params.type,
        organizationSlug: organization.slug,
        customPrefix: params.customPrefix,
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
      throw new Error("Failed to generate unique invitation code");
    }

    // Create invitation code
    const [invitation] = await db
      .insert(schema.invitationCodes)
      .values({
        organizationId,
        code,
        role: params.role,
        type: params.type,
        maxUses: params.maxUses ?? null,
        usedCount: 0,
        expiresAt: params.expiresAt ?? null,
        isActive: true,
        createdByUserId: enhancedUser.id,
        metadata: params.metadata ?? null,
      })
      .returning();

    revalidatePath("/admin/invitations");
    return invitation;
  });
}

/**
 * Validate invitation code (public - can be called without authentication)
 * Returns invitation details if valid, throws error if invalid
 */
export async function validateInvitationCode(code: string) {
  return fetchWithDrizzleUnsafe(async (db) => {
    // Validate format first
    if (!validateCodeFormat(code)) {
      throw new Error("Invalid invitation code format");
    }

    // Find invitation code
    const invitation = await db.query.invitationCodes.findFirst({
      where: eq(schema.invitationCodes.code, code.toUpperCase()),
    });

    if (!invitation) {
      throw new Error("Invitation code not found");
    }

    // Check if active
    if (!invitation.isActive) {
      throw new Error("This invitation code has been deactivated");
    }

    // Check expiration
    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      throw new Error("This invitation code has expired");
    }

    // Check usage limit
    if (invitation.maxUses !== null && invitation.usedCount >= invitation.maxUses) {
      throw new Error("This invitation code has reached its usage limit");
    }

    // Get organization details
    const organization = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, invitation.organizationId),
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    if (!organization.isActive) {
      throw new Error("This organization is currently inactive");
    }

    return {
      id: invitation.id,
      code: invitation.code,
      role: invitation.role,
      type: invitation.type,
      organizationId: invitation.organizationId,
      organizationName: organization.name,
      organizationSlug: organization.slug,
      metadata: invitation.metadata,
    };
  });
}

/**
 * Use invitation code during registration
 * Records usage and increments counter
 * Multi-tenant: Creates usage record with organization context
 */
export async function useInvitationCode(
  invitationCodeId: bigint,
  userId: bigint,
  organizationId: bigint,
  ipAddress?: string,
  userAgent?: string
) {
  return fetchWithDrizzleUnsafe(async (db) => {
    // Get invitation code
    const invitation = await db.query.invitationCodes.findFirst({
      where: eq(schema.invitationCodes.id, invitationCodeId),
    });

    if (!invitation) {
      throw new Error("Invitation code not found");
    }

    // Double-check validity
    if (!invitation.isActive) {
      throw new Error("Invitation code is not active");
    }

    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      throw new Error("Invitation code has expired");
    }

    if (invitation.maxUses !== null && invitation.usedCount >= invitation.maxUses) {
      throw new Error("Invitation code usage limit reached");
    }

    // Increment usage count
    await db
      .update(schema.invitationCodes)
      .set({
        usedCount: sql`${schema.invitationCodes.usedCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(schema.invitationCodes.id, invitationCodeId));

    // Record usage
    const [usage] = await db
      .insert(schema.invitationUsages)
      .values({
        invitationCodeId,
        userId,
        organizationId,
        usedAt: new Date(),
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        success: true,
        errorMessage: null,
        metadata: null,
      })
      .returning();

    return usage;
  });
}

/**
 * Get all invitation codes for current organization
 * Multi-tenant: Returns codes from user's organization only
 */
export async function getOrganizationInvitationCodes() {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Permission check
    if (
      enhancedUser?.role !== "school_admin" &&
      enhancedUser?.role !== "system_admin" &&
      enhancedUser?.role !== "teacher"
    ) {
      throw new Error("Access denied");
    }

    const invitations = await db.query.invitationCodes.findMany({
      where: eq(schema.invitationCodes.organizationId, organizationId),
      orderBy: [desc(schema.invitationCodes.createdAt)],
    });

    return invitations;
  });
}

/**
 * Get invitation code usage statistics
 */
export async function getInvitationCodeStats(invitationCodeId: bigint) {
  return fetchWithDrizzle(async (db, { organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const invitation = await db.query.invitationCodes.findFirst({
      where: and(
        eq(schema.invitationCodes.id, invitationCodeId),
        eq(schema.invitationCodes.organizationId, organizationId)
      ),
    });

    if (!invitation) {
      throw new Error("Invitation code not found");
    }

    // Get usage records
    const usages = await db.query.invitationUsages.findMany({
      where: and(
        eq(schema.invitationUsages.invitationCodeId, invitationCodeId),
        eq(schema.invitationUsages.organizationId, organizationId)
      ),
      orderBy: [desc(schema.invitationUsages.usedAt)],
    });

    // Get user details for each usage
    const usagesWithUsers = await Promise.all(
      usages.map(async (usage) => {
        const user = await db.query.users.findFirst({
          where: eq(schema.users.id, usage.userId),
          columns: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        });

        return {
          ...usage,
          user,
        };
      })
    );

    return {
      invitation,
      usages: usagesWithUsers,
      stats: {
        totalUses: usages.length,
        remainingUses:
          invitation.maxUses !== null
            ? Math.max(0, invitation.maxUses - invitation.usedCount)
            : null,
        isExpired: invitation.expiresAt
          ? new Date(invitation.expiresAt) < new Date()
          : false,
        isActive: invitation.isActive,
      },
    };
  });
}

/**
 * Deactivate invitation code
 */
export async function deactivateInvitationCode(invitationCodeId: bigint) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Permission check
    if (
      enhancedUser?.role !== "school_admin" &&
      enhancedUser?.role !== "system_admin"
    ) {
      throw new Error("Access denied: Only admins can deactivate invitation codes");
    }

    const [deactivated] = await db
      .update(schema.invitationCodes)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.invitationCodes.id, invitationCodeId),
          eq(schema.invitationCodes.organizationId, organizationId)
        )
      )
      .returning();

    if (!deactivated) {
      throw new Error("Invitation code not found");
    }

    revalidatePath("/admin/invitations");
    return deactivated;
  });
}

/**
 * Reactivate invitation code
 */
export async function reactivateInvitationCode(invitationCodeId: bigint) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Permission check
    if (
      enhancedUser?.role !== "school_admin" &&
      enhancedUser?.role !== "system_admin"
    ) {
      throw new Error("Access denied: Only admins can reactivate invitation codes");
    }

    const [reactivated] = await db
      .update(schema.invitationCodes)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.invitationCodes.id, invitationCodeId),
          eq(schema.invitationCodes.organizationId, organizationId)
        )
      )
      .returning();

    if (!reactivated) {
      throw new Error("Invitation code not found");
    }

    revalidatePath("/admin/invitations");
    return reactivated;
  });
}

/**
 * Delete invitation code
 * Only allowed if not yet used
 */
export async function deleteInvitationCode(invitationCodeId: bigint) {
  return fetchWithDrizzle(async (db, { organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Permission check
    if (
      enhancedUser?.role !== "school_admin" &&
      enhancedUser?.role !== "system_admin"
    ) {
      throw new Error("Access denied: Only admins can delete invitation codes");
    }

    const invitation = await db.query.invitationCodes.findFirst({
      where: and(
        eq(schema.invitationCodes.id, invitationCodeId),
        eq(schema.invitationCodes.organizationId, organizationId)
      ),
    });

    if (!invitation) {
      throw new Error("Invitation code not found");
    }

    if (invitation.usedCount > 0) {
      throw new Error("Cannot delete invitation code that has been used. Deactivate it instead.");
    }

    await db
      .delete(schema.invitationCodes)
      .where(
        and(
          eq(schema.invitationCodes.id, invitationCodeId),
          eq(schema.invitationCodes.organizationId, organizationId)
        )
      );

    revalidatePath("/admin/invitations");
    return { success: true };
  });
}

/**
 * Get invitation code by code string (for public validation)
 */
export async function getInvitationCodeByCode(code: string) {
  return fetchWithDrizzleUnsafe(async (db) => {
    const invitation = await db.query.invitationCodes.findFirst({
      where: eq(schema.invitationCodes.code, code.toUpperCase()),
    });

    return invitation;
  });
}
