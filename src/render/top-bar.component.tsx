import { JSX } from 'typedoc';
import { PageContext } from './page-context.js';

export function TopBar({ context }: { readonly context: PageContext }): JSX.Element {
  return (
    <header class="uc-top-bar">
      <div class="top-bar">
        <div class="top-bar-left">
          <a
            href={context.relative('/index.html')}
            class="title"
            title="URI Charge Notation"
          >
            UCNot
          </a>
        </div>
        <div class="top-bar-right">
          <ul class="menu">
            <li>
              <a href={context.relative('/api-doc/index.html')}>API Docs</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
