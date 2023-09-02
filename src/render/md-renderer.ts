import { MenuItem } from './menu.component.js';

export interface MdRenderer {
  renderMarkdown(input: string, attrs?: MdAttrs): Promise<MdOutput>;
}

export interface MdOutput {
  readonly html: string;
  readonly attrs: MdAttrs;
  readonly toc: readonly MenuItem[];
}

export interface MdAttrs {
  readonly title?: string | undefined;
  readonly [key: string]: unknown;
}
