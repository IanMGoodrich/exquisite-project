import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import prisma from "./prisma";
import { getResetPasswordEmailHtml } from "./email-template";
import { resend, FROM_EMAIL } from "./resend";

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

      } catch (error) {
        console.error("Error sending reset password email:", error);
        throw new Error("Failed to send reset password email");
      } 
    },
  },
  plugins: [username()],
  secret: process.env.BETTER_AUTH_SECRET,
});
