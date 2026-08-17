import { createAuthClient } from "better-auth/client";

const authUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const betterAuthClient = createAuthClient({
  baseURL: authUrl,
});

export const { useSession, signIn, signOut, signUp } = betterAuthClient;
