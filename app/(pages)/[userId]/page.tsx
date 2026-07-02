import { getAuthenticatedUserWithStories } from "../../../lib/auth-utils";
import ImageWrapper from "@/components/image/image";
import Button from "@/components/button/button";
import MessageThread from "@/components/messageThread/messageThread";
import MessageForm from "@/components/messageForm/messageForm";
import Dropdown from "@/components/dropdown/dropdown";
type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserHomePage({ params }: Props) {
  const { userId } = await params;
  const user = await getAuthenticatedUserWithStories(userId);

  const storiesListTemplate = (isCompleted: boolean) => {
    return user.stories
      .filter((story) => (isCompleted ? story.completed : !story.completed))
      .map((story) => (
        <li key={story.id}>
          <Button
            as="link"
            el="link"
            className="button as-link"
            href={`${userId}/stories/${story.id}`}
          >
            {story.title}
          </Button>
        </li>
      ));
  };

  const messageListTemplate = () => {
    return user.messageThreads.map((thread) => (
      <li key={`item-${thread.threadId}`}>
        <MessageThread
          key={thread.threadId}
          threadId={thread.threadId}
          participants={thread.participants}
          subject={thread.subject}
          pinned={thread.pinned}
          messages={thread.messages}
          createdAt={thread.createdAt}
          userId={userId}
        />
      </li>
    ));
  };

  return (
    <div className="profile-homepage">
      <h1 className="profile-homepage--heading">Hello {user.userName}!</h1>
      <div className="profile-homepage--upper-content">
        {user.image && (
          <div className="profile-homepage--hero">
            <div className="profile-homepage--image-wrapper">
              <ImageWrapper
                loading="lazy"
                width={250}
                height={250}
                variant="circle"
                src={user.image}
                alt={`image for ${user.userName}`}
                placeholder="blur"
                blurDataURL="../../../public/images/placeholder.webp"
              />
            </div>
            {user.profileColumnOne && (
              <div
                className="profile-homepage--profile-text upper"
                dangerouslySetInnerHTML={{ __html: user.profileColumnOne }}
              />
            )}
          </div>
        )}
      </div>
      <div className="profile-homepage--main-content">
        <div className="profile-homepage--messages">
          <h2>Conversations</h2>
          {user.messageThreads.length > 0 ? (
            <>
            <div className="profile-homepage--messages-wrapper mobile">
              <Dropdown label="open messages" forceClose>
                  {messageListTemplate()}
              </Dropdown>
            </div>
            <ul className="profile-homepage--messages-wrapper desktop">
              {messageListTemplate()}
            </ul>
            </>
          ) : (
            <p>No messages yet. Start a conversation!</p>
          )}
          <MessageForm userId={userId} />
        </div>
        <div className="profile-homepage--stories-wrapper">
          <div className="profile-homepage--stories-list-wrapper">
            <span className="label">Completed stories</span>
            {user.stories &&
            user.stories.filter((story) => story.completed).length > 0 ? (
              <>
                <div className="profile-homepage--stories-list completed mobile">
                  <Dropdown label="view stories">
                    {storiesListTemplate(true)}
                  </Dropdown>
                </div>
                <ul className="profile-homepage--stories-list completed desktop">
                  {storiesListTemplate(true)}
                </ul>
              </>
            ) : (
              <span className="label">Begin a new story</span>
            )}
          </div>
          <div className="profile-homepage--stories-list-wrapper">
            <span className="label">Stories in progress</span>
            {user.stories &&
            user.stories.filter((story) => !story.completed).length > 0 ? (
              <>
                <div className="profile-homepage--stories-list in-progress mobile">
                  <Dropdown label="view stories">
                    {storiesListTemplate(false)}
                  </Dropdown>
                </div>
                <ul className="profile-homepage--stories-list in-progress desktop">
                  {storiesListTemplate(false)}
                </ul>
              </>
            ) : (
              <span className="label">Time to start a new story</span>
            )}
          </div>
        </div>
        <div>
          <Button el="link" as="button" href={`${userId}/stories/create`}>
            Create New Story
          </Button>
        </div>
      </div>
      {user.profileColumnTwo && (
        <div
          className="profile-homepage--lower-content"
          dangerouslySetInnerHTML={{ __html: user.profileColumnTwo }}
        />
      )}
    </div>
  );
}
