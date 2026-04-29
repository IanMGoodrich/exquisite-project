import { MessageProps } from "@/components/message/message";
import Button from "@/components/button/button";
import ImageWrapper from "@/components/image/image";
import Message from "@/components/message/message";
import "./messageThread.css";

type participant = {
  id: string;
  image: string | null;
  userName: string | null;
};

type MessageThreadProps = {
  threadId: string;
  participants: participant[];
  subject: string | null;
  pinned?: boolean;
  messages: MessageProps[];
  createdAt: Date;
  userId: string; // Current authenticated user
};

const MessageThread: React.FC<MessageThreadProps> = ({
  threadId,
  participants,
  subject,
  pinned,
  messages,
  createdAt,
  userId,
}) => {
  return (
    <details key={threadId} className="message-thread">
      <summary className="message-thread--header">
        <h3 className="message-thread--title">{subject || "No Subject"}</h3>
        <ul className="message-thread--participants">
          {participants
            .filter((p) => p.id !== userId)
            .map((p) => (
              <li key={p.id}>
                <Button
                  className="message-thread--participant"
                  as="link"
                  el="link"
                  href={`/${p.id}`}
                >
                  <ImageWrapper
                    className="message-thread--participant-icon"
                    loading="lazy"
                    width={25}
                    height={25}
                    variant="circle"
                    src={p.image || "../../../public/images/placeholder.webp"}
                    alt={`image for ${p.userName}`}
                  />
                  <span className="message-thread--participant-name">
                    {p.userName}
                  </span>
                </Button>
              </li>
            ))}
        </ul>
      </summary>
      {messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message.id} {...message} userId={userId} />
        ))
      ) : (
        <p>No messages in this thread yet.</p>
      )}
      {/* <Button el="link" as="button">
        View Thread
      </Button> */}
    </details>
  );
};
export default MessageThread;
