import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getNextContributor, setRoundNumber } from "@/lib/utilities";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string; storyId: string }> },
) {
  const { userId, storyId } = await context.params;

  if (!userId || !storyId) {
    return NextResponse.json(
      { error: "Missing userId or storyId parameter" },
      { status: 400 },
    );
  }

  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: {
      rounds: true,
      completedRounds: true,
      contributorOrder: true,
      maxTurns: true,
      contributors:{
        select: {
          id: true,
        }
      },
      nextContributorId: true,
      content: true,
    },
  });
  
  if (!story) {    
    return NextResponse.json(
      { error: "Story not found" },
      { status: 404 },
    );
  }

  if (story.nextContributorId !== userId) {
    return NextResponse.json(
      { error: "It is not this user's turn" },
      { status: 403 },
    );
  }

  let body: {
    content?: string;
    authorId?: string;
    reveal?: string;
    promptText?: string;
  };
  
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  const authorId =
    typeof body.authorId === "string" ? body.authorId.trim() : "";
  const reveal =
    typeof body.reveal === "string" ? body.reveal.trim() : "";
  const promptText =
    typeof body.promptText === "string" ? body.promptText.trim() : "";

  if (!content) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 },
    );
  }

  if (!authorId) {
    return NextResponse.json(
      { error: "authorId is required" },
      { status: 400 },
    );
  }

  if (authorId !== userId) {
    return NextResponse.json(
      { error: "authorId must match the current user" },
      { status: 403 },
    );
  }

  const isFinalSegment = story.content.length === (story.maxTurns -1);
  
  if (!isFinalSegment && reveal.length === 0) {
    return NextResponse.json(
      { error: "Reveal text is required" },
      { status: 400 },
    );
  }

  try {
    const segment = await prisma.$transaction(async (tx) => {
      const createdSegment = await tx.segment.create({
        data: {
          content,
          authorId,
          storyId,
          reveal,
          promptText,
        },
      });

      const updatedNextContributor = getNextContributor(
        story.contributorOrder,
        userId,
      );

      const updatedRoundsData = setRoundNumber(
        userId,
        story.contributorOrder,
        story.completedRounds,
      );
      
      const storyIsCompleted = story.rounds === updatedRoundsData;
      
      await tx.story.update({
        where: { id: storyId },
        data: {
          nextContributorId: updatedNextContributor,
          completedRounds: updatedRoundsData,
          completed: storyIsCompleted,
          completedAt: storyIsCompleted ? new Date() : null,
          turnStartedAt: new Date(),
          remindersSent: 0,
        },
      });

      return createdSegment;
    });

    return NextResponse.json({ segment }, { status: 201 });
  } catch (error) {
    console.error(`Error creating segment or updating story: ${error}`);
    return NextResponse.json(
      { error: "Failed to create segment" },
      { status: 500 },
    );
  }
}