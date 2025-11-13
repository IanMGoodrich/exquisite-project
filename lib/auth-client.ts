import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.PROD_AUTH_URL || process.env.DEV_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signUp, resetPassword, useSession, signOut, forgetPassword } = createAuthClient();
