export interface CodeHighlighter {
  highlightCode(code: string, lang: string): Promise<string>;
}
