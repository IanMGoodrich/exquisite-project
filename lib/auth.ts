import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "../app/generated/prisma/client";
import { username } from "better-auth/plugins";
import { getResetPasswordEmailHtml } from "./email-template";
import { resend, FROM_EMAIL } from "./resend";
const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({user, url}) => {
      try {
        const emailHtml = getResetPasswordEmailHtml(user.email, url);
        const {data, error} =await resend.emails.send({
          from: FROM_EMAIL!,
          to: user.email,  
          subject: "Reset your password",
          html: emailHtml,
        });
        if (error) {
          console.error("Error sending reset password email:", error);
          throw new Error("Failed to send reset password email");
        }
        console.log("Reset password email sent:", data);
      } catch (error) {
        console.error("Error sending reset password email:", error);
        throw new Error("Failed to send reset password email");
      } 
    },
  },
  plugins: [username()],
  secret: process.env.BETTER_AUTH_SECRET,
});
