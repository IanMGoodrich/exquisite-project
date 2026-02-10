import type { Meta, StoryObj } from "@storybook/react";
import Dropdown from "./dropdown";

import {
  Description,
  Title,
  Canvas,
  Controls,
} from "@storybook/addon-docs/blocks";

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: { type: "select" },
      description: "The elements to display in the dropdown menu.",
      table: {
        type: { summary: "Array<string>" },
        defaultValue: { summary: "[]" },
      },
    },
    label: {
      control: { type: "text" },
      description: "The label for the dropdown button. (optional)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    startOpen: {
      control: { type: "boolean" },
      description: "Whether the dropdown menu should be open by default.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onClickHandler: {
      action: "clicked",
      description: "Event handler for click events on dropdown items.",
      table: {
        type: { summary: "(e: React.MouseEvent) => void" },
        defaultValue: { summary: "undefined" },
      },
    },
    onKeyHandler: {
      action: "key pressed",
      description: "Event handler for keyboard events on dropdown items.",
      table: {
        type: { summary: "(e: React.KeyboardEvent) => void" },
        defaultValue: { summary: "undefined" },
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

type Story = StoryObj<typeof Dropdown>;

export const DropdownComponent: Story = {
  args: {
    label: "Select Theme",
    options: ["default", "typewriter", "floral", "sprawl", "monitor"],
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          margin: "2rem auto",
          justifyContent: "center",
        }}
      >
        <Story>
          <Dropdown />
        </Story>
      </div>
    ),
  ],
};

export const DropdownComponentWithChildren: Story = {
  args: {
    label: "Select Theme",
    children: (
      <>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          margin: "2rem auto",
          justifyContent: "center",
        }}
      >
        <Story>
          <Dropdown />
        </Story>
      </div>
    ),
  ],
};
