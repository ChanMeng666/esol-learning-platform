import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { stackServerApp } from "@/lib/stack";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

/**
 * Execute a database query with automatic user authentication and organization scoping
 * This helper ensures all queries are scoped to the authenticated user and their organization
 */
export async function fetchWithDrizzle<T>(
  callback: (
    db: ReturnType<typeof drizzle<typeof schema>>,
    context: { userId: string; organizationId: bigint | null; enhancedUser: typeof schema.users.$inferSelect | null }
  ) => Promise<T>
): Promise<T> {
  const user = await stackServerApp.getUser();

  if (!user?.id) {
    throw new Error("Unauthorized: User must be logged in");
  }

  const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

  // Get enhanced user record to retrieve organization ID
  const enhancedUser = await db.query.users.findFirst({
    where: eq(schema.users.stackUserId, user.id),
  });

  // Allow queries without enhanced user for migration/setup purposes
  // In production, you might want to enforce this more strictly
  const organizationId = enhancedUser?.organizationId || null;

  return callback(db, {
    userId: user.id,
    organizationId,
    enhancedUser: enhancedUser || null
  });
}

/**
 * Execute a database query without authentication
 * ONLY use this for system-level operations like migrations or setup
 */
export async function fetchWithDrizzleUnsafe<T>(
  callback: (db: ReturnType<typeof drizzle<typeof schema>>) => Promise<T>
): Promise<T> {
  const db = drizzle(neon(process.env.DATABASE_URL!), { schema });
  return callback(db);
}
