import { HtmlTemplate, HtmlTemplateData } from '../render/html-template.js';
import { TemplateEngine } from '../render/template-engine.js';
import { SourceFile } from './source-file.js';

export class HtmlTemplateFile<in TData extends HtmlTemplateData> implements HtmlTemplate<TData> {

  readonly #engine: TemplateEngine;
  readonly #file: SourceFile;
  #template?: Promise<HtmlTemplate<TData>>;

  constructor(engine: TemplateEngine, file: SourceFile) {
    this.#engine = engine;
    this.#file = file;
  }

  async renderHtml(data: TData): Promise<string> {
    const template = await this.#getTemplate();

    return await template.renderHtml(data);
  }

  #getTemplate(): Promise<HtmlTemplate<TData>> {
    return (this.#template ??= this.#loadTemplate());
  }

  async #loadTemplate(): Promise<HtmlTemplate<TData>> {
    const templateText = await this.#file.readText();

    return this.#engine.openPageTemplate(templateText);
  }

}
