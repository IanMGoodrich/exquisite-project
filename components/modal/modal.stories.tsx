import type { Meta, StoryObj } from "@storybook/react";
import Modal from "./modal";
import Image from "../image/image";
import Button from "../button/button";
import {
  Description,
  Title,
  Canvas,
  Controls,
} from "@storybook/addon-docs/blocks";

const meta: Meta<typeof Modal> = {
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: { type: "text" },
      description: "H3 title. (optional)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    variant: {
      control: { type: "select" },
      options: ['inspiration','default'],
      description: "Style options",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "default" },
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

type Story = StoryObj<typeof Modal>;

export const Primary: Story = {
  args: {
    title: "Test Modal",
    variant: 'inspiration',

    onClose: () => console.log('close clicked'),
  },
  render: (args) => (
    <div>
      <Modal {...args}>
        <>
          <Image
            src={"/images/placeholder.webp"}
            alt=""
            variant="display"
            width={600}
            height={600}
          />
          <Button el="button" onClick={() => console.log('button clicked')}>
            Get another image
          </Button>
        </>
      </Modal>
    </div>
  ),
};
