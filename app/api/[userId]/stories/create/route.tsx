import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/utilities";

// CREATE NEW STORY
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params;
  const currentUserId: string = params?.userId;
  const user = await getUser(currentUserId);
  
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

  const titleFallback = user ? `${user.userName} Untitled #${user.stories.length + 1}` : 'untitled';
  const title = (typeof body.title === "string" && body.title.length )? body.title.trim() : titleFallback;
  
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
        createdById: currentUserId,
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
