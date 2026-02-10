import type { Meta, StoryObj } from "@storybook/react";
import Icon from "./icon";
import svgs from '../../../public/vectors';
import {
  Description,
  Title,
  Canvas,
  Controls,
} from "@storybook/addon-docs/blocks";

const meta: Meta<typeof Icon> = {
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name:{
      control: { type: "select" },
      options: Object.keys(svgs),
      description: "Name of the SVG icon to render.",
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

type Story = StoryObj<typeof Icon>;

export const IconComponent: Story = {
  args: {
    name: "heart",
  },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 2rem)" }}>
        <Story />
      </div>
    ),
  ],
};
