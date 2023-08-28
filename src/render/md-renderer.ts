export interface MdRenderer {
  renderMarkdown(input: string): Promise<string>;
}
