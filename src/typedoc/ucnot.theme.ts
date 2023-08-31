import {
  DefaultTheme,
  DefaultThemeRenderContext,
  JSX,
  PageEvent,
  Reflection,
  RenderTemplate,
} from 'typedoc';
import { ucnotLayout } from './ucnot.layout.js';

export class UCNotTheme extends DefaultTheme {

  #context?: UCNotThemeRenderContext;

  override getRenderContext(pageEvent: PageEvent<Reflection>): DefaultThemeRenderContext {
    return (this.#context ??= new UCNotThemeRenderContext(
      this,
      pageEvent,
      this.application.options,
    ));
  }

}

class UCNotThemeRenderContext extends DefaultThemeRenderContext {

  override defaultLayout = (
    template: RenderTemplate<PageEvent<Reflection>>,
    props: PageEvent<Reflection>,
  ): JSX.Element => ucnotLayout(this, template, props);

}
