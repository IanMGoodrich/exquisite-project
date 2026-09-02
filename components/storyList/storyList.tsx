"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "../dropdown/dropdown";
import Button from "../button/button";
type StoryListVariant = "completed" | "in-progress";

type StoryData = {
  id: string;
  title: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  completedAt: Date | null;
  nextContributorId: string;
  rounds: number;
  completedRounds: number;
  promptImageUrl: string | null;
  promptText: string | null;
  sharePrompt: string | null;
  acknowledged: boolean;
};

type StoryListProps = {
  userID: string;
  variant: StoryListVariant;
  initialUserStoryData?: StoryData[];
};

const StoryList: React.FC<StoryListProps> = ({
  userID,
  variant,
  initialUserStoryData,
}) => {
  const { data: stories } = useQuery({
    queryKey: [variant, userID],
    queryFn: async () => {
      const response = await fetch(`/api/${userID}/updateManager/${variant}`);
      if (!response.ok) {
        throw new Error("failed to find stories");
      }
      const json = await response.json();
      if (Array.isArray(json)) return json;
      return json?.stories ?? [];
    },
    initialData: initialUserStoryData,
    staleTime: variant === "in-progress" ? 30_000 : 30_000,
    refetchInterval: variant === "in-progress" ? 60_000 : 60_000,
    refetchIntervalInBackground: false,
  });
  const router = useRouter();

  const handleClick = async (storyId: string) => {
  const response = await fetch(`/api/${userID}/stories/${storyId}/update`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Could not acknowledge story");
  }

  router.push(`/${userID}/stories/${storyId}`);
};

  const storiesListTemplate = (isCompleted: boolean) => {
    if (!stories || !Array.isArray(stories)) return null;
    
    return stories
      .filter((story: StoryData) =>
        isCompleted ? story.completed : !story.completed,
      )
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .map((story: StoryData) => (
        <li key={story.id}>
          <Button
            as="link"
            el="button"
            className={`button as-link ${story.nextContributorId === userID ? "story-ready" : ""} ${!story.acknowledged ? "story-unchecked" : ""}`}
            onClick={() => handleClick(story.id)}
          >
            {story.title}
          </Button>
        </li>
      ));
  };

  return (
    <>
      <div className={`profile-homepage--stories-list ${variant} mobile`}>
        <Dropdown label="view stories">
          {storiesListTemplate(variant === "completed" ? true : false)}
        </Dropdown>
      </div>
      <ul className={`profile-homepage--stories-list ${variant} desktop`}>
        {storiesListTemplate(variant === "completed" ? true : false)}
      </ul>
    </>
  );
};

export default StoryList;
