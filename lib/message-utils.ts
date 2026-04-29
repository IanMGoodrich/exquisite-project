import prisma from "@/lib/prisma";

const MAX_REPLY_DEPTH = 3;

/**
 * Validates that a reply doesn't exceed maximum nesting depth
 * Counts parent chain: grandparent -> parent -> current -> proposed child
 */
export async function validateReplyDepth(
  parentMessageId: string | null | undefined,
  maxDepth: number = MAX_REPLY_DEPTH
): Promise<{ valid: boolean; depth: number; error?: string }> {
  if (!parentMessageId) {
    return { valid: true, depth: 0 };
  }

  let depth = 1;
  let currentMessageId: string | null = parentMessageId;

  try {
    while (currentMessageId && depth <= maxDepth) {
      const message: { parentMessageId: string | null } | null = await prisma.message.findUnique({
        where: { id: currentMessageId },
        select: { parentMessageId: true },
      });

      if (!message) {
        return {
          valid: false,
          depth,
          error: "Parent message not found",
        };
      }

      if (!message.parentMessageId) {
        // Reached root message
        return { valid: true, depth };
      }

      currentMessageId = message.parentMessageId;
      depth++;
    }

    if (depth > maxDepth) {
      return {
        valid: false,
        depth,
        error: `Reply nesting exceeds maximum depth of ${maxDepth} levels`,
      };
    }

    return { valid: true, depth };
  } catch (error) {
    return {
      valid: false,
      depth,
      error: "Error validating reply depth",
    };
  }
}

/**
 * Get reply count without fetching entire message trees
 * Useful for showing "5 replies" badges
 */
export async function getReplyCount(messageId: string): Promise<number> {
  const result = await prisma.message.count({
    where: {
      parentMessageId: messageId,
      deleted: false,
    },
  });
  return result;
}

/**
 * Get all ancestor messages (parents, grandparents, etc.)
 * Useful for displaying breadcrumb/context in UI
 */
export async function getMessageAncestors(
  messageId: string
): Promise<Array<{ id: string; content: string; createdAt: Date }>> {
  const ancestors: Array<{ id: string; content: string; createdAt: Date }> =
    [];
  let currentMessageId: string | null = messageId;

  while (currentMessageId) {
    const message: { id: string; parentMessageId: string | null; content: string; createdAt: Date } | null = await prisma.message.findUnique({
      where: { id: currentMessageId },
      select: {
        id: true,
        parentMessageId: true,
        content: true,
        createdAt: true,
      },
    });

    if (!message) break;

    ancestors.unshift({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
    });

    currentMessageId = message.parentMessageId;
  }

  return ancestors;
}

/**
 * Fetch a specific page of replies with context
 * Useful when deeplinked to a nested reply (Reddit-style)
 */
export async function getRepliesWithContext(
  messageId: string,
  page: number = 1,
  pageSize: number = 10
) {
  const offset = (page - 1) * pageSize;

  // Get the target message
  const targetMessage = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      sender: { select: { id: true, userName: true, image: true } },
      parentMessage: {
        select: { id: true, content: true, sender: true },
      },
    },
  });

  // Get its replies with pagination
  const replies = await prisma.message.findMany({
    where: {
      parentMessageId: messageId,
      deleted: false,
    },
    include: {
      sender: { select: { id: true, userName: true, image: true } },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "asc" },
    take: pageSize,
    skip: offset,
  });

  // Get total count for pagination UI
  const totalReplies = await prisma.message.count({
    where: {
      parentMessageId: messageId,
      deleted: false,
    },
  });

  return {
    targetMessage,
    replies,
    pagination: {
      page,
      pageSize,
      totalReplies,
      totalPages: Math.ceil(totalReplies / pageSize),
    },
  };
}

/**
 * Soft-delete a message and optionally its entire reply thread
 * Setting cascadeDelete true will delete all nested replies
 */
export async function deleteMessage(
  messageId: string,
  cascadeDelete: boolean = false
) {
  if (cascadeDelete) {
    // Find all descendant messages recursively
    const messageIds = await getAllDescendants(messageId);
    messageIds.push(messageId);

    // Soft delete all
    return await prisma.message.updateMany({
      where: { id: { in: messageIds } },
      data: { deleted: true },
    });
  } else {
    // Just soft-delete this message
    return await prisma.message.update({
      where: { id: messageId },
      data: { deleted: true },
    });
  }
}

export async function getAllDescendants(messageId: string): Promise<string[]> {
  const descendants: string[] = [];
  const queue: string[] = [messageId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const children: { id: string }[] = await prisma.message.findMany({
      where: { parentMessageId: currentId },
      select: { id: true },
    });

    for (const child of children) {
      descendants.push(child.id);
      queue.push(child.id);
    }
  }

  return descendants;
}
