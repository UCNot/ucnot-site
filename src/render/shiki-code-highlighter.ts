import { Highlighter, getHighlighter } from 'shiki';
import { CodeHighlighter } from './code-highlighter.js';

export class ShikiCodeHighlighter implements CodeHighlighter {

  #shiki?: Promise<ShikiState>;

  async highlightCode(code: string, lang: string): Promise<string> {
    const shiki = await this.#getShiki();

    if (shiki.languages.has(lang)) {
      return shiki.highlighter.codeToHtml(code, { lang });
    }

    return code;
  }

  #getShiki(): Promise<ShikiState> {
    return (this.#shiki ??= this.#createShiki());
  }

  async #createShiki(): Promise<ShikiState> {
    return new ShikiState(
      await getHighlighter({
        theme: 'github-dark',
      }),
    );
  }

}

class ShikiState {

  #languages?: Set<string>;

  constructor(readonly highlighter: Highlighter) {}

  get languages(): ReadonlySet<string> {
    return (this.#languages ??= new Set(this.highlighter.getLoadedLanguages()));
  }

}
