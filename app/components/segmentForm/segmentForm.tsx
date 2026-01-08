"use client";
import { useState, useRef, type FC } from "react";
import { useRouter } from "next/navigation";
import Button from "../button/button";
type SegmentFormProps = {
  userId: string;
  storyId: string;
};


/** Segment component */
const SegmentForm: FC<SegmentFormProps> = ({ userId, storyId }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("");
  const [reveal, setReveal] = useState("");
  const textareaRef = useRef(null);
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await fetch(
        `/api/${userId}/stories/${storyId}/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            authorId: userId,
            storyId,
            reveal,
          }),
        }
      );
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
    }
  };

  const handleCreateReveal: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if(textareaRef.current) {
      const { selectionStart, selectionEnd } = textareaRef.current;
      const highlightedText = content.substring(selectionStart, selectionEnd);
      if (highlightedText && highlightedText.length > 0) {
        setReveal(highlightedText);
      }
    }
  }


  const createNewSegmentTemplate = () => {
    return (
      <section className="segment segment--create">
        <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '0.25rem' }}>
            New Segment
          </label>
          <input
            id="content"
            type="textarea"
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}
          />
        </div>
          <div className="form-buttons">
            {reveal && reveal.length > 0 && (
            <Button type="submit" el="button">
              Submit 
            </Button>
            )
            }
            {reveal.length === 0 && (
            <Button onClick={handleCreateReveal} el="button" disabled={content.length === 0}>
              Select and Create Reveal
            </Button>
            )
            }
          </div>
        </form>
      </section>
    );
  };

  return (
    <section className="segment">
      <div className="segment--content">
       {createNewSegmentTemplate()}
      </div>
    </section>
  );
};

export default SegmentForm;
