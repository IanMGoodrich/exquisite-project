import type { Preview } from '@storybook/nextjs-vite'
// @ts-expect-error because ts
import '../app/globals.css';
import { availableThemes } from '../lib/constants';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "default",
      toolbar: {
        title: "Theme",
        items: availableThemes,
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    // controls: {
    //   matchers: {
    //    color: /(background|color)$/i,
    //    date: /Date$/i,
    //   },
    // },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  decorators: [
    (Story, ctx) => {
      const theme = ctx.globals.theme as string;
      document.documentElement.setAttribute("data-theme", theme);
      return Story();
    },
  ],
};

export default preview;