import { NextRequest, NextResponse } from "next/server";
import { getNextContributor, checkNextRound } from "@/lib/utilities";
import prisma from "@/lib/prisma";

// Create Segment content
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string; storyId: string }> }
) {
  const params = await context.params;
  const currentUserId: string = params?.userId;
  const storyId: string = params?.storyId;

  if (!currentUserId || !storyId) {
    return NextResponse.json(
      { error: "Missing userId or storyId parameter" },
      { status: 400 }
    );
  }
  let body: {
    content?: string;
    authorId?: string;
    reveal?: string;
    storyId?: string;
    promptText?: string;
  };
  try {
    body = await request.json();
  } catch {
    console.error("Failed to parse JSON");
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // if request successful verify Segment elements
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const authorId =
    typeof body.authorId === "string" ? body.authorId.trim() : "";
  const reveal = typeof body.reveal === "string" ? body.reveal.trim() : "";
  const promptText = typeof body.promptText === "string" ? body.promptText.trim() : "";
  if (!content || !authorId) {
    console.error("Missing content or authorId:", { content, authorId });
    return NextResponse.json(
      { error: "Content and authorId are required" },
      { status: 400 }
    );
  }
  
  if (!reveal || reveal.length === 0) {
    console.error("Missing reveal text");
    return NextResponse.json(
      { error: "Reveal text is required" },
      { status: 400 }
    );
  }
  //if elements successfully verified create Segment 
  try {
    const segment = await prisma.segment.create({
      data: {
        content,
        authorId,
        storyId,
        reveal,
        promptText,
      },
    });

    // Fetch story
    try {
      const story = await prisma.story.findUnique({
        where: { id: storyId },
        select: {
          rounds: true,
          completedRounds: true,
          contributors: true,
          nextContributorId: true,
          content: true,
        },
      });
      if (!story) {
        return;
      }

      // if Story fetched determine next round, next Segment author, if isCompleted 
      // and update Story
      if (story !== null) {
        const totalRounds = story!.rounds;
        const completedRounds = story!.completedRounds;
        const contributors = story!.contributors.map((c) => c.id);
  
        const updatedNextContributor = getNextContributor(
          contributors,
          currentUserId
        );
        const updatedRoundsData = checkNextRound(
          completedRounds,
          totalRounds,
          contributors,
          updatedNextContributor!
        );
        const storyIsCompleted = updatedRoundsData >= totalRounds;
        await prisma.story.update({
          where: { id: storyId },
          data: {
            nextContributorId: updatedNextContributor,
            completedRounds: storyIsCompleted ? totalRounds : updatedRoundsData,
            completed: storyIsCompleted,
            completedAt: storyIsCompleted ? new Date() : null,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching story or updating:", error);
      return NextResponse.json(
        { error: "Failed to update story" },
        { status: 500 }
      );
    }
    return NextResponse.json({ segment }, { status: 201 });
  } catch (error) {
    console.error("Error creating segment:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the segment" },
      { status: 500 }
    );
  }
  
}
