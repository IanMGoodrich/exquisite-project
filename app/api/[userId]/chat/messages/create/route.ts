import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth-utils";
import { validateReplyDepth } from "@/lib/message-utils";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params;
  const requestedUserId = params?.userId;

  // ✅ 1. Validate user parameter exists
  if (!requestedUserId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 }
    );
  }

  // ✅ 2. Authenticate user (verify they own this userId)
  const authenticatedUserId = await getAuthenticatedUserIdFromRequest(
    request,
    requestedUserId
  );
  if (!authenticatedUserId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // ✅ 3. Parse & validate request body
  let body: { content: string; parentMessageId?: string; threadId: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // ✅ 4. Validate required fields
  if (!body.content || typeof body.content !== "string" || !body.content.trim()) {
    return NextResponse.json(
      { error: "Message content is required" },
      { status: 400 }
    );
  }

  if (!body.threadId) {
    return NextResponse.json(
      { error: "threadId is required" },
      { status: 400 }
    );
  }

  try {
    // ✅ 5. If replying to a message, validate depth
    if (body.parentMessageId) {
      const depthValidation = await validateReplyDepth(body.parentMessageId);
      if (!depthValidation.valid) {
        return NextResponse.json(
          { error: depthValidation.error },
          { status: 400 }
        );
      }
    }

    // ✅ 6. Verify thread exists and user is a participant
    const thread = await prisma.messageThread.findUnique({
      where: { threadId: body.threadId },
      include: { participants: { select: { id: true } } },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    const isParticipant = thread.participants.some(
      (p) => p.id === authenticatedUserId
    );

    if (!isParticipant) {
      return NextResponse.json(
        { error: "You are not a participant in this thread" },
        { status: 403 }
      );
    }

    const participantIds = thread.participants.map(user => user.id);

    // ✅ 7. Create the reply message
    const reply = await prisma.message.create({
      data: {
        senderId: authenticatedUserId,
        threadId: body.threadId,
        content: body.content.trim(),
        parentMessageId: body.parentMessageId || null,
        recipientIds: participantIds, // Can be populated based on thread participants
        readByRecipientIds: [authenticatedUserId], // Sender has read it
      },
      include: {
        sender: {
          select: { id: true, userName: true, image: true },
        },
      },
    });

    console.log('HERE',reply);
    
    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("Error creating message reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
