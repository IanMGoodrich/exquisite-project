import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getNextContributor} from "@/lib/utilities";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 },
    );
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    storyId: string;
    userToRemoveId: string;
    variant?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }
  try {
    const story = await prisma.story.findUnique({
      where: { id: body.storyId },
      select: { 
        contributorOrder: true,
        completedRounds:true,
         createdById: true,
         rounds: true,
         maxTurns: true,
         nextContributorId: true,
         contributors: {
          select: { 
            id: true,
          } 
        },
      }
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (session.user.id !== userId) {
      if (session.user.id !== story.createdById)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (body.variant && typeof body.variant === "string") {
      if (body.variant === "leave") {
        if (story.contributorOrder.length > 1 ) {
          const verifiedNextContrib = story.nextContributorId === body.userToRemoveId
          ? getNextContributor(story.contributorOrder, body.userToRemoveId)
          : story.nextContributorId

          await prisma.story.update({
            where: { id: body.storyId },
            data: {
              contributorOrder: story.contributorOrder.filter(
                (id) => id !== body.userToRemoveId,
              ),
              nextContributorId: verifiedNextContrib,
              maxTurns: story.maxTurns - (story.rounds - story.completedRounds),
            },
          });
        } else {
           await prisma.story.delete ({
            where: { id: body.storyId },
          });
        }
      }
      if (body.variant === "remove") {
        if (story.contributors.length > 1) {
          await prisma.story.update({
            where: { id: body.storyId },
            data: {
              contributors: { disconnect: { id: body.userToRemoveId } },
              contributorOrder: story.contributorOrder.filter(
                (id) => id !== body.userToRemoveId,
              ),
            },
          });
        } else {
          await prisma.story.delete ({
            where: { id: body.storyId },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing contributor from story:", error);
    return NextResponse.json(
      { error: "Failed to leave story" },
      { status: 500 },
    );
  }
}
