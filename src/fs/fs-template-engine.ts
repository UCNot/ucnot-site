import { HtmlTemplate, HtmlTemplateData } from '../render/html-template.js';
import { TemplateEngine } from '../render/template-engine.js';
import { HtmlTemplateFile } from './html-template-file.js';
import { SourceLayout } from './source-layout.js';

export class FsTemplateEngine implements TemplateEngine {

  readonly #sourceLayout: SourceLayout;
  readonly #templateEngine: TemplateEngine;

  constructor({
    sourceLayout,
    templateEngine: templateEngine,
  }: {
    readonly sourceLayout: SourceLayout;
    readonly templateEngine: TemplateEngine;
  }) {
    this.#sourceLayout = sourceLayout;
    this.#templateEngine = templateEngine;
  }

  openPageTemplate(templateFile: string): HtmlTemplate<HtmlTemplateData> {
    return new HtmlTemplateFile(
      this.#templateEngine,
      this.#sourceLayout.templatesDir().openFile(templateFile),
    );
  }

}
