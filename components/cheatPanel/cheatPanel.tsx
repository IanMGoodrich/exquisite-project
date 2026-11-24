"use client";
import { useState, useEffect } from "react";
import type { MouseEventHandler } from "react";
import './cheatPanel.css';

export type CheatPanelProps = {
  userId: string;
  storyId: string;
  onClick: MouseEventHandler<HTMLElement>;
  previewContent?: string;
};

const CheatPanel = ({
  userId,
  storyId,
  onClick,
  //for SB only
  previewContent,
}: CheatPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toDisplay, setToDisplay] = useState(false);
  const [content, setContent] = useState("");
  //for SB only
  const displayContent = previewContent ?? content;
  //for SB only
  const shouldDisplay =
    previewContent !== undefined ? previewContent.length > 0 : toDisplay;

  useEffect(() => {
    if (previewContent !== undefined) {
      return;
    }

    const lastSegment = async () => {
      const response = await fetch(`/api/${userId}/stories/${storyId}`, {
        method: "GET",
      });
      if (!response.ok) {
        setContent("Error: Something bad happened");
        throw new Error("Something bad happened");
      }
      const data = await response.json();
      if (!data.data && data.length > 0) {
        setContent(data[0].content);
        return setToDisplay(true);
      }
    };
    lastSegment();
  }, [userId, storyId, previewContent]);

  useEffect(() => {
    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const closeOnSegmentSubmit = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).classList.contains("create-reveal-button")
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEsc);
    window.addEventListener("click", closeOnSegmentSubmit);
    return () => {
      window.removeEventListener("keydown", closeOnEsc);
      window.removeEventListener("click", closeOnSegmentSubmit);
    };
  }, []);

  const handleSummaryClick: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    setIsOpen((open) => !open);
    onClick(event);
  };

  return (
    <section className="cheat-panel">
      {shouldDisplay && (
        <details className="cheat-panel--detail" open={isOpen}>
          <summary
            className="cheat-panel--summary"
            onClick={handleSummaryClick}
          >
            <span className="button as-button cheat-panel--button">
              {isOpen ? "Close" : "View your last segment"}
            </span>
          </summary>
          <div className="cheat-panel--content-wrapper">
            <p className="cheat-panel--content">{displayContent}</p>
          </div>
        </details>
      )}
    </section>
  );
};

export default CheatPanel;
