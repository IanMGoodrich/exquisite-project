import { PrismaClient, Prisma } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice Goasker",
    email: "alice@prisma.io",
    phone: 503-555-1234,
    nameFirst: "Alice",
    nameLast: "Goasker",
    userName: "WonderLander",
  },
  {
    name: "Bob Burger",
    email: "bob@prisma.io",
    phone: 541-555-5678,
    nameFirst: "Bob",
    nameLast: "Burger",
    userName: "SpecialOTheDay",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();