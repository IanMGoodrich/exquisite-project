import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// CREATE NEW STORY
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params;
  const currentUserId: string = params?.userId;
  
  if (!currentUserId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 }
    );
  }

  let body: { title?: string; contributorIds?: string[], rounds: number};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const contributorIds: string[] = Array.isArray(body.contributorIds)
    ? body.contributorIds.filter((id): id is string => typeof id === "string")
    : [];
  const uniqueIds = Array.from(new Set([currentUserId, ...contributorIds]));

  const rounds = body.rounds
  
  try {
    const story = await prisma.story.create({
      data: {
        title,
        rounds,
        contributors: {
          connect: uniqueIds.map((id) => ({ id })),
        },
        nextContributorId: currentUserId,
      },
      include: {
        contributors: {
          select: {
            id: true,
            userName: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(story, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create story" },
      { status: 500 }
    );
  }
}
