import { createAuthClient } from "better-auth/react";

const authUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: authUrl,
  fetchOptions: {
    credentials: "include",
  },
});

export const { useSession, signIn, signOut, signUp, getSession } = authClient;
export default authClient;
