import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Update Completed Story
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string; storyId: string }> },
) {
  const params = await context.params;
  const currentUserId: string = params?.userId;
  const storyId: string = params?.storyId;

  if (!currentUserId || !storyId) {
    console.error("Missing required authorization or IDs");
    return NextResponse.json(
      { error: "Story ID and Author ID are required" },
      { status: 400 },
    );
  }
  let body: {
    title: string;
    isPublic: string[];
  };

  try {
    body = await request.json();
  } catch {
    console.error("Failed to parse JSON");
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  // If request successful
  try {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: {
        content: true,
      },
    });
    if (!story) {
      return;
    }
    if (story !== null) {
      await prisma.story.update({
        where: { id: storyId },
        data: {
          title: body.title,
          isPublic: body.isPublic,
        },
      });
    }
    return NextResponse.json({ story }, { status: 201 });
  } catch (error) {
    console.error("Error fetching story or updating:", error);
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string; storyId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const sessionId = session?.user.id;
    const params = await context.params;
    const { userId, storyId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (userId !== sessionId) {
      return NextResponse.json(
        { error: "Not Authorized User" },
        { status: 400 },
      );
    }
    const data = await prisma.story.findUnique({
      where: { id: storyId },
      select: {
        completedRounds: true,
        content: {
          where: {
            authorId: userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!data) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (data.completedRounds !== 0) {
      return NextResponse.json(data.content);
    }
    return NextResponse.json({ data: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch story data" },
      { status: 500 },
    );
  }
}
