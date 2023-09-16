import GithubSlugger from 'github-slugger';
import { load as parseYaml } from 'js-yaml';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { CodeHighlighter } from './code-highlighter.js';
import { MdAttrs, MdOutput, MdRenderer } from './md-renderer.js';
import { MenuItem } from './menu.component.js';

export class MarkedMdRenderer implements MdRenderer {

  readonly #codeHighlighter: CodeHighlighter;
  readonly #ghSlugger = new GithubSlugger();

  constructor({ codeHighlighter }: { readonly codeHighlighter: CodeHighlighter }) {
    this.#codeHighlighter = codeHighlighter;
  }

  get codeHighlighter(): CodeHighlighter {
    return this.#codeHighlighter;
  }

  slug(text: string): string {
    return this.#ghSlugger.slug(text);
  }

  async renderMarkdown(input: string, attrs?: MdAttrs): Promise<MdOutput> {
    return await new MarkedMdParser(this, attrs).renderMarkdown(input);
  }

}

class MarkedMdParser {

  readonly #renderer: MarkedMdRenderer;
  readonly #attrs: MdAttrs;
  readonly #marked: Marked;
  readonly #toc: MenuItem[] = [];

  constructor(renderer: MarkedMdRenderer, attrs: MdAttrs | undefined) {
    this.#renderer = renderer;
    this.#attrs = { ...attrs };
    this.#marked = new Marked(
      markedHighlight({
        async: true,
        langPrefix: 'uc-code uc-code-lang-',
        highlight: async (code, lang) => await this.#highlight(code, lang),
      }),
      {
        hooks: {
          preprocess: markdown => this.#preprocess(markdown),
          postprocess: html => html,
        },
        renderer: {
          heading: (text, level, raw) => this.#heading(text, level, raw),
        },
      },
    );
  }

  async #highlight(code: string, lang: string): Promise<string> {
    return await this.#renderer.codeHighlighter.highlightCode(code, lang);
  }

  #preprocess(markdown: string): string {
    const { attrs, body } = parseFrontmatter(markdown);

    Object.assign(this.#attrs, attrs);

    return body;
  }

  #heading(text: string, level: number, raw: string): string {
    const slug = this.#renderer.slug(
      raw
        .toLowerCase()
        .trim()
        .replace(/<[!/a-z].*?>/gi, ''),
    );

    this.#addTocLink({ link: `#${slug}`, text: raw });

    return `<h${level} id="${slug}">${text}</h${level}>\n`;
  }

  #addTocLink(link: MenuItem): void {
    this.#toc.push(link);
  }

  async renderMarkdown(input: string): Promise<MdOutput> {
    const html = await this.#marked.parse(input);

    return {
      html: html ?? '',
      attrs: this.#attrs,
      toc: this.#toc,
    };
  }

}

interface MdFrontmatter {
  readonly attrs: MdAttrs;
  readonly body: string;
}

const FRONTMATTER_PATTERN = /^\s*\n?-{3,}\s*\n(.*)\n-{3,}\s*\n/s;

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
