"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Organization Management Server Actions
 * Handles CRUD operations for organizations/schools
 */

/**
 * Create a new organization
 */
export async function createOrganization(data: {
  name: string;
  slug: string;
  settings?: {
    allowed_level_systems?: ("nzcel" | "cefr")[];
    use_shared_question_bank?: boolean;
    custom_branding?: Record<string, unknown>;
    features_enabled?: Record<string, boolean>;
  };
  subscriptionTier?: "basic" | "pro" | "enterprise";
  maxStudents?: number;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}) {
  return fetchWithDrizzle(async (db) => {
    // Check if slug already exists
    const existing = await db.query.organizations.findFirst({
      where: eq(schema.organizations.slug, data.slug),
    });

    if (existing) {
      throw new Error(`Organization with slug "${data.slug}" already exists`);
    }

    // Create organization
    const [organization] = await db
      .insert(schema.organizations)
      .values({
        name: data.name,
        slug: data.slug,
        settings: data.settings || null,
        subscriptionTier: data.subscriptionTier || "basic",
        maxStudents: data.maxStudents || null,
        isActive: true,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        address: data.address || null,
      })
      .returning();

    revalidatePath("/admin/organizations");
    return organization;
  });
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(organizationId: bigint) {
  return fetchWithDrizzle(async (db) => {
    const organization = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, organizationId),
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    return organization;
  });
}

/**
 * Get organization by slug
 */
export async function getOrganizationBySlug(slug: string) {
  return fetchWithDrizzle(async (db) => {
    const organization = await db.query.organizations.findFirst({
      where: eq(schema.organizations.slug, slug),
    });

    if (!organization) {
      throw new Error(`Organization with slug "${slug}" not found`);
    }

    return organization;
  });
}

/**
 * Get all organizations (system admin only)
 */
export async function getAllOrganizations() {
  return fetchWithDrizzle(async (db) => {
    const organizations = await db.query.organizations.findMany({
      orderBy: (orgs, { desc }) => [desc(orgs.createdAt)],
    });

    return organizations;
  });
}

/**
 * Update organization
 */
export async function updateOrganization(
  organizationId: bigint,
  data: {
    name?: string;
    settings?: {
      allowed_level_systems?: ("nzcel" | "cefr")[];
      use_shared_question_bank?: boolean;
      custom_branding?: Record<string, unknown>;
      features_enabled?: Record<string, boolean>;
    };
    subscriptionTier?: "basic" | "pro" | "enterprise";
    maxStudents?: number;
    isActive?: boolean;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
  }
) {
  return fetchWithDrizzle(async (db) => {
    const [updated] = await db
      .update(schema.organizations)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.organizations.id, organizationId))
      .returning();

    revalidatePath("/admin/organizations");
    return updated;
  });
}

/**
 * Deactivate organization (soft delete)
 */
export async function deactivateOrganization(organizationId: bigint) {
  return fetchWithDrizzle(async (db) => {
    const [deactivated] = await db
      .update(schema.organizations)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(schema.organizations.id, organizationId))
      .returning();

    revalidatePath("/admin/organizations");
    return deactivated;
  });
}

/**
 * Create default system organization
 * Used for initial setup and data migration
 */
export async function createDefaultOrganization() {
  return fetchWithDrizzle(async (db) => {
    // Check if default organization already exists
    const existing = await db.query.organizations.findFirst({
      where: eq(schema.organizations.slug, "default-system-org"),
    });

    if (existing) {
      console.log("Default organization already exists:", existing.id);
      return existing;
    }

    // Create default organization
    const [organization] = await db
      .insert(schema.organizations)
      .values({
        name: "Default System Organization",
        slug: "default-system-org",
        settings: {
          allowed_level_systems: ["nzcel", "cefr"],
          use_shared_question_bank: true,
          features_enabled: {
            diagnostic_tests: true,
            assignments: true,
            parent_access: true,
          },
        },
        subscriptionTier: "enterprise",
        maxStudents: null, // Unlimited
        isActive: true,
        contactEmail: null,
        contactPhone: null,
        address: null,
      })
      .returning();

    console.log("Created default organization:", organization.id);
    return organization;
  });
}

/**
 * Get organization statistics
 */
export async function getOrganizationStats(organizationId: bigint) {
  return fetchWithDrizzle(async (db) => {
    // Get counts
    const [studentCount, teacherCount, classCount, departmentCount] = await Promise.all([
      db.query.users.findMany({
        where: (users, { eq, and }) =>
          and(
            eq(users.organizationId, organizationId),
            eq(users.role, "student"),
            eq(users.isActive, true)
          ),
      }),
      db.query.users.findMany({
        where: (users, { eq, and }) =>
          and(
            eq(users.organizationId, organizationId),
            eq(users.role, "teacher"),
            eq(users.isActive, true)
          ),
      }),
      db.query.classes.findMany({
        where: (classes, { eq, and }) =>
          and(eq(classes.organizationId, organizationId), eq(classes.isActive, true)),
      }),
      db.query.departments.findMany({
        where: (departments, { eq, and }) =>
          and(eq(departments.organizationId, organizationId), eq(departments.isActive, true)),
      }),
    ]);

    return {
      totalStudents: studentCount.length,
      totalTeachers: teacherCount.length,
      totalClasses: classCount.length,
      totalDepartments: departmentCount.length,
    };
  });
}
