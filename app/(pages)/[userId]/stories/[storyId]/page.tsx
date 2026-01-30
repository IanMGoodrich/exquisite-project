import prisma from "../../../../../lib/prisma";
import Link from "next/link";
import StoryDisplay from "@/app/components/storyDisplay/storyDisplay";
type Props = {
  params: Promise<{ userId: string; storyId: string }>;
};

export default async function StoryPage({ params }: Props) {
  const { userId, storyId } = await params;
  let nextUserName: string;

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
          likedBy: { select: { userId: true } },
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
    },
  });
  if (
    story &&
    !story.completed &&
    story.nextContributorId &&
    story.nextContributorId !== userId
  ) {
    const nextUser = await prisma.user.findUnique({
      where: { id: story.nextContributorId },
      select: {
        userName: true,
      },
    });
    nextUserName = typeof nextUser === "string" ? nextUser : "the next person";
  }
  const isCreator = userId === story?.createdById;

  const inProgressTemplate = () => {
    return (
      <div className="in-progress--wrapper">
        <div>
          <h1>{story?.title}</h1>
        </div>
        <h2>This story in still a work in progress</h2>
        <p>
          Round:
          <span>
            {story?.completedRounds ? story.completedRounds : 0}/
            {story?.rounds.toString()}
          </span>
        </p>
        {story?.nextContributorId === userId ? (
          <Link href={`${storyId}/update`}> Your turn!</Link>
        ) : (
          <p>Waiting on {nextUserName}</p>
        )}
      </div>
    );
  };

  console.log("Story page story data", story);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "1rem" }}>
      {story && story?.completed ? (
        <StoryDisplay userId={userId} storyData={story} isCreator={isCreator} />
      ) : (
        inProgressTemplate()
      )}
    </main>
  );
}
