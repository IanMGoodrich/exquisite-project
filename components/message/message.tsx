"use client";
import { useState } from "react";
import Button from "@/components/button/button";
import Input from "@/components/input/input";
import ImageWrapper from "../image/image";
import "./message.css";

export type MessageProps = {
  id: string;
  senderId: string;
  userId?: string; // Optional here, provided by parent MessageThread
  senderName?: string;
  threadId: string;
  content: string;
  createdAt: Date;
  replies?: MessageProps[];
  parentMessageId?: string | null;
  parentMessage?: MessageProps;
  readBy?: string[];
  sender: {
    id: string;
    userName: string | null;
    image: string | null;
  };
};

const Message: React.FC<MessageProps> = ({
  id,
  userId,
  threadId,
  senderName,
  sender,
  content,
  createdAt,
  replies,
}) => {
  const [reply, setReply] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [repliesExpanded, setRepliesExpanded] = useState(false);

  // Use senderName if provided, otherwise use sender.userName
  const displayName = senderName || sender.userName || "Unknown User";

  const handleReply = () => {
    setReplyOpen(true);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("User not authenticated");
      return;
    }

    if (!reply.trim()) {
      alert("Message cannot be empty");
      return;
    }

    const replyResponse = await fetch(`/api/${userId}/chat/messages/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: reply.trim(),
        parentMessageId: id,
        threadId: threadId,
      }),
    });

    if (replyResponse.ok) {
      const createdReply = await replyResponse.json();
      console.log(`Reply created successfully:`, createdReply);
      setReply("");
      setReplyOpen(false);
      // TODO: Consider refreshing thread data or optimistically updating UI
      alert("Reply sent successfully!");
    } else {
      const errorData = await replyResponse.json();
      console.error("Reply creation error:", errorData);
      alert(`Failed to send reply: ${errorData.error}`);
    }
  };

  return (
    <div key={id} className="message">
      <div className="message--header">
        <Button
          className="message--sender"
          as="link"
          el="link"
          href={`/${sender ? sender.id : () => Math.random().toFixed(4).toString()}`}
        >
          <ImageWrapper
            className="message--sender-icon"
            loading="lazy"
            width={25}
            height={25}
            variant="circle"
            src={sender?.image || "/public/images/placeholder.webp"}
            alt={`image for ${sender?.userName}`}
          />
          <span className="message--sender-name">{sender?.userName}</span>
        </Button>
        <span className="timestamp">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>

      <div className="message-content">{content}</div>
      <div className="message--actions">
        {replies && replies.length > 0 && (
          <Button
            svg={repliesExpanded ? "chevron-up" : "chevron-down"}
            variant="icon-only"
            el="button"
            as="button"
            aria-label="expand replies"
            onClick={() => setRepliesExpanded(!repliesExpanded)}
          ></Button>
        )}
        <Button
          svg="reply"
          variant="icon-only"
          el="button"
          as="button"
          aria-label="open reply form"
          classes="message--reply-button"
          onClick={() => handleReply()}
        ></Button>
      </div>
      {replies && replies.length > 0 && repliesExpanded && (
        <div className="message--replies">
          {replies.map((reply) => (
            <Message key={reply.id} {...reply} userId={userId} />
          ))}
        </div>
      )}
      {replyOpen && (
        <div className="message-reply">
          <form>
            <Input
              id="reply"
              type="textarea"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              label={`Replying to ${displayName}`}
              labelHidden
              placeholder={`Replying to ${displayName}`}
            />
            <Button
              variant="primary"
              el="button"
              as="button"
              onClick={handleReplySubmit}
            >
              Reply
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Message;
