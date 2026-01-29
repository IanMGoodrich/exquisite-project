"use client"

import { useState, type FC } from "react";
import Segment from '../segment/segment';
import { type StoryType, type SegmentType, type UserType } from '../../../lib/types';
import Button from '../button/button';
interface StoryDisplayProps {
  storyData: StoryType;
  isCreator: boolean;
  userId: string;
}

const StoryDisplay: FC<StoryDisplayProps> = ({ storyData, isCreator, userId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const getContributor = (authorId:string) => {
    const userInfo = storyData.contributors.filter((user:UserType) => user.id === authorId)[0];
    return userInfo;
  }
  const currentUserLikes = (userId: string, segmentData: SegmentType) => segmentData.likedBy 
  ? segmentData.likedBy?.some(user => user.userId === userId) 
  : false;
  
  return (
    <section className="story-display">
      <div>
        <h1>{storyData.title}</h1>
        {isCreator && 
          <Button el="button" as="button">Edit Title</Button>
        }
      </div>
      <div>
        <Button el="button" as="button" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? 'view story' : 'expand'}</Button>
        {storyData.content &&
          storyData.content.length > 0 &&
          storyData.content.map((segment) => (
            <Segment currentUserLikes={currentUserLikes(userId, segment)} key={segment.id} currentUserId={userId} author={getContributor(segment.authorId)} content={segment} isExpandable={isExpanded}/>
          ))}
      </div>
    </section>
  );
};

export default StoryDisplay;