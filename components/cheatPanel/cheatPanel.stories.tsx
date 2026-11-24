import type { Meta, StoryObj } from "@storybook/react";
import CheatPanel from "./cheatPanel";

import {
  Description,
  Title,
  Canvas,
  Controls,
} from "@storybook/addon-docs/blocks";

const meta: Meta<typeof CheatPanel> = {
  component: CheatPanel,
  tags: ["autodocs"],
  parameters: {
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

type Story = StoryObj<typeof CheatPanel>;

export const CheatPanelComponent: Story = {
  args: {
    userId: "storybook-user",
    storyId: "storybook-story",
    previewContent: "This is a sample of the last segment, shown without making an API request.",
    onClick: () => console.log("clicked"),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(50vh - 2rem)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
