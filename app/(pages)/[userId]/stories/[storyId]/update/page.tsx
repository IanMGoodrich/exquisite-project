import { getAuthenticatedUser } from "@/lib/auth-utils";
import {
  getStorySegments,
  checkForLastSegment,
  getStoryPromptInfo,
  getUser,
  getNextContributor,
  getStoryContributors,
} from "@/lib/utilities";
import SegmentForm from "@/components/segmentForm/segmentForm";
import Image from "@/components/image/image";
type Props = {
  params: Promise<{ userId: string; storyId: string }>;
};

export default async function UpdateStoryPage({ params }: Props) {
  const { userId, storyId } = await params;

  const user = await getAuthenticatedUser(userId);
  const segments = await getStorySegments(storyId);
  const promptInfo = await getStoryPromptInfo(storyId);
  const lastReveal =
    segments.length > 0 ? segments[segments.length - 1].reveal : null;
  const previousUserId =
    segments.length > 0 ? segments[segments.length - 1].authorId : null;
  const isLast = await checkForLastSegment(storyId);
  const sharePrompt = () =>
    promptInfo &&
    promptInfo.sharePrompt !== "FALSE" &&
    promptInfo.sharePrompt !== "AT_COMPLETION";

  const { title, createdById, contributors } =
    (await getStoryContributors(storyId)) ?? {
      title: "",
      createdById: "",
      contributors: [],
    };

  const author = await getUser(createdById);
  const nextUserId = await getNextContributor(contributors.map(contrib => contrib.id), userId);
  const nextUser = await getUser(nextUserId);  
  const nextUserInfo = () => {
    if (nextUser) {
      return { userId: nextUser.id, userName: nextUser.userName };
    }
    return undefined;
  };
  const prevUser = previousUserId ? await getUser(previousUserId) : false;
  const labelTemplate = () => {
    if (prevUser) {
      return (
        <span className="last-reveal--label">
          Here&apos;s what{" "}
          <a href={`/${userId}/${previousUserId}/public`}>{prevUser.userName}</a> left you
          to work with:
        </span>
      );
    }
    return (
      <span className="last-reveal--label">
        Here&apos;s what you&apos;ve got to work with:
      </span>
    );
  };

  return (
    <div className="story-update-page">
      <h1 className="story-update-page--heading">
        It&apos;s your turn {user?.userName}
      </h1>
      {
        <h2 className="story-update-page--title">
          <q>{title}</q>
        </h2>
      }
      {
        <h3 className="story-update-page--attribution">
          by <a href={`/${userId}/${author?.id}/public`}>{author?.userName}</a>
        </h3>
      }
      {lastReveal && lastReveal.length > 0 && (
        <div className="last-reveal--wrapper">
          {labelTemplate()}
          <p className="last-reveal--text">{`"${lastReveal}..."`}</p>
        </div>
      )}
      {sharePrompt() && promptInfo?.promptImageUrl && (
        <div className="image-prompt--wrapper">
          <Image
            className="image-prompt--image"
            src={promptInfo.promptImageUrl}
            alt="random prompt image"
          />
        </div>
      )}
      {sharePrompt() && promptInfo?.promptText && (
        <div className="text-prompt--wrapper">
          <p>{promptInfo.promptText}</p>
        </div>
      )}
      <SegmentForm
        promptText={lastReveal ? lastReveal : undefined}
        userId={userId}
        storyId={storyId}
        isLast={isLast}
        nextUser={nextUserInfo()}
      />
    </div>
  );
}
