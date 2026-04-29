import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// CREATE NEW THREAD + INITIAL MESSAGE
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

  let body: { subject?: string; participantIds: string[]; message: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // Validate participantIds is an array with at least one participant
  if (!Array.isArray(body.participantIds) || body.participantIds.length === 0) {
    return NextResponse.json(
      { error: "participantIds must be a non-empty array" },
      { status: 400 }
    );
  }

  // Validate message content
  if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
    return NextResponse.json(
      { error: "Message content is required" },
      { status: 400 }
    );
  }

  try {
    // Deduplicate participants (include sender automatically) 
    // MAY NOT BE NEEDED IF AUTO COMPLETE WORKS
    const uniqueParticipantIds = Array.from(
      new Set([currentUserId, ...body.participantIds])
    );

    // Validate all participant IDs exist and fetch their userNames for subject
    const participants = await prisma.user.findMany({
      where: { id: { in: uniqueParticipantIds } },
      select: { id: true, userName: true }
    });

    if (participants.length !== uniqueParticipantIds.length) {
      return NextResponse.json(
        { error: "One or more participant IDs do not exist" },
        { status: 400 }
      );
    }

    // Handle empty Subject line
    const participantNames = participants
      .filter(user => user.id !== currentUserId)
      .map(user => user.userName || "Unknown User")
      .join(", ");
    
    const subject = 
      (typeof body.subject === "string" && body.subject.trim())
        ? body.subject.trim()
        : `Chat with ${participantNames}`;

    // Create thread with participants and first message in one operation
    const thread = await prisma.messageThread.create({
      data: {
        subject,
        participants: {
          connect: uniqueParticipantIds.map(id => ({ id }))
        },
        messages: {
          create: {
            senderId: currentUserId,
            content: body.message.trim(),
            recipientIds: body.participantIds 
          }
        }
      },
      include: {
        participants: {
          select: { id: true, name: true, userName: true, image: true }
        },
        messages: true
      }
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}