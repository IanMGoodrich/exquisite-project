import type { Meta, StoryObj } from "@storybook/react";
import Input from "./input";
import {
  Description,
  Title,
  Canvas,
  Controls,
} from "@storybook/addon-docs/blocks";

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "password", "email", "number", "tel", "url"],
      defaultValue: { summary: "'text'" },
    },
  },
  parameters: {
    controls: {
      include: ["type", "label", "id", "placeholder"],
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
    type: "text",
    label: "Your name",
    id: "name",
    placeholder: "Enter your name",
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  decorators: [(Story) => <Story />],
};
