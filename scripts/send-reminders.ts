import "dotenv/config"; // if your local vars are in .env.local, load that path instead
import { Resend } from "resend";
import { PrismaClient } from "../app/generated/prisma/client";
import { runReminders } from "../lib/reminders/run";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const summary = await runReminders({
      prisma,
      resend: new Resend(requireEnv("RESEND_API_KEY")),
      from: `Exquisite Corpse <${requireEnv("RESEND_YOUR_TURN_EMAIL_PROD")}>`,
      appUrl: requireEnv("PROD_AUTH_URL"), // or whichever var holds your site URL
      dryRun: process.env.DRY_RUN === "true",
    });
    console.log("[reminders] finished", summary);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("[reminders] fatal error", err);
  process.exit(1);
});
