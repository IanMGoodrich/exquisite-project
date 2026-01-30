"use client";
import { useState, useEffect, useRef, type FC } from "react";
import { type UserType, type SegmentType } from "../../../lib/types";
import "./segment.css";
import Button from "../button/button";

interface SegmentProps {
  content: SegmentType;
  author: UserType;
  isExpandable?: boolean;
  likes?: string[];
  currentUserId: string;
  currentUserLikes: boolean;
}

/** Segment component */
const Segment: FC<SegmentProps> = ({
  content,
  author,
  isExpandable,
  currentUserId,
  currentUserLikes,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(0);
  const [userLikes, setUserLikes] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const likesOnLoad = () => content.likedBy ? content.likedBy.length : 0    
    setLikes(likesOnLoad)
    setUserLikes(currentUserLikes)    
  },[currentUserLikes, content.likedBy]);
  
  const handleLikeClick = () => {
  setUserLikes(!userLikes); // Optimistic UI update

  
  // Clear previous pending request
  if (updateTimeoutRef.current) {
    clearTimeout(updateTimeoutRef.current);
  }
  
  // Debounce: only send request 500ms after last click
  updateTimeoutRef.current = setTimeout(async () => {
    setIsUpdating(true);
    try {
      await fetch(`/api/${currentUserId}/segments/${content.id}/like`, {
        method: 'POST',
        body: JSON.stringify({ liked: userLikes })
      });
      
    } catch (error) {
      console.error('Failed to update like');
      setUserLikes(!userLikes); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  }, 500);
};

return (
    <section className="segment">
      <div className="segment--content">
        {isExpandable && expanded && (
          <div className="segment--content-expanded--upper">
            <div className="segment--attribution">
              <div className="segment--author">author -- {author.userName}</div>
              <div className="segment--stub">
                based on {content.reveal} wrote
              </div>
            </div>
          </div>
        )}
        <span className="segment--content-main">{content.content}</span>
        {isExpandable && expanded && (
          <div className="segment--content-expanded">
            
              <div className="segment--likes">
                <div className="segment--likes-wrapper">
                  <span className="segment--likes-label">Like:</span>
                  <span className="segment--likes-count">{likes}</span>
                </div>
                <div className="segment--likes-button">
                  <Button
                    as="button"
                    el="button"
                    disabled={isUpdating}
                    svg="heart"
                    classes={`likes-button ${
                      userLikes ? "liked" : ""
                    }`}
                    onClick={() => handleLikeClick()}
                  />
                </div>
                {/* TODO: Add like user names on hover. */}
              </div>
          </div>
        )}
        {isExpandable && (
          <div className="segment--expand-toggle">
            <button
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {expanded ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Segment;
