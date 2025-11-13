import { useState, type FC } from "react";
import "./segment.css";

interface SegmentProps {
  content: string;
  author: string;
  isExpandable?: boolean;
  likes?: string[];
}

/** Segment component */
const Segment: FC<SegmentProps> = ({
  content,
  author,
  likes,
  isExpandable,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="segment">
      <div className="segment--content">
        <span className="segment--content-main">{content}</span>

        {isExpandable && expanded && (
          <div className="segment--content-expanded">
            <div className="segment--attribution">
              <div className="segment--author">{author}</div>
            </div>

            {likes && likes.length > 0 && (
              <div className="segment--likes">
                <div className="segment--likes">
                  <span className="segment--likes-label">Like:</span>
                  <span className="segment--likes-count">{likes.length}</span>
                </div>
                {/* TODO: Add like user names on hover. */}
              </div>
            )}
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
