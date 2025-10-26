import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    home: "/",
    afterSignIn: "/auth/callback", // Check user status after sign in (handles OAuth)
    afterSignUp: "/auth/callback", // Process invitation code after signup
    afterSignOut: "/",
  },
});
