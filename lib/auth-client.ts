import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL:
    process.env.PROD_AUTH_URL ||
    process.env.DEV_AUTH_URL ||
    "http://localhost:3000",
  plugins: [usernameClient()],
});

export const {
  signIn,
  signUp,
  resetPassword,
  useSession,
  signOut,
  forgetPassword,
  getSession,
} = createAuthClient();
