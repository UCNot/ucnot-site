import { AsyncTemplateFunction, Data, compile } from 'ejs';
import { HtmlTemplate, HtmlTemplateData } from './html-template.js';

export class EjsHtmlTemplate<in TData extends HtmlTemplateData> implements HtmlTemplate<TData> {

  readonly #template: string;
  #compiled?: AsyncTemplateFunction;

  constructor(template: string) {
    this.#template = template;
  }

  async renderHtml(data: TData): Promise<string> {
    return await this.#compile()(data as Data);
  }

  #compile(): AsyncTemplateFunction {
    return (this.#compiled ??= compile(this.#template, { async: true }));
  }

}
