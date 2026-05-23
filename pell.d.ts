declare module "pell" {
  export interface PellOptions {
    element: HTMLElement;
    onChange?: (html: string) => void;
    defaultParagraphSeparator?: string;
    styleWithCSS?: boolean;
    actions?: string[];
    classes?: Record<string, string>;
  }

  export function init(options: PellOptions): void;
  export function exec(command: string, value?: string): void;
}
