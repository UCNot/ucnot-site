import { EjsHtmlTemplate } from './ejs-html-template.js';
import { HtmlTemplate, HtmlTemplateData } from './html-template.js';
import { TemplateEngine } from './template-engine.js';

export class EjsTemplateEngine implements TemplateEngine {

  openPageTemplate(template: string): HtmlTemplate<HtmlTemplateData> {
    return new EjsHtmlTemplate(template);
  }

}
