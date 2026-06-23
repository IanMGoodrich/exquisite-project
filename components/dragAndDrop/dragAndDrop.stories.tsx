import type { Meta, StoryObj } from "@storybook/react";
import DragAndDrop from "./dragAndDrop";
import {
  Description,
  Title,
  Canvas,
  Controls,
} from "@storybook/addon-docs/blocks";

const meta: Meta<typeof DragAndDrop> = {
  component: DragAndDrop,
  tags: ["autodocs"],
  argTypes: {
    id: {
      control: { type: "text" },
      description: "Id of the input.",
    },
    label: {
      control: { type: "text" },
      description:
        "The appearance style to render the element as: 'button' or 'link'.",
    },
    onFileAccepted: {
      description: "Success hand;er",
      table: {
        type: { summary: "(file: File) => Promise<void>" },
      },
    },
    onFileRejected: {
      description: "Failure handler.",
      table: {
        type: { summary: "(errors: string[]) => void" },
      },
    },
    accept: {
      description: "Type of file accepted [array of accepted file formats].",
      table: {
        type: {
          summary:
            'Example: ("image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"]',
        },
      },
    },
    maxSize: {
      description: "Max size of accepted image",
      table: {
        type: { summary: "Example: {5 * 1024 * 1024}" },
      },
    },
    placeholder: {
      control: { type: "text" },
      description: "Placeholder text",
    },
    disabled: {
      description: "Boolean state condition"
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

type Story = StoryObj<typeof DragAndDrop>;

export const Default: Story = {
  args: {
    id: "image",
    label: "Profile Image (optional)",
    placeholder: "Drop your photo here, or click to browse",
    onFileAccepted: (file: File) => console.log('File accepted:', file.name),
    onFileRejected: (errors: string[]) => console.log('File rejected:', errors),
  },
  render: (args) => (
    <form>
      <DragAndDrop {...args} />
    </form>
  ),
};
