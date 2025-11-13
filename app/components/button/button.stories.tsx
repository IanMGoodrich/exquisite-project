import type { Meta, StoryObj } from "@storybook/react";
import Button from "./button";
import {
  Description,
  Title,
  Canvas,
  Controls,
} from "@storybook/addon-docs/blocks";

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    el: {
      control: { type: "select" },
      options: ["button", "link"],
      description: "The HTML element to render: 'button' or 'link'.",
      table: {
        type: { summary: "'button' | 'link'" },
        defaultValue: { summary: "'button'" },
      },
    },
  },
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

type Story = StoryObj<typeof Button>;

export const ButtonElement: Story = {
  args: {
    el: "button",
    onClick: () => alert("Button clicked!"),
    children: "Click Me",
  },
  decorators: [
    (Story) => (
      // <div style={{width: '300px', height: 'auto'}}>
      <Story />
      // </div>
    ),
  ],
};
export const LinkElement: Story = {
  args: {
    el: "link",
    href: "#",
    children: "Click Me",
  },
  decorators: [
    (Story) => (
      <Story />
    ),
  ],
};
