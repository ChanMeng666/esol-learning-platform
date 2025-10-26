"use server";

import { cookies } from "next/headers";

/**
 * Get value from cookie
 */
export async function getValueFromCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

/**
 * Set value to cookie
 */
export async function setValueToCookie(
  key: string,
  value: string,
  options: { path?: string; maxAge?: number } = {},
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: options.path ?? "/",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // default: 7 days
  });
}

/**
 * Get preference with type safety and validation
 */
export async function getPreference<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T
): Promise<T> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  const value = cookie ? cookie.value.trim() : undefined;
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/**
 * Set preference with validation
 */
export async function setPreference<T extends string>(
  key: string,
  value: T,
  allowed: readonly T[]
): Promise<boolean> {
  if (!allowed.includes(value)) {
    return false;
  }

  await setValueToCookie(key, value);
  return true;
}