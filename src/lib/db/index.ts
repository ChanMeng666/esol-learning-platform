import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { stackServerApp } from "@/lib/stack";
import * as schema from "./schema";

/**
 * Execute a database query with automatic user authentication
 * This helper ensures all queries are scoped to the authenticated user
 */
export async function fetchWithDrizzle<T>(
  callback: (
    db: ReturnType<typeof drizzle<typeof schema>>,
    context: { userId: string }
  ) => Promise<T>
): Promise<T> {
  const user = await stackServerApp.getUser();
  
  if (!user?.id) {
    throw new Error("Unauthorized: User must be logged in");
  }

  const db = drizzle(neon(process.env.DATABASE_URL!), { schema });
  
  return callback(db, { userId: user.id });
}
