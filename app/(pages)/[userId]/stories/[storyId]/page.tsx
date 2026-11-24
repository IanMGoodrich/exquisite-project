import prisma from "../../../../../lib/prisma";
import Button from "@/components/button/button";
import StoryDisplay from "@/components/storyDisplay/storyDisplay";
import { checkForLastSegment } from "@/lib/utilities";
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
          promptText: true,
          peeked: true,
          likedBy: { select: { userId: true, userName: true, email: true } },
        },
      },
      contributors: true,
      contributorOrder: true,
      createdAt: true,
      createdById: true,
      completed: true,
      rounds: true,
      maxTurns: true,
      completedAt: true,
      completedRounds: true,
      nextContributorId: true,
      isPublic: true,
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
    nextUserName =
      nextUser && nextUser.userName ? nextUser.userName : "the next person";
  }
  if (story) {
    const isCreator = userId === story.createdById;
    const isFinalRound = story?.rounds === story.completedRounds + 1;
    const isFinalSegment = await checkForLastSegment(storyId);

    const getRoundText = () => {
      if (isFinalSegment) {
        return "You get to write the ending!";
      }
      if (isFinalRound) {
        return "This is the final round!";
      }
      return "Your turn!";
    };
    const contributorTemplate = () => {
      if (!story.contributors || !story.contributorOrder) return null;

      return story.contributors

        .filter((contrib) => contrib.id !== userId).filter((contrib) => story.contributorOrder.includes(contrib.id))
        .map((contrib) => (
          <li key={contrib.id} className="in-progress--contributor">
            <a href={`/${userId}/${contrib.id}/public`}>{contrib.userName}</a>
          </li>
        ));
    };

    const inProgressTemplate = () => {
      return (
        <div className="in-progress--wrapper">
          <h1>{story?.title}</h1>
          <p className="in-progress--label">Contributors</p>
          <ul className="in-progress--contributor-list">
            {contributorTemplate()}
          </ul>
          <h2>This story in still a work in progress</h2>
          <p>
            Round:&nbsp;
            <span>
              {story.completedRounds ? `${story.completedRounds + 1}` : 1}
              &nbsp;of&nbsp;
              {story.rounds.toString()}
            </span>
          </p>
          {story?.nextContributorId === userId ? (
            <Button
              classes="your-turn"
              el="link"
              as="button"
              href={`${storyId}/update`}
            >
              {" "}
              {getRoundText()}
            </Button>
          ) : (
            <p>Waiting on {nextUserName}</p>
          )}
        </div>
      );
    };

    return (
      <main className="story-main-page page main story">
        {story && story?.completed ? (
          <StoryDisplay
            userId={userId}
            storyData={story}
            isCreator={isCreator}
            publicDisplay={false}
          />
        ) : (
          inProgressTemplate()
        )}
      </main>
    );
  } else {
    return (
      <main className="story-main-page page main story">
        <h1>This is not a valid story id</h1>
      </main>
    );
  }
}
