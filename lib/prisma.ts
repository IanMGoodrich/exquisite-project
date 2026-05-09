import { PrismaClient } from "../app/generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

console.log("!!!!!DATABASE_URL protocol:", process.env.DATABASE_URL?.split("://")[0]);
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
