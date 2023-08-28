import { HtmlTemplate, HtmlTemplateData } from './html-template.js';

export interface TemplateEngine {
  openPageTemplate(template: string): HtmlTemplate<HtmlTemplateData>;
}

export interface PageTemplateData extends HtmlTemplateData {
  readonly title: string;
  readonly content: string;
}
