export type Story = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date;
  completed?: boolean;
  contributors: string[];
  content: string[];
}

export type Segment = {
  id: string;
  authorId: string;
  createdAt: Date;
  storyId: string;
  content: string;
  likedBy?: string[];
}

export type User = {
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