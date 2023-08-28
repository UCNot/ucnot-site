import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { CodeHighlighter } from './code-highlighter.js';
import { MdRenderer } from './md-renderer.js';

export class MarkedMdRenderer implements MdRenderer {

  readonly #marked: Marked;

  constructor({ codeHighlighter }: { readonly codeHighlighter: CodeHighlighter }) {
    this.#marked = new Marked(
      markedHighlight({
        async: true,
        langPrefix: 'uc-code uc-code-lang-',
        highlight: async (code, lang) => await codeHighlighter.highlightCode(code, lang),
      }),
    );
  }

  async renderMarkdown(input: string): Promise<string> {
    return (await this.#marked.parse(input)) ?? '';
  }

}
