import prisma from "../../../../../lib/prisma";
import Link from "next/link";

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
      content: true,
      contributors: true,
      completed: true,
      rounds: true,
      completedAt: true,
      completedRounds: true,
      nextContributorId: true,
    },
  });
  if (story && story.nextContributorId && story.nextContributorId !== userId) {
    const nextUser = await prisma.user.findUnique({
      where: { id: story.nextContributorId },
      select: {
        userName: true,
      },
    });
    nextUserName = typeof nextUser === "string" ? nextUser : "the next person";
  }

  const inProgressTemplate = () => {
    return (
      <div className="in-progress--wrapper">
        <h2>This story in still a work in progress</h2>
        <p>
          Round:
          <span>
            {story?.completedRounds? story.completedRounds : 0}/{story?.rounds.toString()}
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

  const completedStoryTemplate = () => {
    return (
      <div className="completed--wrapper">
        {story?.content &&
          story.content.length > 0 &&
          story.content.map((segment) => (
            <p key={segment.id}>{segment.content}</p>
          ))}
      </div>
    );
  };

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "1rem" }}>
      <h1>{story?.title}</h1>
      {story?.completed ? completedStoryTemplate() : inProgressTemplate()}
    </main>
  );
}
