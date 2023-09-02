export interface MdRenderer {
  renderMarkdown(input: string): Promise<MdOutput>;
}

export interface MdOutput {
  readonly html: string;
  readonly attrs: MdAttrs;
  readonly toc: readonly MdTocLink[];
}

export interface MdAttrs {
  readonly title?: string | undefined;
  readonly [key: string]: unknown;
}

export interface MdTocLink {
  readonly link: string;
  readonly text: string;
}
