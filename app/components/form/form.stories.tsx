import type { Meta, StoryObj } from "@storybook/react";
import Form from "./form";
import Input from "../input/input";
import Button from "../button/button";
import {
  Description,
  Title,
  Canvas,
  Controls,
} from "@storybook/addon-docs/blocks";

const meta: Meta<typeof Form> = {
  component: Form,
  tags: ["autodocs"],
  parameters: {
    controls: {
      include: ["onSave", "children"],
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
    onSave: (value) => {
      console.log("Form saved with value:", value);
    },
  },
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  decorators: [
    () => (
      <Form
        onSave={(value) => {
          console.log("Form saved with value:", value);
        }}
      >
        <Input
          label="First Name"
          id="firstName"
          placeholder="Enter your first name"
        />
        <Input
          label="Last Name"
          id="lastName"
          placeholder="Enter your last name"
        />
        <Button el="button">Submit</Button>
      </Form>
    ),
  ],
};
