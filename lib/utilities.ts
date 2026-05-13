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

export const setRoundNumber = (
  segmentCount: number,
  contributors: string[],
) => {
  const contributorCount =  contributors.length;

  if (segmentCount < contributors.length) {
    return 1;
  }
  if(segmentCount % contributorCount === 0 ) {
    return ((segmentCount / contributorCount) + 1); 
  }  
  return Math.ceil(segmentCount/contributorCount)
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
      likedBy:true,
    },
  });
  return segments;
};

export const checkForLastSegment = async (storyId: string) => {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: {
      content: true,
      rounds: true,
      contributors:true,
    }
  })
  if (story) {
    return story.content.length === (story.contributors.length * story.rounds -1);
  }
}