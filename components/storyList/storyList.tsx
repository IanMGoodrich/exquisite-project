"use client";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "../dropdown/dropdown";
import Button from "../button/button";
import RemoveUserButton from "../removeUserButton/removeUserButton";
import { PositionAbsoluteOptions } from "../dropdown/dropdown";
type StoryListVariant = "completed" | "in-progress" | "public";

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
  contributorOrder: string[] | null;
  promptImageUrl: string | null;
  promptText: string | null;
  sharePrompt: string | null;
  isPublic: boolean;
  maxTurns: number;
};

type StoryListProps = {
  userID: string;
  variant: StoryListVariant;
  initialUserStoryData?: StoryData[];
  absolute?: PositionAbsoluteOptions;
};

const StoryList: React.FC<StoryListProps> = ({
  userID,
  variant,
  initialUserStoryData,
  absolute,
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
  const dropdownAbsolutePosition = !absolute ? "both" : absolute;

  const storiesListTemplate = () => {
    if (!stories || !Array.isArray(stories)) return null;

    const selectedStories = (): Array<StoryData> => {
      if (variant === "in-progress") {
        return stories
          .filter((story: StoryData) => !story.completed)
          .sort(
            (a: StoryData, b: StoryData) =>
              Date.parse(b.createdAt as unknown as string) -
              Date.parse(a.createdAt as unknown as string),
          );
      }
      if (variant === "public") {
        return stories
          .filter((story: StoryData) => story.isPublic && story.completed)
          .sort(
            (a: StoryData, b: StoryData) =>
              Date.parse(b.completedAt as unknown as string) -
              Date.parse(a.completedAt as unknown as string),
          );
      }
      if (variant === "completed") {
        return stories
          .filter((story: StoryData) => story.completed)
          .sort(
            (a: StoryData, b: StoryData) =>
              Date.parse(b.completedAt as unknown as string) -
              Date.parse(a.completedAt as unknown as string),
          );
      }
      return [];
    };

    return selectedStories()
      .map(
        (story: StoryData) =>
          (variant !== "in-progress" ||
            (variant === "in-progress" &&
              story.contributorOrder &&
              story.contributorOrder.includes(userID))) && (
            <li key={story.id}>
              <Button
                as="link"
                el="link"
                className={`button as-link ${story.nextContributorId === userID ? "story-ready" : ""}`}
                href={`${userID}/stories/${story.id}`}
              >
                {story.title}
              </Button>
              <RemoveUserButton
                variant={variant === "completed" ? "remove" : "leave"}
                listVariant={variant}
                storyId={story.id}
                userId={userID}
                userToRemoveId={userID}
              />
            </li>
          ),
      );
  };

  return (
    <>
      <div className={`profile-homepage--stories-list ${variant} mobile`}>
        <Dropdown label="view stories" absolute={dropdownAbsolutePosition}>
          {storiesListTemplate()}
        </Dropdown>
      </div>
      <ul className={`profile-homepage--stories-list ${variant} desktop`}>
        {storiesListTemplate()}
      </ul>
    </>
  );
};

export default StoryList;
