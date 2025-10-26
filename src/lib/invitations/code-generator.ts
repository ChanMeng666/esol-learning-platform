/**
 * Invitation Code Generation Utilities
 * Generates secure, human-readable invitation codes
 */

import crypto from "crypto";
import type { UserRole } from "@/lib/auth/permissions";

export type InvitationCodeType = "organization_general" | "teacher_specific" | "parent_specific";

export interface GenerateCodeOptions {
  role: UserRole;
  type: InvitationCodeType;
  organizationSlug?: string;
  customPrefix?: string;
  length?: number;
}

/**
 * Generate a human-readable invitation code
 * Format: PREFIX-RANDOM-CHECKSUM
 *
 * Examples:
 * - SCHOOL-ABC123-X7
 * - TEACHER-DEF456-Y2
 * - PARENT-GHI789-Z5
 */
export function generateInvitationCode(options: GenerateCodeOptions): string {
  const {
    role,
    type,
    organizationSlug,
    customPrefix,
    length = 6,
  } = options;

  // Determine prefix based on role and type
  let prefix: string;

  if (customPrefix) {
    prefix = customPrefix.toUpperCase();
  } else if (type === "organization_general") {
    prefix = organizationSlug?.toUpperCase().substring(0, 8) || "SCHOOL";
  } else if (role === "teacher") {
    prefix = "TEACHER";
  } else if (role === "parent") {
    prefix = "PARENT";
  } else if (role === "student") {
    prefix = "STUDENT";
  } else {
    prefix = role.toUpperCase().replace("_", "");
  }

  // Generate random alphanumeric string (excluding ambiguous characters: 0, O, I, l)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    randomPart += chars[randomBytes[i] % chars.length];
  }

  // Generate checksum (simple modulo 36 for single character)
  const checksum = generateChecksum(prefix + randomPart);

  // Combine: PREFIX-RANDOM-CHECKSUM
  return `${prefix}-${randomPart}-${checksum}`;
}

/**
 * Generate a checksum character for validation
 */
function generateChecksum(input: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    sum += input.charCodeAt(i);
  }

  return chars[sum % chars.length];
}

/**
 * Validate invitation code format and checksum
 * @returns true if code format is valid
 */
export function validateCodeFormat(code: string): boolean {
  // Expected format: PREFIX-XXXXXX-C
  const parts = code.toUpperCase().split("-");

  if (parts.length !== 3) {
    return false;
  }

  const [prefix, random, checksum] = parts;

  // Validate prefix (at least 2 characters)
  if (prefix.length < 2) {
    return false;
  }

  // Validate random part (at least 4 characters)
  if (random.length < 4) {
    return false;
  }

  // Validate checksum (single character)
  if (checksum.length !== 1) {
    return false;
  }

  // Verify checksum
  const expectedChecksum = generateChecksum(prefix + random);
  if (checksum !== expectedChecksum) {
    return false;
  }

  return true;
}

/**
 * Generate a batch of invitation codes
 * Useful for creating multiple codes at once
 */
export function generateBatchCodes(
  count: number,
  options: GenerateCodeOptions
): string[] {
  const codes = new Set<string>();

  while (codes.size < count) {
    const code = generateInvitationCode(options);
    codes.add(code);
  }

  return Array.from(codes);
}

/**
 * Parse invitation code to extract information
 */
export function parseInvitationCode(code: string): {
  prefix: string;
  random: string;
  checksum: string;
  valid: boolean;
} {
  const parts = code.toUpperCase().split("-");

  if (parts.length !== 3) {
    return {
      prefix: "",
      random: "",
      checksum: "",
      valid: false,
    };
  }

  const [prefix, random, checksum] = parts;
  const valid = validateCodeFormat(code);

  return {
    prefix,
    random,
    checksum,
    valid,
  };
}

/**
 * Generate organization-wide student invitation code
 * This is the most common type - allows unlimited student registrations
 */
export function generateStudentCode(organizationSlug: string): string {
  return generateInvitationCode({
    role: "student",
    type: "organization_general",
    organizationSlug,
    length: 8,
  });
}

/**
 * Generate teacher-specific invitation code
 * One-time or limited use
 */
export function generateTeacherCode(customPrefix?: string): string {
  return generateInvitationCode({
    role: "teacher",
    type: "teacher_specific",
    customPrefix,
    length: 6,
  });
}

/**
 * Generate parent invitation code
 * One-time use, linked to specific student later
 */
export function generateParentCode(): string {
  return generateInvitationCode({
    role: "parent",
    type: "parent_specific",
    length: 6,
  });
}
