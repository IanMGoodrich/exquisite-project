"use client";
import { useState, useEffect, useRef, type FC } from "react";
import { type UserType, type SegmentType } from "../../../lib/types";
import "./segment.css";
import Button from "../button/button";

interface SegmentProps {
  content: SegmentType;
  author: UserType;
  isExpandable?: boolean;
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
  const [likesCount, setLikesCount] = useState(0);
  const [userLikes, setUserLikes] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    const likesOnLoad = () => (content.likedBy ? content.likedBy.length : 0);
    setLikesCount(likesOnLoad);
    setUserLikes(currentUserLikes);
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`/api/${currentUserId}`,{
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const userData = await response.json();
        
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to fetch current user");
      }
    };
    
    fetchCurrentUser();
  }, [currentUserLikes, content.likedBy, currentUserId]);

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
          method: "POST",
          body: JSON.stringify({ liked: userLikes, userId: currentUser?.id, userName: currentUser?.userName, email: currentUser?.email }),
        });
      } catch (error) {
        console.error("Failed to update like");
        setUserLikes(!userLikes); // Revert on error
      } finally {
        setIsUpdating(false);
      }
    }, 500);
  };

  return (
    <section className="segment">
      <div className="segment--content">
        <span className="segment--content-main">{content.content}</span>
        {isExpandable && expanded && (
          <div className="segment--content-expanded">
            <div className="segment--attribution">
              author -- <p className="author">{author.userName}</p>
            </div>
            {content.promptText && (
              <div className="segment--prompt">
                  <strong>Prompt: </strong>
                  <span>{content.promptText}</span>
              </div>
            )}
            <div className="segment--likes">
              <div className="segment--likes-wrapper">
                <span className="segment--likes-label">Like:</span>
                <span className="segment--likes-count">{likesCount}</span>
                <div className="segment--likes-button">
                  <Button
                    as="button"
                    el="button"
                    disabled={isUpdating}
                    svg="heart"
                    classes={`likes-button ${userLikes ? "liked" : ""}`}
                    onClick={() => handleLikeClick()}
                  />
                </div>
              </div>
              <div>
                {content.likedBy && content.likedBy.length > 0 && (
                  <div className="segment--liked-by">
                    Liked by:{" "}

                    {content.likedBy.map((user) => (
                      user.userId === currentUserId ? 
                      (<span key={user.userId} className="segment--liked-by-user">
                        {`You ${user.userName}`}{" "}
                      </span>) 
                      : 
                      (<a key={user.userId} href={`mailto:${user.email}`} className="segment--liked-by-user">
                        {user.userName}{" "}
                      </a>)
                    ))}
                  </div>
                )}
              </div>
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
