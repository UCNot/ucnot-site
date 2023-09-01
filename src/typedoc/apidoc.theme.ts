import {
  DefaultTheme,
  DefaultThemeRenderContext,
  JSX,
  PageEvent,
  Reflection,
  RenderTemplate,
} from 'typedoc';
import { PageContext } from '../render/page-context.js';
import { apiDocLayout } from './apidoc.layout.js';
import { apiDocToolbar } from './apidoc.toolbar.js';

export class ApiDocTheme extends DefaultTheme {

  readonly #contexts = new Map<string, ApiDocThemeRenderContext>();

  override getRenderContext(pageEvent: PageEvent<Reflection>): ApiDocThemeRenderContext {
    const { url } = pageEvent;
    let context = this.#contexts.get(url);

    if (!context) {
      context = new ApiDocThemeRenderContext(this, pageEvent, this.application.options);
      this.#contexts.set(url, context);
    }

    return context;
  }

}

export class ApiDocThemeRenderContext extends DefaultThemeRenderContext {

  #pageContext?: PageContext;

  override defaultLayout = (
    template: RenderTemplate<PageEvent<Reflection>>,
    props: PageEvent<Reflection>,
  ): JSX.Element => apiDocLayout(this, template, props);

  override toolbar = (props: PageEvent<Reflection>): JSX.Element => apiDocToolbar(this, props);

  get pageContext(): PageContext {
    if (this.#pageContext) {
      return this.#pageContext;
    }

    return (this.#pageContext = new PageContext(`/api-doc/${this.page.url}`));
  }

}
