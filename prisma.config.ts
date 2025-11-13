import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // seed with user data for testing
    seed: `tsx prisma/seed.ts`,
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
