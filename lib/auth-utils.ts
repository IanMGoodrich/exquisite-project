import prisma from "./prisma";
import { auth } from "./auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { type UserType } from "./types";
import { type NextRequest } from "next/server";

/**
 * Verify user is authenticated and authorized for the requested userId
 * Returns user data matching the User type (stories as string[])
 * Used in: ProfilePage
 */
export async function getAuthenticatedUser(
  requestedUserId: string
): Promise<UserType> {
  // Check auth first - fail fast if unauthorized
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: change to reroute to users public facing page.
  if (!session?.user?.id || session.user.id !== requestedUserId) {
    redirect("/");
  }

  // Fetch user data with story IDs only
  const user = await prisma.user.findUnique({
    where: { id: requestedUserId },
    select: {
      id: true,
      email: true,
      nameFirst: true,
      nameLast: true,
      userName: true,
      phone: true,
      image: true,
      profileColumnOne: true,
      profileColumnTwo: true,
      stories: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Transform to User type
  return {
    ...user,
    stories: user.stories.map((story) => story.id),
  };
}

/**
 * Verify user is authenticated and authorized, returns user with full story objects
 * Used in: UserHomePage where full story details (title, etc.) are needed
 */
export async function getAuthenticatedUserWithStories(
  requestedUserId: string
) {
  // Check auth first - fail fast if unauthorized
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id || session.user.id !== requestedUserId) {
    redirect("/");
  }

  // Fetch user data with full story objects
  const user = await prisma.user.findUnique({
    where: { id: requestedUserId },
    select: {
      id: true,
      email: true,
      nameFirst: true,
      nameLast: true,
      userName: true,
      phone: true,
      image: true,
      stories: true,
      profileColumnOne: true,
      profileColumnTwo: true,
      messageThreads: {
        include: {
          messages: {
            // Only fetch root-level messages (not replies)
            where: {
              parentMessageId: null,
              deleted: false,
            },
            include: {
              sender: {
                select: { id: true, userName: true, image: true },
              },
              replies: {
                where: { deleted: false },
                include: {
                  sender: {
                    select: { id: true, userName: true, image: true },
                  },
                  // Replies to replies (level 2)
                  replies: {
                    where: { deleted: false },
                    include: {
                      sender: {
                        select: { id: true, userName: true, image: true },
                      },
                      // Replies to replies to replies (level 3 - max depth)
                      replies: {
                        where: { deleted: false },
                        include: {
                          sender: {
                            select: { id: true, userName: true, image: true },
                          },
                          // Replies to replies to replies to replies (level 4)
                          replies: {
                            where: { deleted: false },
                            include: {
                              sender: {
                                select: { id: true, userName: true, image: true },
                              },
                              // Replies to replies to replies to replies to replies (level 5)
                              replies: {
                                where: { deleted: false },
                                include: {
                                  sender: {
                                    select: { id: true, userName: true, image: true },
                                  },
                                  // Replies to replies to replies to replies to replies to replies (level 6)
                                  replies: {
                                    where: { deleted: false },
                                    include: {
                                      sender: {
                                        select: { id: true, userName: true, image: true },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
          participants: {
            select: { id: true, userName: true, image: true },
          },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return user;
}


/**
 * Fetch public facing User info from different authenticated User.
 */
export async function getUserPublicInfo(
  requestedUserId: string
) {
  // Check auth first - fail fast if unauthorized
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (!session?.user?.id) {
    redirect("/");
  }

  // Fetch user data with full story objects
  const user = await prisma.user.findUnique({
    where: { id: requestedUserId },
    select: {
      email: true,
      userName: true,
      image: true,
      stories: {
        where: {
          completed: true, 
          isPublic: true,
        }
      },
      profileColumnOne: true,
      profileColumnTwo: true,
    },
  });

  if (!user) {
    notFound();
  }  
  return user;
}

/**
 * Verify user is authenticated and authorized for API routes
 * Returns user ID or null if unauthorized (safe for API routes - no redirects)
 * Used in: API route handlers that need auth validation
 */
export async function getAuthenticatedUserIdFromRequest(
  request: NextRequest,
  requestedUserId: string
): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Verify session exists and user owns the requested userId
    if (!session?.user?.id || session.user.id !== requestedUserId) {
      return null;
    }

    return session.user.id;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}
