import { JSX } from 'typedoc';
import { TargetFile } from '../fs/target-file.js';
import { MdOutput } from '../render/md-renderer.js';
import { PageContext } from '../render/page-context.js';
import { PageTemplate } from '../render/page.template.js';
import { SiteData, SitePage, SitePageAttrs } from './site-page.js';

export class MdSitePage extends SitePage {

  readonly #htmlFile: TargetFile;
  readonly #template: PageTemplate;
  readonly #output: MdOutput;

  constructor(htmlFile: TargetFile, template: PageTemplate, output: MdOutput) {
    super();

    this.#htmlFile = htmlFile;
    this.#template = template;
    this.#output = output;
  }

  get link(): string {
    return this.#htmlFile.link;
  }

  get attrs(): SitePageAttrs {
    return this.#output.attrs;
  }

  async renderPage({ navLinks }: SiteData): Promise<void> {
    const context = new PageContext(this.link);
    const html = this.#template({
      context,
      navLinks,
      output: this.#output,
    });

    await this.#htmlFile.writeText(JSX.renderElement(html));
  }

}
