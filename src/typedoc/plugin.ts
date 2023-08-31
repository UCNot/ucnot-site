import { Application } from 'typedoc';
import { UCNotTheme } from './ucnot.theme.js';

export function load(app: Application): void {
  app.renderer.defineTheme('ucnot', UCNotTheme);
}
