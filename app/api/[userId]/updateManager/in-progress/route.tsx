import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const sessionId = session?.user.id;
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (userId !== sessionId) {
      return NextResponse.json(
        { error: "Not Authorized User" },
        { status: 400 },
      );
    }

    const data = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        stories: {
          where: { completed: false },
          select: {
            completed: true,
            title: true,
            nextContributorId: true,
            id: true,
            acknowledged: true,
            createdAt: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(data.stories ?? []);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch update data" },
      { status: 500 },
    );
  }
}