import { Application } from 'typedoc';
import { ApiDocTheme } from './apidoc.theme.js';

export function load(app: Application): void {
  app.renderer.defineTheme('ucnot', ApiDocTheme);
}
