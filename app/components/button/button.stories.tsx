import type { Meta, StoryObj } from "@storybook/react";
import Button from "./button";
import svgs from '../../../public/vectors';
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
      }
    },
    as: {
      control: { type: "select" },
      options: ["button", "link"],
      description: "The appearance style to render the element as: 'button' or 'link'.",
      table: {
        type: { summary: "'button' | 'link'" },
        defaultValue: { summary: "'button'" },
      },
    },
    svg:{
      control: { type: "select" },
      options: Object.keys(svgs),
      description: "Name of the SVG icon to render inside the button, if any.",
      table: {  
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    }
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
    as: "button",
    onClick: () => alert("Button clicked!"),
    children: "Click Me",
  },
  decorators: [
    (Story) => (
      <Story />
    ),
  ],
};
export const LinkElement: Story = {
  args: {
    el: "link",
    href: "#",
    as: "link",
    children: "Click Me",
  },
  decorators: [(Story) => <Story />],
};
