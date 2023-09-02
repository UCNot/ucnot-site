import { JSX } from 'typedoc';
import { MdOutput } from '../render/md-renderer.js';
import { PageContext } from '../render/page-context.js';
import { PageTemplate } from '../render/page.template.js';
import { SiteData, SitePage } from './site-page.js';

export class MdSitePage implements SitePage {

  readonly #htmlPath: string;
  readonly #template: PageTemplate;
  readonly #output: MdOutput;

  constructor(htmlPath: string, template: PageTemplate, output: MdOutput) {
    this.#htmlPath = htmlPath;
    this.#template = template;
    this.#output = output;
  }

  get link(): string {
    return this.#htmlPath;
  }

  get text(): string {
    return this.#output.attrs.title ?? this.link;
  }

  async renderPage({ targetLayout, navLinks }: SiteData): Promise<void> {
    const context = new PageContext(this.#htmlPath);
    const html = this.#template({
      context,
      navLinks,
      output: this.#output,
    });

    await targetLayout.siteDir().openFile(this.#htmlPath).writeText(JSX.renderElement(html));
  }

}
