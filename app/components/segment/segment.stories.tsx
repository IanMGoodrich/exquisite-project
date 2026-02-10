import type { Meta, StoryObj } from "@storybook/react";
import Segment from "./segment";
import {
  Description,
  Title,
  Canvas,
  Controls,
} from "@storybook/addon-docs/blocks";

const meta: Meta<typeof Segment> = {
  component: Segment,
  tags: ["autodocs"],
  parameters: {
    controls: {},
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <Canvas />
          <Controls />
        </>
      ),
    },
  },
};

export default meta;

type Story = StoryObj<typeof Segment>;

export const Expandable: Story = {
  args: {
    content: {
      content:
        "This is a sample segment content that can be expanded to show more details about the segment. It provides insights and additional information when expanded.This is a sample segment content that can be expanded to show more details about the segment. It provides insights and additional information when expanded.This is a sample segment content that can be expanded to show more details about the segment. It provides insights and additional information when expanded.",
      authorId: "John Doe",
      createdAt: new Date(),
      storyId: "story1",
      id: "segment1",
      promptText: "It provides insights and additional information when expanded.",
    },
    author: {
      userName: "John Doe",
      id: "John Doe",
      email: "",
    },
    isExpandable: true,
    likes: ["userID1", "userID2", "userID3"],
    currentUserLikes: false,
    currentUserId: "userID1",
  },
  decorators: [
    (Story) => (
      <div style={{ margin: "2rem" }}>
        <Story />
      </div>
    ),
  ],
};

export const NotExpandable: Story = {
  args: {
    content: {
      content:
        "This is a sample segment content that can be expanded to show more details about the segment. It provides insights and additional information when expanded.This is a sample segment content that can be expanded to show more details about the segment. It provides insights and additional information when expanded.This is a sample segment content that can be expanded to show more details about the segment. It provides insights and additional information when expanded.",
      authorId: "John Doe",
      createdAt: new Date(),
      storyId: "story1",
      id: "segment1",
      promptText: "It provides insights and additional information when expanded.",
    },
    author: {
      userName: "John Doe",
      id: "John Doe",
      email: "",
    },
    isExpandable: false,
    likes: ["userID1", "userID2", "userID3"],
    currentUserLikes: false,
    currentUserId: "userID1",
  },
  decorators: [
    (Story) => (
      <div style={{ margin: "2rem" }}>
        <Story />
      </div>
    ),
  ],
};
