"use client";
import { useState, useRef, type FC } from "react";
import { useRouter } from "next/navigation";
import Input from "../input/input";
import Button from "../button/button";
type SegmentFormProps = {
  userId: string;
  storyId: string;
  promptText?: string;
};

/** Segment component */
const SegmentForm: FC<SegmentFormProps> = ({ userId, storyId, promptText }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("");
  const [reveal, setReveal] = useState("");
  const textareaRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await fetch(`/api/${userId}/stories/${storyId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          authorId: userId,
          storyId,
          reveal,
          promptText,
        }),
      });
      if (result.ok) {
        setMessage("Segment added successfully");
        setTimeout(() => {
          router.push(`/${userId}`);
        }, 1500);
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const handleCreateReveal: React.MouseEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    e.preventDefault();
    if (textareaRef.current) {
      const { selectionStart, selectionEnd } = textareaRef.current;
      const highlightedText = content.substring(selectionStart, selectionEnd);
      if (highlightedText && highlightedText.length > 0) {
        setReveal(highlightedText);
      }
    }
  };

  const createNewSegmentTemplate = () => {
    return (
      <section className="segment segment--create">
        {reveal && reveal.length > 0 && (
          <div className="reveal-wrapper">
            <span>This is what the player will see:</span>
            <p>{reveal}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            id="content"
            label="Write your next instalment"
            type="textarea"
            rows={10}
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="form-buttons">
            {reveal && reveal.length > 0 && (
              <Button type="submit" el="button" disabled={loading}>
                {loading ? "...submission in progress" : "Submit"}
              </Button>
            )}
            {reveal.length === 0 && (
              <Button
                onClick={handleCreateReveal}
                el="button"
                disabled={content.length === 0}
              >
                Select and Create Reveal
              </Button>
            )}
          </div>
        </form>
      </section>
    );
  };

  return (
    <section className="segment">
      <div className="segment--content">{createNewSegmentTemplate()}</div>
    </section>
  );
};

export default SegmentForm;
