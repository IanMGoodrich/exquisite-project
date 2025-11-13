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
    controls: {
      include: ["content", "author", "isExpandable", "likes"],
    },
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
  args: {
    content:
      "This is a sample segment content that can be expanded to show more details about the segment. It provides insights and additional information when expanded.",
    author: "John Doe",
    isExpandable: true,
    likes: ["Alice", "Bob", "Charlie"],
  },
};

export default meta;

type Story = StoryObj<typeof Segment>;

export const Expandable: Story = {
  args: {
    content:
      "This is a sample segment content that can be expanded to show more details about the segment. It provides insights and additional information when expanded.",
    author: "John Doe",
    isExpandable: true,
    likes: ["Alice", "Bob", "Charlie"],
  },
  decorators: [
    (Story) => (
      <Story />
    ),
  ],
};

export const NotExpandable: Story = {
  args: {
    content:
      "This is a sample segment content that can be expanded to show more details about the segment. It provides insights and additional information when expanded.",
    author: "John Doe",
    isExpandable: false,
    likes: ["Alice", "Bob", "Charlie"],
  },
  decorators: [
    (Story) => (
      // <div style={{width: '300px', height: 'auto'}}>
      <Story />
      // </div>
    ),
  ],
};
