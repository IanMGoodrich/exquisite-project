"use client";

import { useState, useRef, type FC } from "react";
import { useRouter } from 'next/navigation'; // Correct import for App Router
import Segment from "../segment/segment";
import {
  type StoryType,
  type SegmentType,
  type UserType,
} from "../../../lib/types";
import Button from "../button/button";
import Input from "../input/input";
import Icon from "../icon/icon";
import './storyDisplay.css';
interface StoryDisplayProps {
  storyData: StoryType;
  isCreator: boolean;
  userId: string;
}

const StoryDisplay: FC<StoryDisplayProps> = ({
  storyData,
  isCreator,
  userId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [titleInputExpanded, setTitleInputExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState(storyData.title);
  const titleRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const getContributor = (authorId: string) => {
    const userInfo = storyData.contributors.filter(
      (user: UserType) => user.id === authorId,
    )[0];
    return userInfo;
  };

  const currentUserLikes = (userId: string, segmentData: SegmentType) =>
    segmentData.likedBy
      ? segmentData.likedBy?.some((user) => user.userId === userId)
      : false;

  const handleTitleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const storyId = storyData.id;
    if (newTitle.trim() !== "") {
      setLoading(true);
      try {
        const result = await fetch(`/api/${userId}/stories/${storyId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             title: newTitle 
          }),
        });
        if (result.ok) {
          console.log("title updated successfully");
        }
      } catch (err) {
        setError(`The following error is reported: ${err}`);
        console.error(err);
        setLoading(false)
      } finally {
        setTimeout(() => {
          setLoading(false);
          setTitleInputExpanded(false);
          return router.refresh()
        }, 1500);
      }
    }
  };

  return (
    <section className="story-display" data-expanded={isExpanded}>
      <div className="story-display--title-wrapper">
        <div className="story-display--title-editable">
          {!titleInputExpanded && 
          <h1>{storyData.title}</h1>}
          {isCreator && !titleInputExpanded && (
            <Button
              el="button"
              as="button"
              classes="edit-button"
              onClick={() => setTitleInputExpanded(!titleInputExpanded)}
            >
            <Icon name="pen" />
            </Button>
          )}
        </div>
        {titleInputExpanded && (
          <div className="story-display--title-edit-form">
            <form onSubmit={handleTitleUpdate}>
              <Input
                type="text"
                label="edit story title"
                labelHidden
                id="story_title_input"
                ref={titleRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div className="form-buttons">
                <Button el="button" as="button" type="submit">
                  { loading ? "Updating" : "Change Title"}
                </Button>
                <Button el="button" as="button" onClick={() =>setTitleInputExpanded(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="story-display--story-content">
        {storyData.content &&
          storyData.content.length > 0 &&
          storyData.content.map((segment) => (
            <Segment
              currentUserLikes={currentUserLikes(userId, segment)}
              key={segment.id}
              currentUserId={userId}
              author={getContributor(segment.authorId)}
              content={segment}
              isExpandable={isExpanded}
            />
          ))}
        <Button
          el="button"
          as="button"
          classes="extra-content-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "View story" : "View extra content"}
        </Button>
      </div>
    </section>
  );
};

export default StoryDisplay;
