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
  parameters: {
    controls: {
      include: [  "label", "id", "type", "placeholder"],
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
    label: "Your name",
    id: "name",
    type: "text",
    placeholder: "Enter your name",
  },  
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  decorators: [
    (Story) => (
      // <div style={{width: '300px', height: 'auto'}}>
      <Story />
      // </div>
    ),
  ],
};

