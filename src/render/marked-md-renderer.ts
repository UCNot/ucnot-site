import { _Slugger } from 'Slugger';
import GithubSlugger from 'github-slugger';
import { load as parseYaml } from 'js-yaml';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { AsyncLocalStorage } from 'node:async_hooks';
import { CodeHighlighter } from './code-highlighter.js';
import { MdAttrs, MdOutput, MdRenderer, MdTocLink } from './md-renderer.js';

export class MarkedMdRenderer implements MdRenderer {

  readonly #marked: Marked;
  readonly #mdState = new AsyncLocalStorage<MarkedMdState>();
  readonly #ghSlugger = new GithubSlugger();

  constructor({ codeHighlighter }: { readonly codeHighlighter: CodeHighlighter }) {
    this.#marked = new Marked(
      markedHighlight({
        async: true,
        langPrefix: 'uc-code uc-code-lang-',
        highlight: async (code, lang) => await codeHighlighter.highlightCode(code, lang),
      }),
      {
        hooks: {
          preprocess: this.#preprocess.bind(this),
          postprocess: html => html,
        },
        renderer: {
          heading: this.#heading.bind(this),
        },
      },
    );
  }

  #getState(): MarkedMdState {
    return this.#mdState.getStore()!;
  }

  #preprocess(markdown: string): string {
    const { attrs, body } = parseFrontmatter(markdown);

    Object.assign(this.#getState().attrs, attrs);

    return body;
  }

  #heading(text: string, level: number, raw: string, slugger: _Slugger): string {
    const ghSlug = this.#ghSlugger.slug(
      raw
        .toLowerCase()
        .trim()
        .replace(/<[!/a-z].*?>/gi, ''),
    );
    const slug = slugger.getNextSafeSlug(ghSlug, false);

    this.#addTocLink({ link: `#${slug}`, text: raw });

    return `<h${level} id="${slug}">${text}</h${level}>\n`;
  }

  #addTocLink(link: MdTocLink): void {
    this.#getState().toc.push(link);
  }

  async renderMarkdown(input: string): Promise<MdOutput> {
    return await this.#mdState.run(
      {
        attrs: {},
        toc: [],
      },
      async (): Promise<MdOutput> => this.#renderMarkdown(input),
    );
  }

  async #renderMarkdown(input: string): Promise<MdOutput> {
    const html = await this.#marked.parse(input);
    const { attrs, toc } = this.#getState();

    return {
      html: html ?? '',
      attrs,
      toc,
    };
  }

}

interface MarkedMdState {
  readonly attrs: MdAttrs;
  readonly toc: MdTocLink[];
}

interface MdFrontmatter {
  readonly attrs: MdAttrs;
  readonly body: string;
}

const FRONTMATTER_PATTERN = /^\s*\n?-{3,}\s*\n(.*)\n-{3,}\s*\n/;

function parseFrontmatter(markdown: string): MdFrontmatter {
  const match = FRONTMATTER_PATTERN.exec(markdown);

  if (!match) {
    return {
      attrs: {},
      body: markdown,
    };
  }

  return {
    attrs: parseYaml(match[1]) as MdAttrs,
    body: markdown.slice(match[0].length),
  };
}
