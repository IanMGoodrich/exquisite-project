import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
