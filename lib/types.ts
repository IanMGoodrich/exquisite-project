export type StoryType = {
  id: string;
  title: string;
  createdAt: Date | undefined;
  updatedAt?: Date | undefined;
  completed?: boolean;
  contributors: UserType[];
  content: SegmentType[];
  rounds?: number;
  completedRounds?: number;
  completedAt?: Date | null;
  nextContributorId?: string;
}

export type SegmentType = {
  id: string;
  authorId: string;
  createdAt: Date | undefined;
  storyId: string;
  content: string;
  promptText?: string | null;
  likedBy?: {userId: string}[];
  reveal?: string | null;
}

export type UserType = {
  id: string;
  nameFirst?: string | null;
  nameLast?: string | null;
  email: string | null;
  phone?: string | null;
  userName?: string | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  loggedOn?: boolean;
  stories?: string[];
  authoredSegments?: string[];
  likedSegments?: string[];
}