import prisma from "@/lib/prisma";

export const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nameFirst: true,
      nameLast: true,
      userName: true,
      stories: true,
      image: true,
      phone: true,
    },
  });
  return user;
};

export const getNextContributor = (
  contributors: string[],
  currentUserId: string
) => {
  const currentIndex = contributors.indexOf(currentUserId);
  if (currentIndex === -1) {// Current user not found in contributors list
    return contributors[0];  // Default to first contributor
  }
  const nextIndex = (currentIndex + 1) % contributors.length;
  return contributors[nextIndex];
};

export const checkNextRound = (
  completedRounds: number,
  totalRounds: number,
  contributors: string[],
  nextContributorId: string
) => {
  const nextUserIndex = contributors.indexOf(nextContributorId);  
  if (nextUserIndex !== 0) {
    return completedRounds;
  } else {
    return completedRounds + 1;
  }
};

export const getStorySegments = async (storyId: string) => {
  const segments = await prisma.segment.findMany({
    where: { storyId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      authorId: true,
      reveal: true,
      createdAt: true,
    },
  });
  return segments;
};