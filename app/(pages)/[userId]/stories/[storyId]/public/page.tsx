import prisma from "../../../../../../lib/prisma";
import StoryDisplay from "@/components/storyDisplay/storyDisplay";
type Props = {
  params: Promise<{ userId: string; storyId: string }>;
};

export default async function PublicStoryPage({ params }: Props) {
  const { userId, storyId } = await params;
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: {
      title: true,
      id: true,
      content: {
        select: {
          id: true,
          content: true,
          authorId: true,
          storyId: true,
          createdAt: true,
          reveal: true,
          promptText: true,
          likedBy: { select: { userId: true, userName: true, email: true } },
        },
      },
      contributors: true,
      createdAt: true,
      createdById: true,
      completed: true,
      rounds: true,
      completedAt: true,
      completedRounds: true,
      nextContributorId: true,
      acknowledged: true,
      isPublic: true,
    },
  });

  return (
    <main className="story-main-page page main story">
      {story && story?.completed && (
        <StoryDisplay userId={userId} storyData={story} isCreator={false} />
      )}
    </main>
  );
}
