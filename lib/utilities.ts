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

export const generateContributorsOrder = async (storyId: string) => {
  const contributorsData = await getStoryInfoWithContributors(storyId);
  if (!contributorsData) {
    throw new Error(`Story ${storyId} not found`);
  }
  const newlyGeneratedContributorsOrder = contributorsData.contributors.map(
    (contrib) => contrib.id,
  );
  await prisma.story.update({
    where: {
      id: storyId,
    },
    data: {
      contributorOrder: newlyGeneratedContributorsOrder,
    },
  });
  return newlyGeneratedContributorsOrder;
};

// return the index position of user in story contributors list.
// requires target userID and either a story ID, or an array of contributor IDs.
// TODO: UPDATE TO REMOVE contributorsList requirement after all old stories have been updated.
export const getUserIndex = async (
  userId: string,
  contributorOrder: string[],
) => {
  return contributorOrder.indexOf(userId);
};

export const getNextContributor = (
  contributors: string[],
  currentUserId: string,
) => {
  const currentIndex = contributors.indexOf(currentUserId);
  if (currentIndex === -1) {
    // Current user not found in contributors list
    return contributors[0]; // Default to first contributor
  }
  const nextIndex = (currentIndex + 1) % contributors.length;
  return contributors[nextIndex];
};

export const isLastUserInRound = (userId: string, contributors: string[]) => {
  return contributors.at(-1) === userId;
};

export const setRoundNumber = (
  userId: string,
  contributors: string[],
  completedRounds: number,
) => {
  const isLastUserOfRound = isLastUserInRound(userId, contributors);
  if (isLastUserOfRound) {
    return completedRounds + 1;
  }
  return completedRounds;
};

export const updateContributors = (
  userId: string,
  contributors: { id: string }[],
) => {
  return new Set([...contributors, userId]);
};

export const getStoryInfoWithContributors = async (storyId: string) => {
  const storyData = await prisma.story.findUnique({
    where: { id: storyId },
    select: {
      title: true,
      createdById: true,
      contributors: true,
      contributorOrder: true,
      nextContributorId: true,
    },
  });
  return storyData;
};

export const getStoryPromptInfo = async (storyId: string) => {
  const storyPromptInfo = await prisma.story.findUnique({
    where: { id: storyId },
    select: {
      sharePrompt: true,
      promptImageUrl: true,
      promptText: true,
    },
  });
  return storyPromptInfo;
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
      likedBy: true,
    },
  });
  return segments;
};

export const checkForLastSegmentOfRound = async (
  storyId: string,
  userID: string,
) => {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: {
      content: {
        orderBy: { createdAt: "asc" },
        select: {
          authorId: true,
          createdAt: true,
        },
      },
      rounds: true,
      contributors: true,
      contributorOrder: true,
      completedRounds: true,
    },
  });
  const contribIds = story?.contributorOrder
    ? story.contributorOrder
    : [
        ...new Set(
          story?.content
            .slice(0, story.contributors.length)
            .map((segment) => segment.authorId),
        ),
      ];

  const userIndexPos = await getUserIndex(userID, contribIds);

  return userIndexPos === contribIds!.length - 1;
};
 

export const checkForLastSegment = async (  storyId: string) => {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: {
      content: {
        select: {
          id: true,
        },
      },
      rounds: true,
      maxTurns:true, 
      completedRounds: true,
    },
  });
  if (story) {    
    return (story.rounds === story.completedRounds + 1) && (story.content.length === story.maxTurns - 1);
  }
}