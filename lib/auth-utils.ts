import prisma from "./prisma";
import { auth } from "./auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { type UserType } from "./types";

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
    },
  });

  if (!user) {
    notFound();
  }

  return user;
}
