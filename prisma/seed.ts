import { PrismaClient, Prisma } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    phone: 555-1234,
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    phone: 555-5678,
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();